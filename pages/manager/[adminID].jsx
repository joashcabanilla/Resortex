import {useRouter} from 'next/router';
import cookie from 'cookie';
import css from '../../styles/Pages/manager.module.css';
import Head from 'next/head';
import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { database } from '../../firebase/firebaseConfig';
// import { ref, child, get } from 'firebase/database';
import QRCode from 'qrcode.react';
import { getReservation } from '../../redux/reduxSlice/hotelSlice';

export async function getServerSideProps({req, res}){
  const mycookie = cookie.parse((req && req.headers.cookie) || "");
  const type = mycookie.type;
  const id = mycookie.id;
  // const databaseRef = ref(database);
  // const reservationPath = `PACKAGE-RESERVATION/${id}`;
  let reservation = {};

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

  // await get(child(databaseRef, reservationPath))
  // .then((snapshot) => {
  //     snapshot.exists() ? reservation = { ...snapshot.val() } : null;
  // })
  // .catch((err) => {
  //     console.log(err);
  // });

  return{
    props:{reservation}
  }
}

export default function Manager({reservation}) {
  // <td> 
  // <QRCode value="N1TITemRbE7VgkqFdro" 
  // size="40"
  // imageSettings={{
  //   src: "/logo/logo.png",
  //     x: null,
  //     y: null,
  //     height: 12,
  //     width: 12,
  //     excavate: true,
  // }}/>
  // </td>
  //REACT HOOKS-------------------------------------------------------------------------
  useEffect(() => {
    dispatch(getReservation({...reservation}));
  },[]);

    //import variables-------------------------------------------------------------------------
    const dispatch = useDispatch();
    const router = useRouter();
    const {adminID} = router.query;

    //redux state------------------------------------------------------------------------------
    const stateManager = useSelector(state => state.storeUsers.hotelManagerAcct);
    const stateHotel = useSelector(state => state.storeHotel.hotelList);
    const stateReservation = useSelector(state => state.storeHotel.reservation);

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

    //function get date today--------------------------------------------------------------------
    const getDateToday = () => {
      let date = new Date();
      let month = date.getMonth()+1 < 10 ?  `0${date.getMonth()+1}` : date.getMonth()+1;
      let day = date.getDate() < 10 ?  `0${date.getDate()}` : date.getDate();
      let year = date.getFullYear();
      return `${month}-${day}-${year}`;
    }

    //Links component----------------------------------------------------------------------------
    const linkDashboard = () => {
      const managerName = `${stateManager[`${adminID}`].FIRSTNAME} ${stateManager[`${adminID}`].LASTNAME}`;
      const hotelName = stateHotel[`${adminID}`]['HOTEL-NAME'];
      let recentBookingCounter = 0;
      let totalPending = 0;
      let totalCustomerServed = 0;
      let totalIncome = 0;
      let recentBookingData = [];

      //Get Reservation Data---------------------------------------------------------------------
      Object.values(stateReservation).forEach(valPackage => {
        Object.values(valPackage).forEach(valReference => {
          Object.values(valReference).forEach(value => {
            let customerName = value['USER-FULL NAME'];
            let dateCheckIn = value['DATE-CHECK IN'];
            let dateCheckOut = value['DATE-CHECK OUT'];
            let packageName = value['PACKAGE-NAME'];
            let payment = value['PACKAGE-AMOUNT TOTAL'];
            let status = value['REFERENCE STATUS'];
            let dateReserved = value['USER-DATE OF RESERVATION'].substring(0,10);
            recentBookingCounter++;
            if(dateReserved == getDateToday() && status == "PENDING"){
              recentBookingCounter <= 5 ? 
              recentBookingData.push({
                customerName: customerName,
                dateCheckIn: dateCheckIn,
                dateCheckOut: dateCheckOut,
                packageName: packageName,
                payment: payment,
                status: status
              }): null;
            }
            status == "PENDING" ? totalPending++ : null;
            status == "CHECKED-OUT" ? totalCustomerServed++ : null;
            if(status == "CHECKED-OUT"){
              // totalIncome = totalIncome + parseFloat(payment.payment.substring(3).replace(/,/g, ".")).toFixed(2);
            }
          });
        });
      });
      console.log(totalIncome);
      return(
        <main className={css.main}>
        <div className={css['dashboard-header']}>
            <div className={css['dashboard-title']}>
              <h1>Dashboard</h1>
            </div>
            <div className={css['dashboard-profile']}>
              <div className={css['dashboard-admin']}>
                  <h3>{managerName}</h3>
                  <small className={css['text-muted']}>Resort Manager</small>
              </div>
              <span className="material-icons-sharp">account_circle_full</span>
            </div>
        </div>
        <div className={css['resort-name']}>
            <h2>{hotelName}</h2> 
        </div>

        {/* -----------------Dashboard Status------------------ */}
        <div className={css.insights}>
            <div className={css.pending}>
              <span className="material-icons-sharp">pending_actions</span> 
              <div className={css.middle}>
                <div className={css.left}>
                  <h3>Pending</h3>
                  <h1>{totalPending}</h1>
                </div>
              </div>                   
            </div>

            <div className={css['checked-out']}>
            <span className="material-icons-sharp">done_all</span> 
              <div className={css.middle}>
                <div className={css.left}>
                  <h3>Customer Served</h3>
                  <h1>{totalCustomerServed}</h1>
                </div>
              </div>                   
            </div>

            <div className={css['total-income']}>
            <span className="material-icons-sharp">stacked_line_chart</span> 
              <div className={css.middle}>
                <div className={css.left}>
                  <h3>Total Income</h3>
                  <h1>₱10,000</h1>
                </div>
              </div>                   
            </div>
        </div>

        {/* ---------------RECENT BOOKING--------------------- */}
        <div className={css['recent-booking']}>
            <h2>Recent Booking</h2>
            <table>
              <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Date Check In</th>
                    <th>Date Check Out</th>
                    <th>Package</th>
                    <th>Payment</th>
                    <th>Status</th>
                  </tr>

              </thead>
              <tbody>
                  {
                    recentBookingData.map((value, index) => 
                      <tr key={index}>
                        <td>{value.customerName}</td>
                        <td>{value.dateCheckIn}</td>
                        <td>{value.dateCheckOut}</td>
                        <td>{value.packageName}</td>
                        <td>{value.payment}</td>
                        <td>{value.status}</td>
                      </tr>)
                  }
              </tbody>
            </table> 
        </div>
        </main>
      );
    }

    const linkBooking = () => {
      return(<div>booking</div>);
    }

    const linkPackage = () => {
      return(<div>package</div>);
    }

    const linkSettings = () => {
      return(<div>settings</div>);
    }
    const linkAccount = () => {
      return(<div>account</div>);
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

            {linkActive == "dashboard" ? linkDashboard() : 
             linkActive == "booking" ? linkBooking() :
             linkActive == "package" ? linkPackage() : 
             linkActive == "settings" ? linkSettings() :
             linkActive == "account" ? linkAccount() : null
            }
        </div>
      </div>
      </>
    );
} 