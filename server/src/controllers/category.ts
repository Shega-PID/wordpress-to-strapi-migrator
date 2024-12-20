
import { factories } from '@strapi/strapi';
import fetchWordpressData from '../utils/fetchWordpressData';
import { mapFieldsNest } from '../utils/mapField';
import { fetchJsonStructure } from '../utils/fetch-json-structure';

export default factories.createCoreController('api::category.category', ({ strapi }) => ({
  async migrateCategories(ctx) {
    const { stopPage, batch } = ctx.params;
    const { restApi } = ctx.request.body;
    let page = ctx.params.page;
    let totalPage;
    let message = '';
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

        await Promise.all(
          wordpressCategories.map(async (category) => {
            if (category) {
              try {
                const categoryFields = mapFieldsNest(category, authorStructure?.category);
                const categoryExists = await strapi.db.query('api::category.category').findOne({
                  where: { id: category?.id },
                });

                if (!categoryExists) {
                  await strapi.service('api::category.category').create({
                    data: categoryFields,
                  });
                }
              } catch (error) {
                console.error(`Error creating category with ID ${category.id}: `, error);
              }
            }
          })
        );

        message = 'Categories migration completed successfully!';
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
}));