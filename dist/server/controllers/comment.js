"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchWordpressData_1 = __importDefault(require("../utils/fetchWordpressData"));
const mapField_1 = require("../utils/mapField");
const fetch_json_structure_1 = require("../utils/fetch-json-structure");
exports.default = ({ strapi }) => ({
    async migrateComments(ctx) {
        const { stopPage, batch } = ctx.params;
        let page = ctx.params.page;
        let totalPage;
        let message = "";
        let success = false;
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
                // const strapiComment = wordpressComments.map((comment) => ({ // uncomment and modify to fit your field requirement
                //   id: comment?.id,
                //   date: comment?.date,
                //   isApproved: comment?.status === "approved" ? true : false,
                //   body:
                //     comment?.content?.rendered?.replace(/<\/?[^>]+(>|$)/g, "") ?? "",
                //   post: comment?.post,
                // }));
                await Promise.all(wordpressComments.map(async (comment) => {
                    var _a, _b, _c;
                    // replace wordpressComments with strapiComment
                    if (comment) {
                        try {
                            const commentFields = (0, mapField_1.mapFieldsNest)(comment, authorStructure === null || authorStructure === void 0 ? void 0 : authorStructure.comments); // comment this line
                            const newFields = {
                                ...commentFields,
                                body: (_c = (_b = (_a = comment === null || comment === void 0 ? void 0 : comment.content) === null || _a === void 0 ? void 0 : _a.rendered) === null || _b === void 0 ? void 0 : _b.replace(/<\/?[^>]+(>|$)/g, "")) !== null && _c !== void 0 ? _c : "",
                            };
                            const exist = await strapi
                                .query("api::comment.comment")
                                .findOne({ where: { id: comment === null || comment === void 0 ? void 0 : comment.id } });
                            if (!exist) {
                                await strapi
                                    .service("api::comment.comment")
                                    .create({ data: newFields }); // replace commentFields with comment
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
                message = "Comments migration completed successfully!";
                success = true;
                console.log(`Comments ${page} migration completed successfully!`);
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
