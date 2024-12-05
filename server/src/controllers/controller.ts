import type { Core } from '@strapi/strapi';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('w-to-s-migrator-plugin')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
      ctx.send('Hello')
  },
});

export default controller;
