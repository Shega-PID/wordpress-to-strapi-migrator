/**
 * author controller
 */
const path = require("path");
import { Strapi } from "@strapi/strapi";
const fs = require("fs");
import { fetchJsonData } from "../utils/fetchWordpressData";
import { mapFields } from "../utils/mapField";
import { fetchJsonStructure } from "../utils/fetch-json-structure";
const filePath = path.join("./w_users.json");
export default ({ strapi }: { strapi: Strapi }) => ({
  async migrateUser(ctx) {
    const { stopPage, batch } = ctx.params;
    let page = ctx.params.page;
    let hasMorePosts = true;
    let totalPage;
    let countUser = page;
    let firstPage = page;
    const authorStructure = await fetchJsonStructure();
    while (hasMorePosts) {
      try {
        const data = await fetchJsonData(firstPage, filePath, batch, stopPage);
        const { data: wordpressUsers, totalPages } = data;
        totalPage = totalPages;

        if (countUser == stopPage) {
          hasMorePosts = false;
          break;
        }
        if (wordpressUsers.length === 0) {
          hasMorePosts = false;
          break;
        }

        await Promise.all(
          wordpressUsers.map(async (user) => {
            const userFields = mapFields(user, authorStructure?.user);
            await strapi.plugins["users-permissions"].services.user.add({
              ...userFields, // comment this line and add your attributes
            });

            console.log(
              `Page ${countUser} ${stopPage} migration completed successfully!`
            );
            countUser++;
          })
        );
      } catch (error) {
        console.log(error.stack, error.message);
        break;
      }
    }
    console.log("completed successfully");
    ctx.send({
      success: true,
      postPerPage: batch,
      totalPages: totalPage,
      startPage: firstPage,
      lastPage: countUser,
    });
  },
});
