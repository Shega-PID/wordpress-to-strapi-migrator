import { request } from "@strapi/helper-plugin";

const migrationRequest = {
  migratePost: async (
    username: string,
    password: string,
    startPage: number,
    endPage: number,
    batch: number,
    url: string
  ) => {
    return await request(
      `/w-to-s-migrator/migrate-post/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
        body: { username, password, url },
      }
    );
  },
  migrateAuthor: async (
    username: string,
    password: string,
    startPage: number,
    endPage: number,
    batch: number,
    url: string
  ) => {
    return await request("/w-to-s-migrator/migrate-author", {
      method: "POST",
      body: { username, password, url },
    });
  },
  migrateUser: async (  username: string,
    password: string,
    startPage: number,
    endPage: number,
    batch: number,
    url: string) => {
    return await request(`/w-to-s-migrator/migrate-users/${startPage}/${endPage}/${batch}`, {
      method: "POST",
      body: { username, password,url },
    });
  },
  migrateCategory: async (
    username: string,
    password: string,
    startPage: number,
    endPage: number,
    batch: number,
    url: string
  ) => {
    return await request(
      `/w-to-s-migrator/migrate-category/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
        body: { username, password, url },
      }
    );
  },
  migrateTag: async (
    username: string,
    password: string,
    startPage: number,
    endPage: number,
    batch: number,
    url: string
  ) => {
    return await request(
      `/w-to-s-migrator/migrate-tag/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
        body: { username, password, url },
      }
    );
  },
  migrateMedia: async (
    username: string,
    password: string,
    startPage: number,
    endPage: number,
    batch: number,
    url: string
  ) => {
    return await request(
      `/w-to-s-migrator/migrate-media/${startPage}/${endPage}/${batch}`,
      {
        method: "POST",
        body: { username, password, url },
      }
    );
  },
  migrateComment: async (  username: string,
    password: string,
    startPage: number,
    endPage: number,
    batch: number,
    url: string) => {
    return await request(`/w-to-s-migrator/migrate-comment/${startPage}/${endPage}/${batch}`, {
      method: "POST",
      body: { username, password,url },
    });
  },
};

export default migrationRequest;
