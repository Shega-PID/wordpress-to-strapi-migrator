const mime = require("mime-types");
import { factories } from "@strapi/strapi";
import fetchWordpressData from "../utils/fetchWordpressData";
import axios from "axios";
import fs from "fs";
import path from "path";
import os from "os";

interface iUnUpdatedId {
  name: string;
  id: number;
}

export default factories.createCoreController(
  "plugin::upload.file",
  ({ strapi }) => ({
    async downloadUploadMedia(ctx) {
      console.log("Start downloading");
      const { stopPage, batch } = ctx.params;
      let page = ctx.params.page;
      let message = "";
      let totalPage;
      const unUpdatedMediaId: iUnUpdatedId[] = [];
      const firstPage = page;
      let success = false;
      let hasMorePosts = true;
      const { restApi } = ctx.request.body;

      while (hasMorePosts) {
        try {
          // Fetch media from WordPress
          const data = await fetchWordpressData(
            Number(page),
            Number(batch),
            restApi,
          );
          const { data: mediaItems, totalPages } = data;
          totalPage = totalPages;

          if (page == stopPage || mediaItems.length === 0) {
            hasMorePosts = false;
            break;
          }

          const downloadedDir = path.join(__dirname, "downloaded");
          await fs.promises.mkdir(downloadedDir, { recursive: true });

          const uploadPromises = mediaItems.map(async (media) => {
            const { source_url, id } = media;
            const mediaUrl = source_url;

            // Download the media file
            const fileResponse = await axios.get(mediaUrl, {
              responseType: "arraybuffer",
              timeout: 3600000,
            });

            const buffer = Buffer.from(fileResponse.data, "binary");
            const fileName = path.basename(mediaUrl);
            const filePath = path.join(os.tmpdir(), fileName);

            await fs.promises.writeFile(filePath, buffer);

            const mediaName = fileName.split("").splice(0, 5).join("");
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

            // Ensure the file path is defined and the file exists
            if (!file.path || !fs.existsSync(file.path)) {
              throw new Error(
                `File path is invalid or file does not exist for media ID ${id}`,
              );
            }

            const fileExist = await strapi.entityService.findOne(
              "plugin::upload.file",
              media.id,
            );
            if (!fileExist) {
              const uploader = strapi.service("plugin::upload.upload");
              try {
                fs.writeFileSync(filePath, buffer);
                const stats = fs.statSync(filePath);

                const response = await uploader.upload({
                  data: {
                    fileInfo: {
                              name: mediaName ?? "",
                              alternativeText: `${media?.alt_text},v2`,
                              caption: media?.caption?.rendered ?? "",
                              width: media?.media_details?.width ?? 0,
                              height: media?.media_details?.height ?? 0,
                            },
                  },
                  files: {
                    filepath: filePath,
                    newFilename: path.basename(filePath),
                    originalFilename: path.basename(filePath),
                    size: stats.size,
                    mimetype: mime.lookup(filePath),
                  },
                });
             
                await strapi.db.query('plugin::upload.file').update({
                  where: { id: response[0]?.id },
                  data: { id: media?.id },
                });
              } catch (error) {
                console.log(error.stack || error.message)
              } finally {
                fs.rmSync(filePath);
              }
             
            } else {
              console.log(`Media with ID ${media.id} already exists`);
            }
          });

          page++;
          await Promise.all(uploadPromises);
          message = "Media migration completed successfully!";
          success = true;
          console.log(`Media page ${page} uploaded successfully!`);
          console.log({ unUpdatedMediaId });
        } catch (error) {
          if (axios.isAxiosError(error) && error.code === "ERR_BAD_REQUEST") {
            message = "Encountered a Bad Request error. Invalid page number.";
            success = false;
            break;
          } else {
            console.error(`Error on page ${page}:`, error);
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
  }),
);
