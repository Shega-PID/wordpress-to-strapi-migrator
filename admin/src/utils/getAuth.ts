import { Password } from "@strapi/icons";

export const getAuth = () =>{
    const auth = localStorage.getItem('auth');
    if(auth){
        const{userName,password,url} = JSON.parse(auth)
        return {username:userName,pass:password,restUrl:url}
    }
}