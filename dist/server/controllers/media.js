"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchWordpressData_1 = __importDefault(require("../utils/fetchWordpressData"));
const axios_1 = __importDefault(require("axios"));
const fs = require("fs");
const path = require("path");
const os = require("os");
exports.default = ({ strapi }) => ({
    async downloadUploadMedia(ctx) {
        // const wordpressUrl = "https://shega.co/wp-json/wp/v2/media";
        const { stopPage, batch } = ctx.params;
        const { username, password, url } = ctx.request.body;
        let page = ctx.params.page;
        let message = "";
        let totalPage;
        const unUpdatedMediaId = [];
        const firstPage = page;
        let success = true;
        let hasMorePosts = true;
        const { restApi } = ctx.request.body;
        while (hasMorePosts) {
            try {
                // Fetch media from WordPress
                const data = await (0, fetchWordpressData_1.default)(page, batch, restApi);
                const { data: mediaItems, totalPages } = data;
                // const mediaItems= media.filter((item) => item.id === 17121 );
                totalPage = totalPages;
                if (page == stopPage) {
                    hasMorePosts = false;
                    break;
                }
                if (mediaItems.length === 0) {
                    hasMorePosts = false;
                    break;
                }
                const downloadedDir = path.join(__dirname, "downloaded");
                await fs.promises.mkdir(downloadedDir, { recursive: true });
                const uploadPromises = mediaItems.map(async (media) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    const { guid, source_url, id } = media;
                    const mediaUrl = source_url.toLowerCase().endsWith('.webp') ? guid.rendered : source_url;
                    // Download the media file
                    const fileResponse = await axios_1.default.get(mediaUrl, {
                        responseType: "arraybuffer",
                        timeout: 3600000,
                    });
                    const buffer = Buffer.from(fileResponse.data, "binary");
                    const fileName = path.basename(mediaUrl);
                    const filePath = path.join(os.tmpdir(), fileName);
                    await fs.promises.writeFile(filePath, buffer);
                    const mediaName = fileName.split("").splice(0, 5).join("");
                    const file = {
                        path: filePath,
                        name: mediaName,
                        type: fileResponse === null || fileResponse === void 0 ? void 0 : fileResponse.headers["content-type"],
                        size: buffer === null || buffer === void 0 ? void 0 : buffer.length,
                    };
                    const fileExtension = path.extname(fileName).slice(1);
                    if (fileExtension === "webp") {
                        file.type = "image/webp";
                    }
                    // Upload the file to Strapi
                    const fileExist = await strapi
                        .query("plugin::upload.file")
                        .findOne({
                        where: { id: media.id },
                    });
                    if (!fileExist) {
                        try {
                            const createdFiles = await strapi.plugins.upload.services.upload.upload({
                                data: {
                                    fileInfo: {
                                        name: mediaName !== null && mediaName !== void 0 ? mediaName : '',
                                        alternativeText: `${media === null || media === void 0 ? void 0 : media.alt_text},v2`,
                                        caption: (_b = (_a = media === null || media === void 0 ? void 0 : media.caption) === null || _a === void 0 ? void 0 : _a.rendered) !== null && _b !== void 0 ? _b : '',
                                        width: (_d = (_c = media === null || media === void 0 ? void 0 : media.media_details) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 0,
                                        height: (_f = (_e = media === null || media === void 0 ? void 0 : media.media_details) === null || _e === void 0 ? void 0 : _e.height) !== null && _f !== void 0 ? _f : 0,
                                        formats: {
                                            thumbnail: {
                                                name: `thumbnail_${mediaName !== null && mediaName !== void 0 ? mediaName : ''}`,
                                                hash: `thumbnail_${id}`,
                                                ext: (_g = path === null || path === void 0 ? void 0 : path.extname(mediaName)) === null || _g === void 0 ? void 0 : _g.slice(1),
                                                mime: file === null || file === void 0 ? void 0 : file.type,
                                                width: (_h = media === null || media === void 0 ? void 0 : media.media_details) === null || _h === void 0 ? void 0 : _h.width,
                                                height: (_j = media === null || media === void 0 ? void 0 : media.media_details) === null || _j === void 0 ? void 0 : _j.height,
                                                size: (_k = media === null || media === void 0 ? void 0 : media.media_details) === null || _k === void 0 ? void 0 : _k.filesize,
                                                url: `${mediaUrl === null || mediaUrl === void 0 ? void 0 : mediaUrl.split("?")[0]}?width=156&height=156`,
                                            },
                                        },
                                    },
                                },
                                files: file,
                            });
                            await strapi.query("plugin::upload.file").update({
                                where: { id: createdFiles["0"].id },
                                data: {
                                    id: media.id,
                                },
                            });
                            console.log(`Uploaded media to Strapi: ${fileName}`);
                        }
                        catch (error) {
                            unUpdatedMediaId.push({ name: media.name, id: media.id });
                            console.log(error.stack, media.id, error === null || error === void 0 ? void 0 : error.stack.message, error);
                        }
                    }
                    else {
                        console.log(`Media with ${media.id} already exists`);
                    }
                });
                page++;
                // Use Promise.all to wait for all the upload promises to complete
                await Promise.all(uploadPromises);
                message = "migration completed successfully!";
                success = true;
                console.log(`Page ${page} uploaded completed successfully!`);
                console.log({ unUpdatedMediaId });
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (error.code === "ERR_BAD_REQUEST") {
                        message = "Encountered a Bad Request error. Invalid page number.";
                        success = false;
                        break;
                    }
                }
                else {
                    continue;
                }
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
