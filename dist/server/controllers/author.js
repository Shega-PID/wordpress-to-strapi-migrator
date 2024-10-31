"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * author controller
 */
const path = require("path");
const mapField_1 = require("../utils/mapField");
const fetch_json_structure_1 = require("../utils/fetch-json-structure");
const fs = require("fs");
exports.default = ({ strapi }) => ({
    async migrateAuthors(ctx) {
        let message = "";
        let success = false;
        let authorCount = 0;
        try {
            const filePath = path.join("./w_authors.json");
            const fileContent = fs.readFileSync(filePath, "utf8");
            // const {authorAttribute} = ctx.request.body;
            const authorStructure = await (0, fetch_json_structure_1.fetchJsonStructure)();
            const data = JSON.parse(fileContent);
            for (const author of data.author) {
                try {
                    const authorFields = (0, mapField_1.mapFields)(author, authorStructure === null || authorStructure === void 0 ? void 0 : authorStructure.author);
                    const authorExists = await strapi
                        .query("api::author.author") // if your content name is different replace with author
                        .findOne({ where: { id: author === null || author === void 0 ? void 0 : author.id } });
                    if (!authorExists) {
                        const createAuthor = await strapi
                            .service("api::author.author")
                            .create({
                            data: {
                                ...authorFields, // if you need to modify the field mapping comment this line of code and write your own mapping
                            },
                            publishedAt: new Date(),
                        });
                        authorCount++;
                        console.log(`inserted successfully: ${createAuthor.id}`);
                    }
                    else {
                        console.log("Author already exists");
                    }
                    success = true;
                    message = "Author migrated successfully";
                }
                catch (error) {
                    success = false;
                    message = "Author migrated failed";
                    console.error(`Error creating Author with ID ${author.id}: `, error);
                }
            }
        }
        catch (error) {
            message = error.message;
            success = false;
        }
        ctx.send({
            message,
            success,
            totalAuthor: authorCount,
        });
    },
});
