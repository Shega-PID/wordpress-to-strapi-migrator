// /**
//  * author controller
//  */
// const path = require("path");
// import { Strapi } from "@strapi/strapi";
// import { mapFields } from "../utils/mapField";
// import { fetchJsonStructure } from "../utils/fetch-json-structure";
// const fs = require("fs");

// export default ({ strapi }: { strapi: Strapi }) => ({
//   async migrateAuthors(ctx) {
//     let message = "";
//     let success = false;
//     let authorCount = 0;
//     try {
//       const filePath = path.join("./w_authors.json");

//       const fileContent = fs.readFileSync(filePath, "utf8");
//       // const {authorAttribute} = ctx.request.body;

//       const authorStructure = await fetchJsonStructure();
//       const data = JSON.parse(fileContent);

//       for (const author of data.author) {
//         try {
//           const authorFields = mapFields(author, authorStructure?.author);

//           const authorExists = await strapi
//             .query("api::author.author") // if your content name is different replace with author
//             .findOne({ where: { id: author?.id } });
//           if (!authorExists) {
//             const createAuthor = await strapi
//               .service("api::author.author")
//               .create({
//                 data: {
//                   ...authorFields, // if you need to modify the field mapping comment this line of code and write your own mapping
//                 },
//                 publishedAt: new Date(),
//               });
//             authorCount++;
//             console.log(`inserted successfully: ${createAuthor.id}`);
//           } else {
//             console.log("Author already exists");
//           }
//           success = true;
//           message = "Author migrated successfully";
//         } catch (error) {
//           success = false;
//           message = "Author migrated failed";
//           console.error(`Error creating Author with ID ${author.id}: `, error);
//         }
//       }
//     } catch (error) {
//       message = error.message;
//       success = false;
//     }
//     ctx.send({
//       message,
//       success,
//       totalAuthor: authorCount,
//     });
//   },
// });

import path from 'path';
import fs from 'fs';
import { factories } from '@strapi/strapi';
import { mapFields } from '../utils/mapField';
import { fetchJsonStructure } from '../utils/fetch-json-structure';

export default factories.createCoreController('api::author.author', ({ strapi }) => ({
  async migrateAuthors(ctx) {
    let message = '';
    let success = false;
    let authorCount = 0;

    try {
      const filePath = path.join('./w_authors.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const authorStructure = await fetchJsonStructure();
      const data = JSON.parse(fileContent);

      for (const author of data.author) {
        try {
          const authorFields = mapFields(author, authorStructure?.author);

          const authorExists = await strapi.db.query('api::author.author').findOne({
            where: { id: author?.id },
          });

          if (!authorExists) {
            const createAuthor = await strapi.service('api::author.author').create({
              data: {
                ...authorFields,
                publishedAt: new Date(),
              },
            });
            authorCount++;
            console.log(`Inserted successfully: ${createAuthor.id}`);
          } else {
            console.log('Author already exists');
          }

          success = true;
          message = 'Author migrated successfully';
        } catch (error) {
          success = false;
          message = 'Author migration failed';
          console.error(`Error creating Author with ID ${author.id}: `, error);
        }
      }
    } catch (error) {
      message = error.message;
      success = false;
    }

    ctx.send({
      message,
      success,
      totalAuthor: authorCount,
    });
  },
}));