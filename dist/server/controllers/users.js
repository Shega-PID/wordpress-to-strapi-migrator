"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * author controller
 */
const path = require("path");
const fs = require("fs");
const fetchWordpressData_1 = require("../utils/fetchWordpressData");
const mapField_1 = require("../utils/mapField");
const fetch_json_structure_1 = require("../utils/fetch-json-structure");
exports.default = ({ strapi }) => ({
    async migrateUser(ctx) {
        let message = "";
        let success = false;
        let totalPage;
        let page = ctx.params.page;
        let countUser = page;
        let firstPage = page;
        const { stopPage, batch } = ctx.params;
        try {
            const filePath = path.join("./w_users.json");
            // const {userAttribute} = ctx.request.body;
            let hasMorePosts = true;
            let totalPage;
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
                        const userFields = (0, mapField_1.mapFields)(user, authorStructure === null || authorStructure === void 0 ? void 0 : authorStructure.user);
                        await strapi.plugins["users-permissions"].services.user.add({
                            ...userFields, // comment this line and add your attributes
                        });
                        console.log(`User ${countUser}  migration completed successfully!`);
                        countUser++;
                    }));
                    message = "Users Migration Completed Successfully";
                    success = true;
                }
                catch (error) {
                    message = error.message;
                    success = false;
                    console.log(error.stack, error.message);
                    break;
                }
            }
        }
        catch (error) {
            message = error.message;
            success = false;
        }
        console.log("completed successfully");
        ctx.send({
            success,
            message,
            postPerPage: batch,
            totalPages: totalPage,
            startPage: firstPage,
            lastPage: countUser,
        });
    },
});
