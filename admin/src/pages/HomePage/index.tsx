/*
 *
 * HomePage
 *
 */

import { useState } from "react";
import migrationRequest from "../../api/migrate-posts-request";
import SButton from "../../components/CommonButton";
import "../App/App.css";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";

const HomePage = () => {
  const[isMigrating,setIsMigrating]=useState<boolean>(false)
  const handlePostsMigration = async () => {
   const result= await migrationRequest.migratePost();
   console.log({result})
  };
  const handleAuthorMigration = async () => {
   const result= await migrationRequest.migrateAuthor();
   console.log({result})
  };
  const handleUserMigration = async () => {
   const result= await migrationRequest.migrateUser();
   console.log({result})
  };
  const handleTagMigration = async () => {
   const result= await migrationRequest.migrateTag();
   console.log({result})
  };
  const handleCommentMigration = async () => {
   const result= await migrationRequest.migrateComment();
   console.log({result})
  };
  const handlecategoryMigration = async () => {
   const result= await migrationRequest.migrateCategory();
    setIsMigrating(true)
  if(result){
    setIsMigrating(false)
  }
   console.log({result})
  };
  const handleMediaMigration = async () => {
   const result= await migrationRequest.migrateMedia();
   console.log({result})
  };


  return (
    <div className="home-page">
      <h1>Migrate your content from WordPress to Strapi In Minutes</h1>
      {isMigrating && <LoadingIndicatorPage/>}
      <div className="migrate-post">
        <SButton onClick={handlePostsMigration} label="Migrate Posts" />
        <SButton onClick={handleMediaMigration} label="Migrate Media" />
        <SButton onClick={handleCommentMigration} label="Migrate Comment" />
        <SButton onClick={handlecategoryMigration} label="Migrate Category" />
        <SButton onClick={handleTagMigration} label="Migrate Tags" />
        <SButton onClick={handleAuthorMigration} label="Migrate Authors" />
        <SButton onClick={handleUserMigration} label="Migrate Users" />
      </div>
    </div>
  );
};

export default HomePage;
