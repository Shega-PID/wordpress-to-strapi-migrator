/**
 * author controller
 */
const path = require('path');
import { Strapi } from '@strapi/strapi';
import data from "./author.json";
import { fetchJsonData } from "../utils/fetchWordpressData";
import axios from 'axios'

const filePath = path.join(__dirname, './users.json');
export default ({ strapi }: { strapi: Strapi }) => ({
    async migrateUser(ctx) {
      const { stopPage, batch } = ctx.params;
      let page = ctx.params.page;
      let hasMorePosts = true;
      let totalPage;
      let firstPage = page;
      let increment=page * batch
      while (hasMorePosts) {
        try {
          const data = await fetchJsonData(firstPage, filePath, batch,stopPage);
          const { data: wordpressUsers, totalPages } = data;
          totalPage = totalPages;
        
          if (Math.ceil((increment + 1)/batch) == stopPage) {
            hasMorePosts = false;
            break;
          }
          if (wordpressUsers.length === 0) {
            hasMorePosts = false;
            break;
          }
          const strapiTags = wordpressUsers.map((user) => ({
            id: user?.ID,
            username:  user?.user_login.length < 3  ? user?.user_login + user?.ID : user?.user_login,
            email:  user?.user_email,
            confirmed: true,
            blocked: false,
            // role: user?.roles,
            firstName: user?.first_name,
            lastName: user?.last_name,
          }));

          await Promise.all(
            strapiTags.map( async(user) =>{
              await strapi.plugins['users-permissions'].services.user.add({...user })
              console.log(`Page ${increment} migration completed successfully!`);
              increment++;
              
        }
            )
          );

          
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              if (error.response.status === 400 || error.response.status === 409) {
                if (error.response.data.message && error.response.data.message.includes('unique')) {
               increment++
                  continue
                } 
              }
            }
            if (error.code === "ERR_BAD_REQUEST") {
              break;
            }
          } else {
            increment++
            continue;
          }
        }
      }

      ctx.send({
        success: true,
        postPerPage: batch,
        totalPages: totalPage,
        startPage: firstPage,
        lastPage:Math.ceil((increment + 1)/batch)
      });
    },
    async deleteAll(ctx) {
      try {
        // Fetch all users
        const users = await strapi.plugins['users-permissions'].services.user.fetchAll();
  
        // Delete all users
        for (const user of users) {
          await strapi.plugins['users-permissions'].services.user.remove({ id: user.id });
        }
  
        return ctx.send({ message: 'All users have been deleted' });
      } catch (error) {
        return ctx.badRequest('An error occurred while deleting users', { error });
      }
    },
   
  
  })

