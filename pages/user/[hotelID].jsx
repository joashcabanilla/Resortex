import { useRouter } from 'next/router'
import cookie from 'cookie';

export async function getServerSideProps({req, res}){
  const mycookie = cookie.parse((req && req.headers.cookie) || "");
  const type = mycookie.type;
  const id = mycookie.id;
  if(type != undefined && type != "user"){
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

export default function Hotel() {
    //INITIALIZATION OF VARIABLES----------------------------------------------------------
    const router = useRouter();
    const { hotelID } = router.query;
    return (
        <div>HOTEL {hotelID}</div>
    )
}