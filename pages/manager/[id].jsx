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
                <div className={css['dashboard-header']}>
                    <div className={css['dashboard-title']}>
                      <h1>Dashboard</h1>
                    </div>
                    <div className={css['dashboard-profile']}>
                      <div className={css['dashboard-admin']}>
                          <h3>Joash Cabanilla</h3>
                          <small className={css['text-muted']}>Resort Manager</small>
                      </div>
                      <span className="material-icons-sharp">account_circle_full</span>
                    </div>
                </div>
                <div className={css['resort-name']}>
                    <h2>Hotel De Luna Hotel De Luna Hotel De Luna</h2> 
                </div>
                <div className={css.insights}>
                    <div className={css.pending}>
                      <span className="material-icons-sharp">pending_actions</span> 
                      <div className={css.middle}>
                        <div className={css.left}>
                          <h3>Pending</h3>
                          <h1>10</h1>
                        </div>
                      </div>
                      <small className={css['text-muted']}>Last 24 Hours</small>                   
                    </div>

                    <div className={css['checked-out']}>
                    <span className="material-icons-sharp">done_all</span> 
                      <div className={css.middle}>
                        <div className={css.left}>
                          <h3>Checked Out</h3>
                          <h1>10</h1>
                        </div>
                      </div>
                      <small className={css['text-muted']}>Last 24 Hours</small>                   
                    </div>

                    <div className={css['total-income']}>
                    <span className="material-icons-sharp">stacked_line_chart</span> 
                      <div className={css.middle}>
                        <div className={css.left}>
                          <h3>Total Income</h3>
                          <h1>₱10,000</h1>
                        </div>
                      </div>
                      <small className={css['text-muted']}>Last 24 Hours</small>                   
                    </div>
                </div>
            </main>
        </div>
      </div>
      </>
    );
} 