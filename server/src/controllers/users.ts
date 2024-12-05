import path from 'path';
import fs from 'fs';
import { factories } from '@strapi/strapi';
import { fetchJsonData } from '../utils/fetchWordpressData';
import { mapFields } from '../utils/mapField';
import { fetchJsonStructure } from '../utils/fetch-json-structure';

export default factories.createCoreController('plugin::users-permissions.user', ({ strapi }) => ({
  async migrateUser(ctx) {
    let message = '';
    let success = false;
    let totalPage;
    let page = ctx.params.page;
    let countUser = page;
    let firstPage = page;
    const { stopPage, batch } = ctx.params;

    try {
      const filePath = path.join('./w_users.json');
      let hasMorePosts = true;
      const authorStructure = await fetchJsonStructure();

      while (hasMorePosts) {
        try {
          const data = await fetchJsonData(firstPage, filePath, batch, stopPage);
          const { data: wordpressUsers, totalPages } = data;
          totalPage = totalPages;

          if (countUser == stopPage || wordpressUsers.length === 0) {
            hasMorePosts = false;
            break;
          }

          await Promise.all(
            wordpressUsers.map(async (user) => {
              const userFields = mapFields(user, authorStructure?.user);
              await strapi.plugins['users-permissions'].services.user.add({
                ...userFields,
              });

              console.log(`User ${countUser} migration completed successfully!`);
              countUser++;
            })
          );

          message = 'Users Migration Completed Successfully';
          success = true;
        } catch (error) {
          message = error.message;
          success = false;
          console.log(error.stack, error.message);
          break;
        }
      }
    } catch (error) {
      message = error.message;
      success = false;
    }

    console.log('completed successfully');
    ctx.send({
      success,
      message,
      postPerPage: batch,
      totalPages: totalPage,
      startPage: firstPage,
      lastPage: countUser,
    });
  },
}));