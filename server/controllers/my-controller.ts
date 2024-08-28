import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('w-to-s-migrator')
      .service('myService')
      .getWelcomeMessage();
  },
});
