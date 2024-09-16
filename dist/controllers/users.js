"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * author controller
 */
const path = require('path');
const fetchWordpressData_1 = require("../utils/fetchWordpressData");
const axios_1 = __importDefault(require("axios"));
const filePath = path.join(__dirname, './users.json');
exports.default = ({ strapi }) => ({
    async migrateUser(ctx) {
        const { stopPage, batch } = ctx.params;
        let page = ctx.params.page;
        let hasMorePosts = true;
        let totalPage;
        let firstPage = page;
        let increment = page * batch;
        while (hasMorePosts) {
            try {
                const data = await (0, fetchWordpressData_1.fetchJsonData)(firstPage, filePath, batch, stopPage);
                const { data: wordpressUsers, totalPages } = data;
                totalPage = totalPages;
                if (Math.ceil((increment + 1) / batch) == stopPage) {
                    hasMorePosts = false;
                    break;
                }
                if (wordpressUsers.length === 0) {
                    hasMorePosts = false;
                    break;
                }
                const strapiUsers = wordpressUsers.map((user) => ({
                    id: user === null || user === void 0 ? void 0 : user.ID,
                    username: (user === null || user === void 0 ? void 0 : user.user_login.length) < 3 ? (user === null || user === void 0 ? void 0 : user.user_login) + (user === null || user === void 0 ? void 0 : user.ID) : user === null || user === void 0 ? void 0 : user.user_login,
                    email: user === null || user === void 0 ? void 0 : user.user_email,
                    confirmed: true,
                    blocked: false,
                    // role: user?.roles,
                    firstName: user === null || user === void 0 ? void 0 : user.first_name,
                    lastName: user === null || user === void 0 ? void 0 : user.last_name,
                }));
                await Promise.all(strapiUsers.map(async (user) => {
                    //   const existingUser = await strapi.plugins['users-permissions'].services.user.fetch({ id: user.id });
                    // console.log({existingUser})
                    //   if(!existingUser){
                    await strapi.plugins['users-permissions'].services.user.add({ ...user });
                    console.log(`Page ${increment} migration completed successfully!`);
                    increment++;
                    //  }else{
                    //   console.log(`User with ${user.ID} id already exists!`);
                    //  } 
                }));
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (error.response) {
                        if (error.response.status === 400 || error.response.status === 409) {
                            if (error.response.data.message && error.response.data.message.includes('unique')) {
                                increment++;
                                continue;
                            }
                        }
                    }
                    if (error.code === "ERR_BAD_REQUEST") {
                        break;
                    }
                }
                else {
                    increment++;
                    continue;
                }
            }
        }
        ctx.send({
            success: true,
            postPerPage: batch,
            totalPages: totalPage,
            startPage: firstPage,
            lastPage: Math.ceil((increment + 1) / batch)
        });
    },
});
