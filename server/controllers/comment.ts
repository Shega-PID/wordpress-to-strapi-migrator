import { Strapi } from "@strapi/strapi";
import fetchWordpressData from "../utils/fetchWordpressData";
import { mapFieldsNest } from "../utils/mapField";
import { fetchJsonStructure } from "../utils/fetch-json-structure";

// const WORDPRESS_COMMENT_URL = "https://shega.co/wp-json/wp/v2/comments";
export default ({ strapi }: { strapi: Strapi }) => ({
  async migrateComments(ctx) {
    const { stopPage, batch } = ctx.params;
    const { username, password,url } = ctx.request.body;
    let page = ctx.params.page;
    let totalPage;
    let message = "";
    let success = true;
    let firstPage = page;
    let hasMorePosts = true;
    const WORDPRESS_COMMENT_URL = url;
    const authorStructure=  await fetchJsonStructure()
    while (hasMorePosts) {
      try {
        const data = await fetchWordpressData(
          page,
          WORDPRESS_COMMENT_URL,
          batch,
          username,
          password
        );
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

        await Promise.all(
          wordpressComments.map(async (comment) => {
            if (comment) {
              try {
                const categoryFiels=  mapFieldsNest(comment,authorStructure?.comments)
                const exist = await strapi
                  .query("api::comment.comment")
                  .findOne({ where: { id: comment?.id } });
                if (!exist) {
                  await strapi
                    .service("api::comment.comment")
                    .create({ data: categoryFiels });
                } else {
                  console.log(`Comment with ${comment?.id} already exists`);
                }
              } catch (error) {
                console.error(
                  `Error creating post with ID ${comment.id}: `,
                  error
                );
              }
            }
          })
        );
        message = "migration completed successfully!";
        console.log(`Page ${page} migration completed successfully!`);
        page++;
      } catch (error) {
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
