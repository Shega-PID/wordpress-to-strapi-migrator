"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchWordpressData_1 = __importDefault(require("../utils/fetchWordpressData"));
const WORDPRESS_COMMENT_URL = "https://shega.co/wp-json/wp/v2/comments";
exports.default = ({ strapi }) => ({
    async migrateComments(ctx) {
        const { stopPage, batch } = ctx.params;
        const { username, password } = ctx.request.body;
        let page = ctx.params.page;
        let totalPage;
        let message = '';
        let success = true;
        let firstPage = page;
        let hasMorePosts = true;
        while (hasMorePosts) {
            try {
                const data = await (0, fetchWordpressData_1.default)(page, WORDPRESS_COMMENT_URL, batch, username, password);
                const { data: wordpressComments, totalPages } = data;
                totalPage = totalPages;
                if (firstPage > totalPage) {
                    message = 'Invalid page number';
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
                const strapiComment = wordpressComments.map((comment) => {
                    var _a, _b, _c;
                    return ({
                        id: comment === null || comment === void 0 ? void 0 : comment.id,
                        date: comment === null || comment === void 0 ? void 0 : comment.date,
                        isApproved: (comment === null || comment === void 0 ? void 0 : comment.status) === 'approved' ? true : false,
                        body: (_c = (_b = (_a = comment === null || comment === void 0 ? void 0 : comment.content) === null || _a === void 0 ? void 0 : _a.rendered) === null || _b === void 0 ? void 0 : _b.replace(/<\/?[^>]+(>|$)/g, "")) !== null && _c !== void 0 ? _c : '',
                        post: comment === null || comment === void 0 ? void 0 : comment.post,
                    });
                });
                await Promise.all(strapiComment.map(async (comment) => {
                    if (comment) {
                        try {
                            const exist = await strapi.query("api::comment.comment").findOne({ where: { id: comment === null || comment === void 0 ? void 0 : comment.id } });
                            if (!exist) {
                                await strapi.service('api::comment.comment').create({ data: comment });
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
                message = 'migration completed successfully!';
                console.log(`Page ${page} migration completed successfully!`);
                page++;
            }
            catch (error) {
                message = `${error.message} || ${error.stack}`;
                success = false;
                break;
            }
        }
        ctx.send({ success,
            PerPage: batch,
            totalPages: totalPage,
            startPage: firstPage,
            lastPage: page - 1,
            message
        });
    },
});
