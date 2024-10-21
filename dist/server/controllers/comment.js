"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchWordpressData_1 = __importDefault(require("../utils/fetchWordpressData"));
const mapField_1 = require("../utils/mapField");
const fetch_json_structure_1 = require("../utils/fetch-json-structure");
// const WORDPRESS_COMMENT_URL = "https://shega.co/wp-json/wp/v2/comments";
exports.default = ({ strapi }) => ({
    async migrateComments(ctx) {
        const { stopPage, batch } = ctx.params;
        let page = ctx.params.page;
        let totalPage;
        let message = "";
        let success = true;
        let firstPage = page;
        let hasMorePosts = true;
        const { restApi } = ctx.request.body;
        const authorStructure = await (0, fetch_json_structure_1.fetchJsonStructure)();
        while (hasMorePosts) {
            try {
                const data = await (0, fetchWordpressData_1.default)(page, batch, restApi);
                const { data: wordpressComments, totalPages } = data;
                totalPage = totalPages;
                if (firstPage > totalPage) {
                    message = "Invalid page number";
                    success = false;
                    break;
                }
                if (page > stopPage || page > totalPage) {
                    hasMorePosts = false;
                    break;
                }
                if (wordpressComments.length === 0) {
                    hasMorePosts = false;
                    break;
                }
                // const strapiComment = wordpressComments.map((comment) => ({
                //   id: comment?.id,
                //   date: comment?.date,
                //   isApproved: comment?.status === "approved" ? true : false,
                //   body:
                //     comment?.content?.rendered?.replace(/<\/?[^>]+(>|$)/g, "") ?? "",
                //   post: comment?.post,
                // }));
                await Promise.all(wordpressComments.map(async (comment) => {
                    if (comment) {
                        try {
                            const categoryFiels = (0, mapField_1.mapFieldsNest)(comment, authorStructure === null || authorStructure === void 0 ? void 0 : authorStructure.comments);
                            const exist = await strapi
                                .query("api::comment.comment")
                                .findOne({ where: { id: comment === null || comment === void 0 ? void 0 : comment.id } });
                            if (!exist) {
                                await strapi
                                    .service("api::comment.comment")
                                    .create({ data: categoryFiels });
                            }
                            else {
                                console.log(`Comment with ${comment === null || comment === void 0 ? void 0 : comment.id} already exists`);
                            }
                        }
                        catch (error) {
                            console.error(`Error creating post with ID ${comment.id}: `, error);
                        }
                    }
                }));
                message = "migration completed successfully!";
                console.log(`Page ${page} migration completed successfully!`);
                page++;
            }
            catch (error) {
                message = `${error.message} || ${error.stack}`;
                success = false;
                break;
            }
        }
        ctx.send({
            success,
            PerPage: batch,
            totalPages: totalPage,
            startPage: firstPage,
            lastPage: page - 1,
            message,
        });
    },
});
