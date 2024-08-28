import { Strapi } from "@strapi/strapi";
import fetchWordpressData from "../utils/fetchWordpressData";

const WORDPRESS_CATEGORY_URL = "https://shega.co/wp-json/wp/v2/categories";
export default ({ strapi }: { strapi: Strapi }) => ({
    async migrateCategories(ctx) {
        const { stopPage, batch } = ctx.params;
        const{username,password}=ctx.request.body
        let page = ctx.params.page;
        let totalPage;
        let message = "";
        let success = true;
        let firstPage = page;
        let hasMorePosts = true;
  
        while (hasMorePosts) {
         
          try {
            const data = await fetchWordpressData(
              page,
              WORDPRESS_CATEGORY_URL,
              batch,
              username,
              password
            );
            const { data: wordpressCategories, totalPages } = data;
            totalPage = totalPages;
            
            if (page > stopPage || page > totalPage) {
              hasMorePosts = false;
              break;
            }
            console.log('page plugin',page,'total',totalPage)
          
            if (wordpressCategories.length === 0) {
              hasMorePosts = false;
              break;
            }
            const strapiCategory = wordpressCategories.map((category) => ({
              id: category?.id,
              name: category?.name,
              slug: category?.slug,
              description: category?.description,
              seo: {
                metaTitle: category?.name,
                metaDescription: category?.description,
              },
            }));
  
            await Promise.all(
              strapiCategory.map(async (category) => {
                if (category) {
                  try {
                    const categoryExists = await strapi
                      .query("api::category.category")
                      .findOne({ where: { id: category?.id } });
                    if (!categoryExists) {
                      await strapi
                        .service("api::category.category")
                        .create({ data: category });
                    }
                  } catch (error) {
                    console.error(
                      `Error creating post with ID ${category.id}: `,
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
          postPerPage: batch,
          totalPages: totalPage,
          startPage: firstPage,
          lastPage: page - 1,
          message,
        });
      }, 
})