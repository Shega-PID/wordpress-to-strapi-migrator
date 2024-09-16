"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchWordpressData_1 = __importDefault(require("../utils/fetchWordpressData"));
//  = "https://shega.co/wp-json/wp/v2/categories";
exports.default = ({ strapi }) => ({
    async migrateCategories(ctx) {
        const { stopPage, batch } = ctx.params;
        const { username, password, url } = ctx.request.body;
        let page = ctx.params.page;
        let totalPage;
        let message = "";
        let success = true;
        let firstPage = page;
        let hasMorePosts = true;
        const WORDPRESS_CATEGORY_URL = url;
        while (hasMorePosts) {
            try {
                const data = await (0, fetchWordpressData_1.default)(page, WORDPRESS_CATEGORY_URL, batch, username, password);
                const { data: wordpressCategories, totalPages } = data;
                totalPage = totalPages;
                if (page > stopPage || page > totalPage) {
                    hasMorePosts = false;
                    break;
                }
                console.log('page plugin', page, 'total', totalPage);
                if (wordpressCategories.length === 0) {
                    hasMorePosts = false;
                    break;
                }
                const strapiCategory = wordpressCategories.map((category) => ({
                    id: category === null || category === void 0 ? void 0 : category.id,
                    name: category === null || category === void 0 ? void 0 : category.name,
                    slug: category === null || category === void 0 ? void 0 : category.slug,
                    description: category === null || category === void 0 ? void 0 : category.description,
                    seo: {
                        metaTitle: category === null || category === void 0 ? void 0 : category.name,
                        metaDescription: category === null || category === void 0 ? void 0 : category.description,
                    },
                }));
                await Promise.all(strapiCategory.map(async (category) => {
                    if (category) {
                        try {
                            const categoryExists = await strapi
                                .query("api::category.category")
                                .findOne({ where: { id: category === null || category === void 0 ? void 0 : category.id } });
                            if (!categoryExists) {
                                await strapi
                                    .service("api::category.category")
                                    .create({ data: category });
                            }
                        }
                        catch (error) {
                            console.error(`Error creating post with ID ${category.id}: `, error);
                        }
                    }
                }));
                message = "migration completed successfully!";
                console.log(`Page ${page} migration completed successfully!`);
                page++;
            }
            catch (error) {
                message = `${error.message}`;
                success = false;
                break;
            }
        }
        ctx.send({
            success,
            postPerPage: batch,
            totalPages: totalPage,
            startPage: firstPage,
            lastPage: page - 1,
            message,
        });
    },
});
