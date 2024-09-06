export default [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
      auth:false,
      middleware:[]
    },
  },
  {
    method: 'POST',
    path: '/migrate-author',
    handler: 'author.migrateAuthors',
    config: {
      policies: [],
      auth:false,
      middleware:[]
    },
  },
  {
    method: 'POST',
    path: '/migrate-users/:page/:stopPage/:batch',
    handler: 'users.migrateUser',
    config: {
      policies: [],
      auth:false,
      middleware:[]
    }
},
{
  method: 'POST',
  path: '/migrate-category/:page/:stopPage/:batch',
  handler: 'category.migrateCategories',
  config: {
    policies: [],
    auth:false,
    middleware:[]
  }
},
{
  method: 'POST',
  path: '/migrate-tag/:page/:stopPage/:batch',
  handler: 'tag.migrateTags',
  config: {
    policies: [],
    auth:false,
    middleware:[]
  }
},
{
  method: 'POST',
  path: '/migrate-media/:page/:stopPage/:batch',
  handler: 'media.downloadUploadMedia',
  config: {
    policies: [],
    auth:false,
    middleware:[]
  }
},
{
  method: 'POST',
  path: '/migrate-post/:page/:stopPage/:batch',
  handler: 'post.migratePosts',
  config: {
    policies: [],
    auth:false,
    middleware:[]
  }
},
{
  method: 'POST',
  path: '/migrate-comment/:page/:stopPage/:batch',
  handler: 'comment.migrateComments',
  config: {
    policies: [],
    auth:false,
    middleware:[]
  }
},
];
