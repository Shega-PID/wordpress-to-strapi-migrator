"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchWordpressData_1 = __importDefault(require("../utils/fetchWordpressData"));
const WORDPRESS_TAGS_URL = "https://shega.co/wp-json/wp/v2/tags";
exports.default = ({ strapi }) => ({
    async migrateTags(ctx) {
        const { stopPage, batch } = ctx.params;
        const { username, password } = ctx.request.body;
        let page = ctx.params.page;
        let hasMorePosts = true;
        let totalPage;
        let message = '';
        let success = true;
        let firstPage = page;
        while (hasMorePosts) {
            try {
                const data = await (0, fetchWordpressData_1.default)(page, WORDPRESS_TAGS_URL, batch, username, password);
                const { data: wordpressTags, totalPages } = data;
                totalPage = totalPages;
                if (firstPage > totalPage) {
                    message = 'Invalid page number';
                    success = false;
                    break;
                }
                if (parseInt(page) > parseInt(stopPage)) {
                    hasMorePosts = false;
                    break;
                }
                if (wordpressTags.length === 0) {
                    hasMorePosts = false;
                    break;
                }
                const strapiTags = wordpressTags.map((tag) => ({
                    id: tag === null || tag === void 0 ? void 0 : tag.id,
                    name: tag === null || tag === void 0 ? void 0 : tag.name,
                    slug: tag === null || tag === void 0 ? void 0 : tag.slug.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-"),
                    seo: {
                        metaTitle: tag === null || tag === void 0 ? void 0 : tag.name,
                        metaDescription: tag.name,
                    },
                }));
                await Promise.all(strapiTags.map(async (tag) => {
                    if (tag) {
                        if (tag) {
                            try {
                                const tagExist = await strapi.query("api::tag.tag").findOne({ where: { id: tag === null || tag === void 0 ? void 0 : tag.id } });
                                if (!tagExist) {
                                    await strapi.service("api::tag.tag").create({ data: tag });
                                }
                                else {
                                    console.log(`Tag with ${tag === null || tag === void 0 ? void 0 : tag.id} id already exists`);
                                }
                            }
                            catch (error) {
                                console.error(`Error creating tag with ID ${tag.id}: `, error);
                            }
                        }
                    }
                }));
                message = 'migration completed successfully!';
                page++;
                console.log(`Page ${page} migration completed successfully!`);
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
            message
        });
    },
});
