import {useRouter} from 'next/router';
import cookie from 'cookie';
import css from '../../styles/Pages/manager.module.css';
import Head from 'next/head';
import {useState} from 'react';

export async function getServerSideProps({req, res}){
  const mycookie = cookie.parse((req && req.headers.cookie) || "");
  const type = mycookie.type;
  const id = mycookie.id;
  if(type != undefined && type != "manager"){
    if(type == "user"){
      return {
        redirect: {
          destination: `/${type}`,
          permanent: false,
        }
      };
    }
    else{
      return {
        redirect: {
          destination: `${type}/${id}`,
          permanent: false,
        }
      };
    }
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

export default function Manager() {
    //import variables-------------------------------------------------------------------------
    const router = useRouter();
    
    //state UI----------------------------------------------------------------------------------
    const [linkActive, setLinkActive] = useState("dashboard");

    //function for logout-----------------------------------------------------------------------
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
      <>
      <Head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />
      </Head>
      <div className={css.mainContainer}>
        <div className={css.container}>
            <aside>
                <div className={css.top}>
                  <div className={css.logo}>
                    <img src="/logo/logo.png" />
                    <h2>Resortex</h2>
                  </div>
                  <div className={css.close}>
                      <span className={`material-icons-sharp ${css.closebtn}`}>close</span>
                  </div>
                </div>

                <div className={css.sidebar}>
                  <a onClick={()=> setLinkActive("dashboard")} className={linkActive == "dashboard" ? css.active : ""}>
                    <span className="material-icons-sharp">grid_view</span>
                    <h3>Dashboard</h3>
                  </a>

                  <a onClick={()=> setLinkActive("booking")} className={linkActive == "booking" ? css.active : ""}>
                    <span className="material-icons-sharp">book_online</span>
                    <h3>Booking</h3>
                  </a>

                  <a onClick={()=> setLinkActive("package")} className={linkActive == "package" ? css.active : ""}>
                    <span className="material-icons-sharp">inventory_2</span>
                    <h3>Package</h3>
                  </a>

                  <a onClick={()=> setLinkActive("settings")} className={linkActive == "settings" ? css.active : ""}>
                    <span className="material-icons-sharp">settings</span>
                    <h3>Settings</h3>
                  </a>

                  <a onClick={()=> setLinkActive("account")} className={linkActive == "account" ? css.active : ""}>
                    <span className="material-icons-sharp">manage_accounts</span>
                    <h3>Manager Account</h3>
                  </a>

                  <a onClick={LogOut}>
                    <span className="material-icons-sharp">logout</span>
                    <h3>Logout</h3>
                  </a>
                </div>
            </aside>

            <main className={css.main}>
              <h1>Dashboard</h1>
                <div className={css.date}>
                  <input type="date" />
                </div>
                
            </main>
        </div>
      </div>
      </>
    );
} 