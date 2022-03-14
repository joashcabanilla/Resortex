import { useEffect } from "react";

export async function getServerSideProps(context){
    let cookies = context.req.headers.cookie;
    if(cookies != undefined){
      let arrCookies = cookies.split(';');
      let newCookies = arrCookies.map(value => {
        return value.trim().split('=');
      });
      let objCookie = {
        type: newCookies[0][1],
        id: newCookies[1][1],
      };

      if(objCookie.type != "user"){
        return {
          redirect:{
              destination:`${objCookie.type}/${objCookie.id}`,
              permanent:false,
          }
        }
      }
    }
    return{
      props:{}
    }
  }

export default function User() {
    useEffect(() => {   
    },[]);
    return(
        <div>User</div>
    );
}