"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * author controller
 */
const path = require("path");
const fs = require('fs');
const fetchWordpressData_1 = require("../utils/fetchWordpressData");
const mapField_1 = require("../utils/mapField");
const fetch_json_structure_1 = require("../utils/fetch-json-structure");
const filePath = path.join("./w_users.json");
exports.default = ({ strapi }) => ({
    async migrateUser(ctx) {
        const { stopPage, batch } = ctx.params;
        // const {userAttribute} = ctx.request.body;
        let page = ctx.params.page;
        let hasMorePosts = true;
        let totalPage;
        let countUser = page;
        let firstPage = page;
        const authorStructure = await (0, fetch_json_structure_1.fetchJsonStructure)();
        // let increment=page;
        while (hasMorePosts) {
            try {
                const data = await (0, fetchWordpressData_1.fetchJsonData)(firstPage, filePath, batch, stopPage);
                const { data: wordpressUsers, totalPages } = data;
                totalPage = totalPages;
                if (countUser == stopPage) {
                    hasMorePosts = false;
                    break;
                }
                if (wordpressUsers.length === 0) {
                    hasMorePosts = false;
                    break;
                }
                await Promise.all(wordpressUsers.map(async (user) => {
                    const userFiels = (0, mapField_1.mapFields)(user, authorStructure === null || authorStructure === void 0 ? void 0 : authorStructure.user);
                    await strapi.plugins["users-permissions"].services.user.add({
                        ...userFiels,
                    });
                    console.log(`Page ${countUser} ${stopPage} migration completed successfully!`);
                    countUser++;
                }));
            }
            catch (error) {
                console.log(error.stack, error.message);
                break;
            }
        }
        console.log("completed successfully");
        ctx.send({
            success: true,
            postPerPage: batch,
            totalPages: totalPage,
            startPage: firstPage,
            lastPage: countUser,
        });
    },
});
