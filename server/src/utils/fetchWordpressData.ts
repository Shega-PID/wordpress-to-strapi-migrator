import axios from 'axios';
const path = require('path');
const fs = require('fs');
interface WordpressResponse {
  data: any[];
  totalPages: number;
}
export async function fetchToken() {
  let token = '';
  const username=process.env.WORDPRESS_USERNAME;
  const password=process.env.WORDPRESS_PASSWORD;
  const url=process.env.WORDPRESS_TOKEN_URL;
  const res=  await axios.post(`${url}?username=${username}&password=${password}`, {},
    { withCredentials: false })
    if (res && res.data && res.data.data && res.data.data.token) {
      token = res.data.data.token;
    } else {
      console.error('Unexpected response structure:', res);
    }
  return token;
}

async function fetchWordpressData(
  page: number,
  batch: number,
  restApi:string
): Promise<WordpressResponse> {

 
 const token=await fetchToken()
 const url=`${process.env.CONTENT_URL}/${restApi}`;
  if(token){
    try{
    const response = await axios.get<any[]>(url, {
      params: {
        per_page: batch ?? 10,
        page: page,
      },
      timeout: 3600000,
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json', 
      }
    });
  
    const totalPages = parseInt(response.headers["x-wp-totalpages"], batch ?? 10);
  
    return {
      data: response.data,
      totalPages: totalPages
    };
  }catch(error){
    console.log(error.message || error?.stack)
    return {
      data: [],
      totalPages: 0
    };
  }

  }else{
    return { data: [], totalPages: 0 };
  }
   

 
}




export async function fetchJsonData(page, filePath, batch,stopPage) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const allUsers = JSON.parse(fileContent);

    const start = (page - 1) * batch;
    const end = stopPage * batch;
    const paginatedUsers = allUsers.slice(start, end);

    const totalPages = Math.ceil(allUsers.length / batch);

    return {
      data: paginatedUsers,
      totalPages,
    };
  } catch (error) {
    throw new Error('Error reading or parsing the JSON file');
  }
}



export default fetchWordpressData;