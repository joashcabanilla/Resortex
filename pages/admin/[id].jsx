import {useRouter} from 'next/router';
import cookie from 'cookie';

export async function getServerSideProps({req, res}){
  const mycookie = cookie.parse((req && req.headers.cookie) || "");
  const type = mycookie.type;
  const id = mycookie.id;
  if(type != undefined && type != "admin"){
    return {
      redirect: {
        destination: `${type}/${id}`,
        permanent: false,
      }
    };
  }
  if(type == undefined){
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    };
  }
  return{
    props:{}
  }
}

export default function Admin() {
    //import variables
    const router = useRouter();

    const LogOut = () => {
      fetch("/api/logout", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
    });
      router.replace("/");
    }

    return(
      <button onClick={LogOut}>Log Out</button>
    );
} 