import { Strapi } from "@strapi/strapi";
import fetchWordpressData from "../utils/fetchWordpressData";
import { mapFieldsNest } from "../utils/mapField";
import { fetchJsonStructure } from "../utils/fetch-json-structure";

// const WORDPRESS_TAGS_URL = "https://shega.co/wp-json/wp/v2/tags";

export default ({ strapi }: { strapi: Strapi }) => ({
    async migrateTags(ctx) {
        const { stopPage, batch } = ctx.params;
        const{username,password,url}=ctx.request.body
        let page = ctx.params.page;
        let hasMorePosts = true;
        let totalPage;
        let message=''
        let success=true;
        let firstPage = page;
        const WORDPRESS_TAGS_URL = url;
        const authorStructure=  await fetchJsonStructure()
        while (hasMorePosts) {
          try {
            const data = await fetchWordpressData(page, WORDPRESS_TAGS_URL, batch,username, password);
            const { data: wordpressTags, totalPages } = data;
            totalPage = totalPages;
            if(firstPage > totalPage ){
              message='Invalid page number';
              success=false
              break;
            }
            if (parseInt(page) > parseInt(stopPage) ) {
              hasMorePosts = false;
              break;
            }
            if (wordpressTags.length === 0) {
              hasMorePosts = false;
              break;
            }
            // const strapiTags = wordpressTags.map((tag) => ({
            //   id: tag?.id,
            //   name: tag?.name,
            //   slug: tag?.slug
            //     .toString()
            //     .toLowerCase()
            //     .trim()
            //     .replace(/\s+/g, "-")
            //     .replace(/[^\w-]+/g, "")
            //     .replace(/--+/g, "-"),
            //   seo: {
            //     metaTitle: tag?.name,
            //     metaDescription: tag.name,
            //   },
            // }));
    
            await Promise.all(
              wordpressTags.map(async(tag) =>{
                if(tag){
                  if (tag) {
                    try {
                      const tagFeilds=  mapFieldsNest(tag,authorStructure?.tags) 
                      console.log({tagFeilds})
                      const tagExist = await strapi.query("api::tag.tag").findOne({ where: { id: tag?.id } });
                      if (!tagExist) {
                        await strapi.service("api::tag.tag").create({ data: tagFeilds });
                      }else{
                        console.log(`Tag with ${tag?.id} id already exists`)
                      }
                    } catch (error) {
                      console.error(`Error creating tag with ID ${tag.id}: `, error);
                    }
                  }
                }
                }
              )
            );
    message='migration completed successfully!'
            page++;
            console.log(`Page ${page} migration completed successfully!`);
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
          message
        });
      },
})