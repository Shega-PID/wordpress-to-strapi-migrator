import { useState } from "react";
import migrationRequest from "../api/migrate-posts-request";
import { getAuth } from "../utils/getAuth";

export interface ResultType {
  success: boolean
  postPerPage: string
  startPage: string
  lastPage: number
  message: string
}

const useHomePage = () =>{
    const[isMigrating,setIsMigrating]=useState<boolean>(false)
    const[userName,setUserName]=useState<string>('');
    const[password,setPassword]=useState<string>('');
    const[url,setUrl]=useState<string>('')
    const[result,setResult]=useState<ResultType>()
    const[showAlert,setShowAlert]=useState<boolean>(false)
    const [isVisible, setIsVisible] = useState<boolean>(true);

   const authContent = getAuth();

    const handleClose = () => {
      setIsVisible(false);
      setShowAlert(false);
    };
  //   const handlePostsMigration = async () => {
  //     setIsMigrating(true)
  //    const result= await migrationRequest.migratePost();
  //  if(result){
  //   setIsMigrating(false)
  //  }
  //   };
    // const handleAuthorMigration = async () => {
    //   setIsMigrating(true)
    //  const result= await migrationRequest.migrateAuthor();
    // if(result){
    //   setIsMigrating(false)
    // }
    // };
    // const handleUserMigration = async () => {
    //   setIsMigrating(true)
    //  const result= await migrationRequest.migrateUser();
    //  if(result){
    //   setIsMigrating(false)
    //  }
    // };
   
    
    // const handleCommentMigration = async () => {
    //   setIsMigrating(true)
    //  const result= await migrationRequest.migrateComment();
    //  if(result){
    //   setIsMigrating(false)
    //  }
    // };
    const handleMigration = async (startpage:number,endPage:number,batch:number,restApi:string,fieldMap:string[]) => {
      setIsMigrating(true)
      let result;
      if(restApi.toLowerCase() === 'categories'){
        result= await migrationRequest.migrateCategory(authContent?.username,authContent?.pass,startpage,endPage,batch,`${authContent?.restUrl}/${restApi}`,fieldMap);
      }
      if(restApi.toLowerCase() === 'comments'){
        result= await migrationRequest.migrateComment(authContent?.username,authContent?.pass,startpage,endPage,batch,`${authContent?.restUrl}/${restApi}`);
      }
      if(restApi.toLowerCase() === 'media'){
        result= await migrationRequest.migrateMedia(authContent?.username,authContent?.pass,startpage,endPage,batch,`${authContent?.restUrl}/${restApi}`);
      }
      if(restApi.toLowerCase() === 'tags'){
        result= await migrationRequest.migrateTag(authContent?.username,authContent?.pass,startpage,endPage,batch,`${authContent?.restUrl}/${restApi}`);
      }
      if(restApi.toLowerCase() === 'posts'){
        result= await migrationRequest.migratePost(authContent?.username,authContent?.pass,startpage,endPage,batch,`${authContent?.restUrl}/${restApi}`);
      }
      if(restApi.toLowerCase() === 'author'){
        result= await migrationRequest.migrateAuthor(authContent?.username,authContent?.pass,startpage,endPage,batch,`${authContent?.restUrl}/${restApi}`,fieldMap);
      }
      if(restApi.toLowerCase() === 'users'){
        result= await migrationRequest.migrateUser(authContent?.username,authContent?.pass,startpage,endPage,batch,`${authContent?.restUrl}/${restApi}`,fieldMap);
      }
      setResult(result)
      setShowAlert(true)
    if(result){
      setIsMigrating(false)
    }
    };

    // const handleTagMigration = async (startpage:number,endPage:number,batch:number,restApi:string) => {
    //   setIsMigrating(true)
    //  const result= await migrationRequest.migrateTag(authContent?.username,authContent?.pass,startpage,endPage,batch,`${authContent?.restUrl}/${restApi}`);
    //  if(result){
    //   setIsMigrating(false)
    //  }
    // };
    // const handleMediaMigration = async (startpage:number,endPage:number,batch:number,restApi:string) => {
    //   setIsMigrating(true)
    //  const result= await migrationRequest.migrateMedia(authContent?.username,authContent?.pass,startpage,endPage,batch,`${authContent?.restUrl}/${restApi}`);
    //  if(result){
    //   setIsMigrating(false)
    //  }
    // };
  const handleUserName = (value:string) =>{
   setUserName(value)
  }
  const handlePassword = (value:string) =>{
   setPassword(value)
  }
  const handleUrl = (value:string) =>{
    setUrl(value)
   }
    return{
isMigrating,
result,
showAlert,
isVisible,
userName,password,url,
handleMigration,
handleUserName,
handlePassword,
handleClose,
handleUrl
    }
}

export default useHomePage