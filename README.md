# Strapi plugin WordPress-to-Strapi-migrator

## Description
This Strapi plugin allows you to seamlessly migrate your WordPress content to Strapi, including media files, posts/news, categories, authors, users, comments, and tags. The plugin utilizes WordPress's REST API to fetch the necessary data, making the migration process efficient and reliable.

## Key Features
* **Media File Migration**: Migrate all your WordPress media files, including images, videos, and documents, to Strapi.
* **Post/News Migration**: Migrate all your WordPress posts and news articles, including their content, categories, and tags, to Strapi.
* **Category Migration**: Migrate all your WordPress categories, including their hierarchy and relationships, to Strapi.
* **Author Migration**: Migrate all your WordPress authors, including their profiles and posts, to Strapi.
* **User Migration**: Migrate all your WordPress users, including their profiles and roles, to Strapi.
* **Comment Migration**: Migrate all your WordPress comments, including their relationships with posts and authors, to Strapi.
* **Tag Migration**: Migrate all your WordPress tags, including their relationships with posts, to Strapi.


## Instruction
To install the package, run:
 ```bash
 npm install w-to-s-migrator
 or
 yarn add w-to-s-migrator
```
To integrate with strapi: add piece of code to your  /config/plugin.ts/js

```bash
 "w-to-s-migrator": 
    {
      enabled: true,
      resolve:"./node_modules/w-to-s-migrator"
    }
```
Then to start migrating you content follow below instruction:
* ***Create map-strapi-towordpress.json file**: Create json file 'map-strapi-towordpress.json' inside your strapi project root directory and specifiy WordPress to Strapi field. you can modify
```bash
{
   "author": 
   [
      "id:id",
      "name:name",
      "email:email"
   ],
   "user": 
   [
      "id:ID",
      "username:user_login",
      "email:user_email",
      "firstName:first_name",
      "lastName:last_name"
   ],
   "category": 
   [
      "id:id",
      "name:name",
      "slug:slug",
      "description:description",
      "seo:'metaTitle-name','metaDescription-description'"
   ],
   "tags": 
   [
      "id:id",
      "name:name",
      "slug:slug",
      "seo:'metaTitle-name','metaDescription-name'"
   ],
   "comments":
   [
      "id:id",
      "date:date",
      "body:content.rendered",
      "post:post"
   ]
   
}
```
* ***Add environment variable**: to your .env file, wordpress_username and wordpress_password if your WordPress REST API is protected 
```bash
WORDPRESS_TOKEN_URL=https://xxx/wp-json/jwt-auth/v1/token  
WORDPRESS_USERNAME=xxx
WORDPRESS_PASSWORD=xxx
CONTENT_URL=https://xxx/wp-json/wp/v2 
```
* ***To migrate Authors**: First export your authors from WordPress.Then create json file that contain your authors list with __'w_authors.json'__ file name inside your strapi project root directory. Then navigate to left side nav, select w-to-s-migrator, enter __author__ as an input for REST API field and click migrate button.
* ***To migrate Users**: First export your users from WordPress.Then create json file that contain your users list using  __'w_users.json'__ inside your strapi project root directory.Then navigate to left side nav, select w-to-s-migrator, enter start page, end page and batch number and  __users__ as an input for REST API field. start page, end page and batch number depending on number of users you have on your WordPress App.
* ***To migrate category**: Enter start page, end page and batch number as per your category content and use __categories__ as an input for the REST API.
* ***To migrate Tag**: Enter start page, end page and batch number as per your category content and use __tags__ as an input for the REST API.
* ***To migrate comments**: Enter start page, end page and batch number as per your category content and use __comments__ as an input for the REST API.
* ***To migrate media**: Enter start page, end page and batch number as per your category content and use __media__ as an input for the REST API.
* ***To migrate post**: Enter start page, end page and batch number as per your category content and use __posts__ as an input for the REST API.


__Note That__: If you got more complex field mapping and also got static field value. Then follow below instruction

* ***Clone the repo**: 
```bash
git clone https://github.com/shega-media-technology/wordpress-to-strapi-migrator.git
```
* ***Create plugins director**: In side your strapi project under src director if you don't have plugins directory create it and copy paste the repo you clone there.
* ***Add plugin config**: Add integration config to your ./config/plugins  file
```bash
 'w-to-s-migrator': 
    {
      enabled: true,
      resolve: './src/plugins/w-to-s-migrator'
    },
```
* ***Modify the controller you need**: Find controller you need to modify __plugins/w-to-s-migrator/server/controller__ and follow instruction writtern as a comment on each controller to modify field mapping you need.
* ***Start your strapi and enjoy the migration**: First open your terminal and navigate to src/plugin/w-to-s-migrator and build your code
```bash
yarn build or npm run build
```
Then return back to root director and start your strapi

```bash
yarn develop  or npm run develop
```
## About Shega
Shega is an information and technology company that offers in-depth insights into Ethiopia’s economy by delivering an integrated media, data, and intelligence solution designed to drive informed decision-making and promote innovation.
More at [Visit our website](https://shega.co) 

###  Give a shout-out to Shega
- ⭐ Star our GitHub repo
- 🐞 Create requests, submit bugs, suggest new features
- ☄️  Share to your friends and collegues
- 🔥 Follow us on [Twitter]([https://twitter.com/MelakeWub](https://twitter.com/shegahq)) and [LinkedIn](https://www.linkedin.com/company/shegahq)
