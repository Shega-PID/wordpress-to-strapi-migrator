"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchWordpressData_1 = __importDefault(require("../utils/fetchWordpressData"));
const mapField_1 = require("../utils/mapField");
const fetch_json_structure_1 = require("../utils/fetch-json-structure");
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
        const authorStructure = await (0, fetch_json_structure_1.fetchJsonStructure)();
        while (hasMorePosts) {
            try {
                const data = await (0, fetchWordpressData_1.default)(page, WORDPRESS_CATEGORY_URL, batch, username, password);
                const { data: wordpressCategories, totalPages } = data;
                totalPage = totalPages;
                if (page > stopPage || page > totalPage) {
                    hasMorePosts = false;
                    break;
                }
                console.log("page plugin", page, "total", totalPage);
                if (wordpressCategories.length === 0) {
                    hasMorePosts = false;
                    break;
                }
                // const strapiCategory = wordpressCategories.map((category) => ({
                //   id: category?.id,
                //   name: category?.name,
                //   slug: category?.slug,
                //   description: category?.description,
                //   seo: {
                //     metaTitle: category?.name,
                //     metaDescription: category?.description,
                //   },
                // }));
                await Promise.all(wordpressCategories.map(async (category) => {
                    if (category) {
                        try {
                            const categoryFiels = (0, mapField_1.mapFieldsNest)(category, authorStructure === null || authorStructure === void 0 ? void 0 : authorStructure.category);
                            const categoryExists = await strapi
                                .query("api::category.category")
                                .findOne({ where: { id: category === null || category === void 0 ? void 0 : category.id } });
                            if (!categoryExists) {
                                await strapi
                                    .service("api::category.category")
                                    .create({ data: categoryFiels });
                            }
                        }
                        catch (error) {
                            console.error(`Error creating category with ID ${category.id}: `, error);
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
