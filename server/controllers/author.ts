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
    async migrateAuthors(ctx) {
      let authorCount=0
        for (const author of data.author) {
          try{
            const authorExists = await strapi
            .query("api::author.author")
            .findOne({ where: { id: author?.id } });
             if(!authorExists){
             const createPost = await strapi.service("api::author.author").create({
               data: {
                 ...author,
                 slug: author?.name
                   .toString()
                   .toLowerCase()
                   .trim()
                   .replace(/\s+/g, "-")
                   .replace(/[^\w\-]+/g, "")
                   .replace(/\-\-+/g, "-"),
                 seo: {
                   metaTitle: author?.name,
                   metaDescription: author?.name,
                 },
               },
               publishedAt: new Date(),
             });
             authorCount++
             console.log(`inserted successfully: ${createPost.id}`);
            }
          }catch (error) {
            console.error(
              `Error creating Author with ID ${author.id}: `,
              error
            );
          }
         
        }
        ctx.send({
          message: "Author migrated successfully",
          totalAuthor: authorCount,
        });
     
    },
  })

