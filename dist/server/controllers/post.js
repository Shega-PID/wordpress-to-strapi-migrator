"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchWordpressData_1 = __importDefault(require("../utils/fetchWordpressData"));
const he_1 = __importDefault(require("he"));
exports.default = ({ strapi }) => ({
    async migratePosts(ctx) {
        var _a;
        const { stopPage, batch } = ctx.params;
        const { restApi } = ctx.request.body;
        let page = ctx.params.page;
        const firstPage = page;
        let success = false;
        let hasMorePosts = true;
        const insertImage = async (content) => {
            const imgTags = content.match(/<img[^>]+>/g);
            if (imgTags) {
                let updatedContent = content;
                for (const imgTag of imgTags) {
                    const mediaId = imgTag.match(/wp-image-(\d+)/);
                    if (mediaId) {
                        try {
                            const media = await strapi.query("plugin::upload.file").findOne({
                                where: {
                                    id: parseInt(mediaId[1]),
                                },
                            });
                            if (media) {
                                let newImgTag = imgTag;
                                newImgTag = newImgTag.replace(/src=\"([^"]*)"/, `src="${media === null || media === void 0 ? void 0 : media.url}"`);
                                const srcsetMatch = imgTag.match(/srcset="([^"]*)"/);
                                if (srcsetMatch) {
                                    const srcsetUrls = srcsetMatch[1]
                                        .split(",")
                                        .map((url) => url.trim());
                                    let newSrcsetUrls = srcsetUrls
                                        .map((srcsetUrl) => {
                                        const [url, size] = srcsetUrl.split(" ");
                                        return `${media === null || media === void 0 ? void 0 : media.url} ${size}`;
                                    })
                                        .join(", ");
                                    newImgTag = newImgTag.replace(/srcset="([^"]*)"/, `srcset="${newSrcsetUrls}"`);
                                }
                                // Replace the old img tag with the new one in the updated content
                                updatedContent = updatedContent.replace(imgTag, newImgTag);
                            }
                        }
                        catch (error) {
                            console.error(`Error processing media ID ${mediaId[1]}: `, error);
                        }
                    }
                }
                return updatedContent;
            }
            else {
                return content;
            }
        };
        let totalPage;
        let message = "";
        while (hasMorePosts) {
            try {
                const data = await (0, fetchWordpressData_1.default)(page, batch, restApi);
                console.log({ data });
                const { data: wordpressPosts, totalPages } = data;
                totalPage = totalPages;
                console.log("first", firstPage, totalPages);
                if (firstPage > totalPage) {
                    message = "Invalid page number";
                    success = false;
                    break;
                }
                if (page > stopPage || page > totalPage) {
                    hasMorePosts = false;
                    break;
                }
                if (wordpressPosts.length === 0) {
                    hasMorePosts = false;
                    break;
                }
                const strapiPosts = await Promise.all(wordpressPosts.map(async (post) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
                    try {
                        let featuredImage = null;
                        if (post === null || post === void 0 ? void 0 : post.featured_media) {
                            try {
                                featuredImage = await strapi
                                    .query("plugin::upload.file")
                                    .findOne({
                                    where: { id: post.featured_media },
                                });
                            }
                            catch (error) {
                                message = (_a = error === null || error === void 0 ? void 0 : error.stack) === null || _a === void 0 ? void 0 : _a.message;
                                success = false;
                                console.error(`Error fetching featured media for post ID ${post.id}: `, error);
                            }
                        }
                        return {
                            // modify this section to fit your strapi and wordpress field naming
                            id: post === null || post === void 0 ? void 0 : post.id,
                            title: (_b = he_1.default.decode(post === null || post === void 0 ? void 0 : post.title.rendered)) !== null && _b !== void 0 ? _b : "",
                            slug: (_c = he_1.default.decode(post === null || post === void 0 ? void 0 : post.slug.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-"))) !== null && _c !== void 0 ? _c : "",
                            postedDate: (_d = post === null || post === void 0 ? void 0 : post.date.split("T").slice(0, 1)[0].toString()) !== null && _d !== void 0 ? _d : "",
                            style: "Style 1",
                            excerpt: (_g = he_1.default.decode((_f = (_e = post === null || post === void 0 ? void 0 : post.excerpt) === null || _e === void 0 ? void 0 : _e.rendered) === null || _f === void 0 ? void 0 : _f.replace(/<\/?[^>]+(>|$)/g, ""))) !== null && _g !== void 0 ? _g : "",
                            enableComment: (post === null || post === void 0 ? void 0 : post.comment_status) === "open" ? true : false,
                            canonicalUrl: (_j = (_h = post === null || post === void 0 ? void 0 : post.yoast_head_json) === null || _h === void 0 ? void 0 : _h.canonical) !== null && _j !== void 0 ? _j : "",
                            isPromotional: false,
                            content: { body: await insertImage((_k = post === null || post === void 0 ? void 0 : post.content) === null || _k === void 0 ? void 0 : _k.rendered) },
                            featuredImage: featuredImage,
                            fromV2: true,
                            seo: {
                                metaTitle: he_1.default.decode((_l = post === null || post === void 0 ? void 0 : post.yoast_head_json) === null || _l === void 0 ? void 0 : _l.title),
                                metaDescription: he_1.default.decode((_m = post === null || post === void 0 ? void 0 : post.yoast_head_json) === null || _m === void 0 ? void 0 : _m.description),
                                metaImage: featuredImage,
                            },
                            topic: post === null || post === void 0 ? void 0 : post.categories[0],
                            author: (_o = post === null || post === void 0 ? void 0 : post.author) !== null && _o !== void 0 ? _o : 1,
                            tags: (_p = post === null || post === void 0 ? void 0 : post.tags) !== null && _p !== void 0 ? _p : [],
                            categories: (_q = post === null || post === void 0 ? void 0 : post.categories.splice(1)) !== null && _q !== void 0 ? _q : [],
                            advancedSeo: post === null || post === void 0 ? void 0 : post.yoast_head_json,
                            readTime: ((_r = post === null || post === void 0 ? void 0 : post.yoast_head_json) === null || _r === void 0 ? void 0 : _r.twitter_misc["Est. reading time"]).split(" ")[0],
                        };
                    }
                    catch (error) {
                        console.log(error);
                        message = (_s = error === null || error === void 0 ? void 0 : error.stack) === null || _s === void 0 ? void 0 : _s.message;
                        success = false;
                    }
                }));
                await Promise.all(strapiPosts.map(async (post) => {
                    var _a;
                    if (post) {
                        try {
                            const exist = await strapi
                                .query("api::post.post")
                                .findOne({ where: { id: post === null || post === void 0 ? void 0 : post.id } });
                            if (!exist) {
                                await strapi.service("api::post.post").create({ data: post });
                            }
                            else {
                                console.log(`Post with ${post === null || post === void 0 ? void 0 : post.id} already exists`);
                            }
                        }
                        catch (error) {
                            console.error(`Error creating post with ID ${post.id}: `, error);
                            message = (_a = error === null || error === void 0 ? void 0 : error.stack) === null || _a === void 0 ? void 0 : _a.message;
                            success = false;
                        }
                    }
                }));
                message = "Posts migration completed successfully!";
                success = true;
                console.log(`Posts ${page} migration completed successfully!`);
                page++;
            }
            catch (error) {
                message = `${(_a = error.stack) === null || _a === void 0 ? void 0 : _a.message}`;
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
