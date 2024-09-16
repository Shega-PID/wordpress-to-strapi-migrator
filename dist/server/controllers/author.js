"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * author controller
 */
const path = require('path');
const author_json_1 = __importDefault(require("./author.json"));
exports.default = ({ strapi }) => ({
    async migrateAuthors(ctx) {
        let authorCount = 0;
        for (const author of author_json_1.default.author) {
            try {
                const authorExists = await strapi
                    .query("api::author.author")
                    .findOne({ where: { id: author === null || author === void 0 ? void 0 : author.id } });
                if (!authorExists) {
                    const createPost = await strapi.service("api::author.author").create({
                        data: {
                            ...author,
                            slug: author === null || author === void 0 ? void 0 : author.name.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-"),
                            seo: {
                                metaTitle: author === null || author === void 0 ? void 0 : author.name,
                                metaDescription: author === null || author === void 0 ? void 0 : author.name,
                            },
                        },
                        publishedAt: new Date(),
                    });
                    authorCount++;
                    console.log(`inserted successfully: ${createPost.id}`);
                }
                else {
                    console.log('Author already exists');
                }
            }
            catch (error) {
                console.error(`Error creating Author with ID ${author.id}: `, error);
            }
        }
        ctx.send({
            message: "Author migrated successfully",
            totalAuthor: authorCount,
        });
    },
});
