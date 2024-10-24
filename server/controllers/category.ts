import { Strapi } from "@strapi/strapi";
import fetchWordpressData from "../utils/fetchWordpressData";
import { mapFieldsNest } from "../utils/mapField";
import { fetchJsonStructure } from "../utils/fetch-json-structure";

export default ({ strapi }: { strapi: Strapi }) => ({
  async migrateCategories(ctx) {
    const { stopPage, batch } = ctx.params;
    const { restApi } = ctx.request.body;
    let page = ctx.params.page;
    let totalPage;
    let message = "";
    let success = false;
    let firstPage = page;
    let hasMorePosts = true;
    const authorStructure = await fetchJsonStructure();
    while (hasMorePosts) {
      try {
        const data = await fetchWordpressData(page, batch, restApi);
        const { data: wordpressCategories, totalPages } = data;
        totalPage = totalPages;
        if (page > stopPage || page > totalPage) {
          hasMorePosts = false;
          break;
        }

        if (wordpressCategories.length === 0) {
          hasMorePosts = false;
          break;
        }

        // const strapiCategory = wordpressCategories.map((category) => ({ // uncomment and modify to fit your scenario
        //   id: category?.id,
        //   name: category?.name,
        //   slug: category?.slug,
        //   description: category?.description,
        //   seo: {
        //     metaTitle: category?.name,
        //     metaDescription: category?.description,
        //   },
        // }));

        await Promise.all(
          wordpressCategories.map(async (category) => {
            // replace wordpressCategories with strapiCategory
            if (category) {
              try {
                const categoryFields = mapFieldsNest(
                  category,
                  authorStructure?.category
                ); // comment this line
                const categoryExists = await strapi
                  .query("api::category.category")
                  .findOne({ where: { id: category?.id } });
                if (!categoryExists) {
                  await strapi
                    .service("api::category.category")
                    .create({ data: categoryFields }); //replace categoryFields with category
                }
              } catch (error) {
                console.error(
                  `Error creating category with ID ${category.id}: `,
                  error
                );
              }
            }
          })
        );
        message = "Categories migration completed successfully!";
        success = true;
        console.log(`Page ${page} migration completed successfully!`);
        page++;
      } catch (error) {
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
