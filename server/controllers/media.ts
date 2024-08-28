import { Strapi } from "@strapi/strapi";
import fetchWordpressData from "../utils/fetchWordpressData";
import axios from "axios";
const fs = require("fs");
const path = require("path");
const os = require("os");
interface iUnUpdatedId{
  name:string;
  id:number;
}
export default ({strapi}:{strapi:Strapi}) =>({
    async downloadUploadMedia(ctx) {
        const wordpressUrl = "https://shega.co/wp-json/wp/v2/media";
        const { stopPage, batch } = ctx.params;
        const{username,password}=ctx.request.body
        let page = ctx.params.page;
        let message = "";
        let totalPage;
        const unUpdatedMediaId:iUnUpdatedId[]=[]
        const firstPage = page;
        let success = true;
        let hasMorePosts = true;
        while (hasMorePosts) {
          try {
            // Fetch media from WordPress
            const data = await fetchWordpressData(page, wordpressUrl, batch, username, password);
            const { data: mediaItems, totalPages } = data;
            // const mediaItems= media.filter((item) => item.id === 17121 );
            totalPage = totalPages;
            if (page == stopPage) {
              hasMorePosts = false;
              break;
            }
            if (mediaItems.length === 0) {
              hasMorePosts = false;
              break;
            }
            const downloadedDir = path.join(__dirname, "downloaded");
            await fs.promises.mkdir(downloadedDir, { recursive: true });
            const uploadPromises = mediaItems.map(async (media) => {
              const { guid, source_url, id } = media;
              const mediaUrl=source_url.toLowerCase().endsWith('.webp') ? guid.rendered : source_url
              // Download the media file
              const fileResponse = await axios.get(mediaUrl, {
                responseType: "arraybuffer",
                timeout: 3600000,
              });
              const buffer = Buffer.from(fileResponse.data, "binary");
              const fileName = path.basename(mediaUrl);
              const filePath = path.join(os.tmpdir(), fileName);
           
              await fs.promises.writeFile(filePath, buffer);
             
              const mediaName=fileName.split("").splice(0, 5).join("")
              const file = {
                path: filePath,
                name: mediaName,
                type: fileResponse?.headers["content-type"],
                size: buffer?.length,
              };
              const fileExtension = path.extname(fileName).slice(1);
              if (fileExtension === "webp") {
                file.type = "image/webp";
              }
          
              // Upload the file to Strapi
                const fileExist = await strapi
                  .query("plugin::upload.file")
                  .findOne({
                    where: { id: media.id },
                  });
                if (!fileExist) {
                 try{
                  const createdFiles =
                  await strapi.plugins.upload.services.upload.upload({
                    data: {
                      fileInfo: {
                        name: mediaName ?? '',
                        alternativeText: `${media?.alt_text},v2`,
                        caption: media?.caption?.rendered ?? '',
                        width: media?.media_details?.width ?? 0,
                        height: media?.media_details?.height ?? 0,
                        formats: {
                          thumbnail: {
                            name: `thumbnail_${mediaName ?? ''}`,
                            hash: `thumbnail_${id}`,
                            ext: path?.extname(mediaName)?.slice(1),
                            mime: file?.type,
                            width: media?.media_details?.width,
                            height: media?.media_details?.height,
                            size: media?.media_details?.filesize,
                            url: `${
                              mediaUrl?.split("?")[0]
                            }?width=156&height=156`,
                          },
                        },
                      },
                    },
                    files: file,
                  });   
                await strapi.query("plugin::upload.file").update({
                  where: { id: createdFiles["0"].id },
                  data: {
                    id: media.id,
                  },
                });
             
                console.log(`Uploaded media to Strapi: ${fileName}`);
                 }catch(error){
                  unUpdatedMediaId.push({name:media.name,id:media.id})
                  console.log(error.stack, media.id,error?.stack.message,error)
                 }
                }else{
                  console.log(`Media with ${media.id} already exists`);
                } 
            });
            page++;
            // Use Promise.all to wait for all the upload promises to complete
            await Promise.all(uploadPromises);
            message = "migration completed successfully!";
            success = true;
            console.log(`Page ${page} uploaded completed successfully!`);
            console.log({unUpdatedMediaId})
          
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.code === "ERR_BAD_REQUEST") {
                message = "Encountered a Bad Request error. Invalid page number.";
                success = false;
                break;
              }
            } else {
              continue;
            }
          }
        }
  
        ctx.send({
          success,
          PerPage: batch,
          totalPages: totalPage,
          startPage: firstPage,
          lastPage: page - 1,
          message,
        });
      },
     
      
})