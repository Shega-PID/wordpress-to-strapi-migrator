import { request } from "@strapi/helper-plugin";

const migrationRequest = {
  migratePost: async (
    startPage: number,
    endPage: number,
    batch: number,
    restApi: string
  ) => {
    return await request(
      `/w-to-s-migrator/migrate-post/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
        body: { restApi },
      }
    );
  },
  migrateAuthor: async () => {
    return await request("/w-to-s-migrator/migrate-author", {
      method: "POST",
    });
  },
  migrateUser: async (startPage: number, endPage: number, batch: number) => {
    return await request(
      `/w-to-s-migrator/migrate-users/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
      }
    );
  },
  migrateCategory: async (
    startPage: number,
    endPage: number,
    batch: number,
    restApi: string
  ) => {
    return await request(
      `/w-to-s-migrator/migrate-category/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
        body: { restApi },
      }
    );
  },
  migrateTag: async (
    startPage: number,
    endPage: number,
    batch: number,
    restApi: string
  ) => {
    return await request(
      `/w-to-s-migrator/migrate-tag/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
        body: { restApi },
      }
    );
  },
  migrateMedia: async (
    startPage: number,
    endPage: number,
    batch: number,
    restApi: string
  ) => {
    return await request(
      `/w-to-s-migrator/migrate-media/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
        body: { restApi },
      }
    );
  },
  migrateComment: async (
    startPage: number,
    endPage: number,
    batch: number,
    restApi: string
  ) => {
    return await request(
      `/w-to-s-migrator/migrate-comment/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
        body: { restApi },
      }
    );
  },
};

export default migrationRequest;
