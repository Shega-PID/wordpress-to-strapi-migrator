/**
 * author controller
 */
const path = require('path');
import { Strapi } from '@strapi/strapi';
import  { fetchJsonData } from "../utils/fetchWordpressData";
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
          const strapiUsers = wordpressUsers.map((user) => ({
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
            strapiUsers.map( async(user) =>{
            //   const existingUser = await strapi.plugins['users-permissions'].services.user.fetch({ id: user.id });
            // console.log({existingUser})
            //   if(!existingUser){
                await strapi.plugins['users-permissions'].services.user.add({...user })
                console.log(`Page ${increment} migration completed successfully!`);
                increment++;
           
            //  }else{
            //   console.log(`User with ${user.ID} id already exists!`);
            //  } 
              
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
  
   
  
  })

