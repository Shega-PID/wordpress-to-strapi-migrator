import { useState } from "react";
import migrationRequest from "../api/migrate-posts-request";


export interface ResultType {
  success: boolean;
  postPerPage: string;
  startPage: string;
  lastPage: number;
  message: string;
}

const useMigrateCategory = () => {
  const [startPage, setStartPage] = useState<number>(1);
  const [fieldMap, setFieldMap] = useState<string[]>([]);
  const [endPage, setEndPage] = useState<number>(5);
  const [batch, setBatch] = useState<number>(100);
  const [restApi, setRestApi] = useState<string>('');
  const[result,setResult]=useState<ResultType>()
  const[showAlert,setShowAlert]=useState<boolean>(false)
  const[isMigrating,setIsMigrating]=useState<boolean>(false)
  const handleStartPage = async (value: number) => {
    setStartPage(value);
  };
  const handleEndPage = async (value: number) => {
    setEndPage(value);
  };
  const handleBatch = async (value: number) => {
    setBatch(value);
  };
  const handleRestApi = async (value: string) => {
    setRestApi(value);
  };
  const handleFieldMapping = async (value: string) => {
    setFieldMap(value.split(','));
  };
  const handleMigration = async (startpage:number,endPage:number,batch:number,restApi:string,fieldMap:string[]) => {
    setIsMigrating(true)

    if(restApi.toLowerCase() === 'categories'){
      console.log('inside categories')
     const  result= await migrationRequest.migrateCategory(startpage,endPage,batch,restApi);
      setResult(result)
    }else if(restApi.toLowerCase() === 'comments'){
    const  result= await migrationRequest.migrateComment(startpage,endPage,batch,restApi);
      setResult(result)
    } else if(restApi.toLowerCase() === 'media'){
    const  result= await migrationRequest.migrateMedia(startpage,endPage,batch,restApi);
      setResult(result)
    }else if(restApi.toLowerCase() === 'tags'){
     const result= await migrationRequest.migrateTag(startpage,endPage,batch,restApi);
      setResult(result)
    } else  if(restApi.toLowerCase() === 'posts'){
     const result= await migrationRequest.migratePost(startpage,endPage,batch,restApi);
      setResult(result)
    } else  if(restApi.toLowerCase() === 'author'){
    const  result= await migrationRequest.migrateAuthor();
      setResult(result)
    } else  if(restApi.toLowerCase() === 'users'){
     const result= await migrationRequest.migrateUser(startpage,endPage,batch);
      setResult(result)
    }
    setShowAlert(true)
    setIsMigrating(false)
    setRestApi('')
    console.log({isMigrating})
  };
  const handleClose = () => {
    setShowAlert(false);
  };
  return {
    startPage,
    endPage,
    batch,
    result,
    isMigrating,
    showAlert,
    restApi,
    fieldMap,
    handleBatch,
    handleStartPage,
    handleEndPage,
    handleRestApi,
    handleFieldMapping,
    handleMigration,
    handleClose
  };
};

export default useMigrateCategory;
