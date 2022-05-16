import {useRouter} from 'next/router';
import cookie from 'cookie';
import css from '../../styles/Pages/manager.module.css';
import cssBooking from '../../styles/Pages/booking.module.css';
import Head from 'next/head';
import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { database } from '../../firebase/firebaseConfig';
import { ref, child, get, onValue, set } from 'firebase/database';
import QRCode from 'qrcode.react';
import { getReservation, updateReferenceStatus } from '../../redux/reduxSlice/hotelSlice';
import { Form, Button, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { CSVLink } from "react-csv";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
    //import variables-------------------------------------------------------------------------
    const dispatch = useDispatch();
    const router = useRouter();
    const {adminID} = router.query;
    const mySwal = withReactContent(Swal);

    //redux state------------------------------------------------------------------------------
    const stateManager = useSelector(state => state.storeUsers.hotelManagerAcct);
    const stateHotel = useSelector(state => state.storeHotel.hotelList);
    const stateReservation = useSelector(state => state.storeHotel.reservation);
    const managerName = `${stateManager[`${adminID}`].FIRSTNAME} ${stateManager[`${adminID}`].LASTNAME}`;
    const hotelName = stateHotel[`${adminID}`]['HOTEL-NAME'];

    //state UI----------------------------------------------------------------------------------
    const [linkActive, setLinkActive] = useState("dashboard");
    const [stateRecentBooking, setStateRecentBooking] = useState([]);
    const [stateAllBooking, setStateAllBooking] = useState([]);
    const [statePending, setStatePending] = useState(0);
    const [stateCustomerServed, setStateCustomerServed] = useState(0);
    const [stateTotalIncome, setStateTotalIncome] = useState(0); 
    const [stateBookIncome, setStateBookIncome] = useState(0);
    const [stateBookApproved, setStateBookApproved] = useState(0);
    const [stateBookCheckOut, setStateBookCheckOut] = useState(0);
    const [stateBookPending, setStateBookPending] = useState(0);
    const [stateRefFilterDate, setStateRefFilterDate] = useState("");
    const [stateRefFilterMonth, setStateRefFilterMonth] = useState("");
    const [stateRefBookSearch, setStateRefBookSearch] = useState("");
    const [stateBookData, setStateBookData] = useState({});
    const [stateBookReference, setStateBookReference] = useState({});
    
    //useRef Hooks variables----------------------------------------------------------------------
    const bookFilterDate = useRef();
    const bookFilterMonth = useRef();
    const bookSearch = useRef();

  //function Resrvation Get and Update Data-----------------------------------------------------
  const ReservationData = () => {
    let recentBookingCounter = 0;
    let totalIncome = 0;
    let recentBookingData = [];
    let allBooking = [];
    let totalPending = 0;
    let totalCustomerServed = 0;
    let totalApproved = 0;

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
          let totalAmount = value['PACKAGE-RAW-AMOUNT TOTAL'];
          let reference = value['REFERENCE NUMBER'];
          let packageID = value['PACKAGE-ID'];
          let userID = value['USER-USER ID'];

          switch(status){
            case "PENDING":
              totalPending++;
            break;
            
            case "APPROVED":
              totalApproved++;
            break;

            case "CHECKED-OUT":
              totalCustomerServed++;
              totalIncome = totalIncome + totalAmount;
            break;
          }

          recentBookingCounter++;

          allBooking.push({
            customerName: customerName,
            dateCheckIn: dateCheckIn,
            dateCheckOut: dateCheckOut,
            packageName: packageName,
            status: status,
            reference: reference,
            packageID: packageID,
            userID: userID
          });

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
        });
      });
    });
    setStatePending(totalPending);
    setStateBookPending(totalPending);
    setStateCustomerServed(totalCustomerServed);
    setStateTotalIncome(totalIncome);
    setStateRecentBooking([...recentBookingData]);
    setStateBookApproved(totalApproved);
    setStateBookIncome(totalIncome);
    setStateBookCheckOut(totalCustomerServed);
    setStateAllBooking(allBooking);
  }

  //REACT HOOKS-------------------------------------------------------------------------
  useEffect( async () => {
    await dispatch(getReservation({...reservation}));
    ReservationData();
  },[]);

  useEffect(() => {
    ReservationData();
  },[stateReservation]);

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

    //function select tag for month-------------------------------------------------------------
    const getSelectMonth = () => {
      let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return(
        <Form.Select ref={bookFilterMonth} type="select" onChange={() => {BookFilter("month")}} value={stateRefFilterMonth}>
          <option value="" hidden>Select Month</option>
          {month.map((value, index) => {
            return <option key={index} value={index}>{value}</option>
          })}
        </Form.Select>
      );
    }

    //function booking filter by date-----------------------------------------------------------
    const BookFilter = (filter) => {
      let search = bookSearch.current.value;
      let date = bookFilterDate.current.value;
      let month = parseInt(bookFilterMonth.current.value) + 1; 
      month = month < 10 ? `0${month}` : month.toString();
      date = `${date.substring(5,7)}-${date.substring(8)}-${date.substring(0,4)}`;

      let pending = 0;
      let approved = 0;
      let checkOut = 0;
      let totalIncome = 0;
      let allBooking = [];
      
      const changeData = (totalAmount, status, customerName, dateCheckIn, dateCheckOut, packageName, reference, packageID, userID) => {
        switch(status){
          case "PENDING":
            pending++;
          break;
          case "APPROVED":
            approved++;
          break;
          case "CHECKED-OUT":
            checkOut++;
            totalIncome = totalIncome + totalAmount;
          break;
        }

        allBooking.push({
          customerName: customerName,
          dateCheckIn: dateCheckIn,
          dateCheckOut: dateCheckOut,
          packageName: packageName,
          status: status,
          reference: reference,
          packageID: packageID,
          userID: userID
        });
      }
      Object.values(stateReservation).forEach(valPackage => {
        Object.values(valPackage).forEach(valReference => {
          Object.values(valReference).forEach(value => {
              let dataDate = value['USER-DATE OF RESERVATION'].substring(0,10);
              let totalAmount = value['PACKAGE-RAW-AMOUNT TOTAL'];
              let status = value['REFERENCE STATUS'];
              let customerName = value['USER-FULL NAME'];
              let dateCheckIn = value['DATE-CHECK IN'];
              let dateCheckOut = value['DATE-CHECK OUT'];
              let packageName = value['PACKAGE-NAME'];
              let reference = value['REFERENCE NUMBER'];
              let packageID = value['PACKAGE-ID'];
              let userID = value['USER-USER ID'];

              switch(filter){
                case "date":
                  setStateRefFilterDate(bookFilterDate.current.value);
                  setStateRefFilterMonth("");
                  setStateRefBookSearch("");
                  dataDate == date ? changeData(totalAmount,status, customerName, dateCheckIn, dateCheckOut, packageName, reference, packageID, userID) : null;
                break;

                case "month":
                  setStateRefFilterMonth(bookFilterMonth.current.value);
                  setStateRefFilterDate("");
                  setStateRefBookSearch("");
                  dataDate.substring(0,2) == month ? changeData(totalAmount,status, customerName, dateCheckIn, dateCheckOut, packageName, reference, packageID, userID) : null;
                break;

                case "clear":
                  setStateRefFilterDate("");
                  setStateRefFilterMonth("");
                  setStateRefBookSearch("");
                  changeData(totalAmount,status, customerName, dateCheckIn, dateCheckOut, packageName, reference, packageID, userID);
                break;

                case "search":
                  setStateRefFilterDate("");
                  setStateRefFilterMonth("");
                  setStateRefBookSearch(search);
                  customerName.toLowerCase().search(search.toLowerCase()) != -1 || dateCheckIn.toLowerCase().search(search.toLowerCase()) != -1 || dateCheckOut.toLowerCase().search(search.toLowerCase()) != -1 || packageName.toLowerCase().search(search.toLowerCase()) != -1 || status.toLowerCase().search(search.toLowerCase()) != -1 ?
                  changeData(totalAmount,status, customerName, dateCheckIn, dateCheckOut, packageName, reference, packageID, userID) : search == "" ? changeData(totalAmount,status, customerName, dateCheckIn, dateCheckOut, packageName, reference, packageID, userID) : null;
                break;
              }
          });
        });
      });

      setStateBookPending(pending);
      setStateBookApproved(approved);
      setStateBookCheckOut(checkOut);
      setStateBookIncome(totalIncome);
      setStateAllBooking(allBooking);
    } 

    //function change Tab---------------------------------------------------------------
    const changeTab = (tab) => {
      ReservationData();
      setStateRefFilterDate("");
      setStateRefFilterMonth("");
      setStateRefBookSearch("");
      setStateBookReference({});
      switch(tab){
        case "dashboard":
          setLinkActive("dashboard");
        break;

        case "booking":
          setLinkActive("booking");
        break;

        case "package":
          setLinkActive("package");
        break;

        case "settings":
          setLinkActive("settings");
        break;

        case "account":
          setLinkActive("account");
        break;

        case "package":
          setLinkActive("package");
        break;
        
        case "package":
          setLinkActive("package");
        break;
        
      }

    };

    //function check update in reference status------------------------------------------------------
    const referenceStatusUpdate = (packageID, userID, reference) => {
      const referenceStatus = ref(database, `PACKAGE-RESERVATION/${adminID}/${packageID}/${userID}/${reference}/REFERENCE STATUS`);
      onValue(referenceStatus, (snapshot) => {
        const data = snapshot.val();
        if(data == "APPROVED"){
          setStateBookReference({...stateBookReference,approved: false, checkIn: true});
          dispatch(updateReferenceStatus([packageID,userID,reference,"REFERENCE STATUS","APPROVED"]));
          bookData(reference);
        } 
      });
    }

    //function get customer booking data---------------------------------------------------------------
    const bookData = (reference) => {
      Object.values(stateReservation).forEach(valPackage => {
        Object.values(valPackage).forEach(valReference => {
          Object.values(valReference).forEach(value => {
            let valReference = value['REFERENCE NUMBER'];
            if(valReference == reference){
              setStateBookData({
                reservationDateTime: value['USER-DATE OF RESERVATION'],
                customerID: value['USER-USER ID'],
                customerName: value['USER-FULL NAME'],
                packageName: value['PACKAGE-NAME'],
                customerRequest: value['PACKAGE-USER REQUEST'],
                daysAccommodated: value['DATE-DAYS ACCOMMODATED'],
                dayTime: value['DATE-DAY TIME'],
                checkIn: value['DATE-CHECK IN'],
                checkOut: value['DATE-CHECK OUT'],
                packageAmount: value['PACKAGE-AMOUNT'],
                totalAmount: value['PACKAGE-AMOUNT TOTAL'],
                reference: value['REFERENCE NUMBER'],
                packageID: value['PACKAGE-ID'],
              });
            }
          });
        });
      });
    }

    //function sweet alert-----------------------------------------------------------------------------
    const sweetAlert = (msg) => {
      mySwal.fire({
        icon: 'success',
        title: <p className={cssBooking.swalText}>{`Customer Reservation Successfully ${msg}`}</p>,
        customClass:{
          confirmButton: `${cssBooking.swalButton}`,
        }
      });
    }

    //function update reference status----------------------------------------------------------------
    const databaseUpdateReferenceStatus = (packageID, userID, reference, status) => {
      const referenceStatus = ref(database, `PACKAGE-RESERVATION/${adminID}/${packageID}/${userID}/${reference}/REFERENCE STATUS`);
      set(referenceStatus,`${status}`)
      .then(() => { 
        if(status == "CHECKED-IN")
        {
          dispatch(updateReferenceStatus([packageID,userID,reference,"REFERENCE STATUS","CHECKED-IN"]));
          setStateBookReference({...stateBookReference, checkIn: false});
          sweetAlert("Check In");
        }
        else{
          dispatch(updateReferenceStatus([packageID,userID,reference,"REFERENCE STATUS","CHECKED-OUT"]));
          setStateBookReference({...stateBookReference, checkOut: false});
          sweetAlert("Check Out");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }

    //function component-----------------------------------------------------------------------
    const bookingTable = () => {
      let headers = [
        {label: "Customer Name", key:"customerName"},
        {label: "Date Check In", key:"dateCheckIn"},
        {label: "Date Check Out", key:"dateCheckOut"},
        {label: "Package", key:"packageName"},
        {label: "Status", key:"status"}
      ];
      const columns = [
        {
          name: "Customer Name",
          selector: (row) => row.customerName,
          sortable: true,
          id: "columnName-1",
          style:{
            "font-family": "poppins, sans-serif",
            "font-size": "0.8rem",
            "text-align": "center",
            "justify-content": "center",
          }
        },
        {
          name: "Date Check In",
          selector: (row) => row.dateCheckIn,
          id: "columnName-2",
          style:{
            "font-family": "poppins, sans-serif",
            "font-size": "0.8rem",
            "text-align": "center",
            "justify-content": "center",
          }
        },
        {
          name: "Date Check Out",
          selector: (row) => row.dateCheckOut,
          id: "columnName-3",
          style:{
            "font-family": "poppins, sans-serif",
            "font-size": "0.8rem",
            "text-align": "center",
            "justify-content": "center",
          }
        },
        {
          name: "Package",
          selector: (row) => row.packageName,
          id: "columnName-4",
          style:{
            "font-family": "poppins, sans-serif",
            "font-size": "0.8rem",
            "text-align": "center",
            "justify-content": "center",
          }
        },
        {
          name: "Status",
          cell: (row) => {
            switch(row.status){
              case "PENDING":
               return <p className={cssBooking['pending']}>{row.status}</p>;
              break;

              case "APPROVED":
               return <p className={cssBooking['approved']}>{row.status}</p>;
              break;
              
              case "CHECKED-IN":
               return <p className={cssBooking['checked-in']}>{row.status}</p>;
              break;

              case "CHECKED-OUT":
                return <p className={cssBooking['checked-out']}>{row.status}</p>;
               break;
            }
          },
          id: "columnName-5",
          style:{
            "text-align": "center",
            "justify-content": "center",
            "align-items": "center",
          }
        },
        {
          name: "Action",
          cell: (row) => {

            switch(row.status){
              case "PENDING":
               return <div className={cssBooking['control-header']}>
                        <Button variant="info" onClick={() => {setStateBookReference({ref: row.reference, packageID: row.packageID, userID: row.userID, approved: true, checkIn: false, checkOut: false, viewInfo: false});referenceStatusUpdate(row.packageID, row.userID, row.reference);}}>Approved</Button>
                      </div>;
              break;

              case "APPROVED":
                return <div className={cssBooking['control-header']}>
                          <Button variant="info" onClick={() => {setStateBookReference({ref: row.reference, packageID: row.packageID, userID: row.userID, approved: false, checkIn: true, checkOut: false, viewInfo: false}); bookData(row.reference)}}>Check In</Button>
                        </div>;
              break;

              case "CHECKED-IN":
                return <div className={cssBooking['control-header']}>
                          <Button variant="info" onClick={() => {setStateBookReference({ref: row.reference, packageID: row.packageID, userID: row.userID, approved: false, checkIn: false, checkOut: true, viewInfo: false});}}>Check Out</Button>
                        </div>;
              break;
             
              case "CHECKED-OUT":
                return <div className={cssBooking['control-header']}>
                          <Button variant="info" onClick={() => {setStateBookReference({ref: row.reference, packageID: row.packageID, userID: row.userID, approved: false, checkIn: false, checkOut: false, viewInfo: true});}}>View Info</Button>
                        </div>;
              break;
            }
          },
          id: "columnName-6",
          style:{
            "justify-content": "center",
          }
        }
      ];

      return <DataTable 
      columns={columns} 
      data={stateAllBooking} 
      pagination 
      fixedHeader
      highlightOnHover
      actions={
        <Button variant="success"> 
          <CSVLink data={stateAllBooking} headers={headers} filename={"BookingReport.csv"} className={cssBooking['booking-report-download']}>
            Export Report
          </CSVLink>
        </Button>
      } 
      subHeader
      subHeaderComponent={
        <>
          <Form.Label>                    
          <span className="material-icons-sharp">search</span>
          </Form.Label>
          <Form.Control type="text" placeholder="Search" ref={bookSearch} onChange={() => {BookFilter("search")}} value={stateRefBookSearch}/>
        </>

      }
      />
    }

    const bookApproved = () => {
      return <Modal 
      show={stateBookReference.approved}
      animation={true}  
      centered
      onHide={() =>{setStateBookReference({...stateBookReference, approved: false});}}>
        <Modal.Header closeButton className={cssBooking.modalHeader}>
          <div>
            <p>Customer Reservation</p>
            <p>Reservation Qrcode Reference</p>
            </div>
        </Modal.Header>

        <Modal.Body>
          <div className={cssBooking.qrcode}>
            <QRCode value={stateBookReference.ref} size="128" imageSettings={{src: "/logo/logo.png",x: null,y: null,height: 30,width: 30,excavate: true,}}/>
          </div>
        </Modal.Body>
      </Modal>
    }

    const bookCheckIn = () => {
      return <Modal 
      show={stateBookReference.checkIn}
      animation={true}  
      centered
      onHide={() =>{setStateBookReference({...stateBookReference, checkIn: false});}}>
        <Modal.Header closeButton className={cssBooking.modalHeader}>
          <div>
            <p>Customer Reservation</p>
            <p>Reservation Check In</p>
            </div>
        </Modal.Header>

        <Modal.Body className={cssBooking['modal-body']}>
          <div>
            <h1>Reservation Check In</h1>
          </div>
          <div className={cssBooking['modal-check-in']}>
            <Form.Label>Reservation Date and Time</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.reservationDateTime} />

            <Form.Label>Customer ID</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.customerID}/>

            <Form.Label>Customer Name</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.customerName}/>

            <Form.Label>Customer Request</Form.Label>
            <Form.Control  as="textarea" disabled value={stateBookData.customerRequest}/>

            <Form.Label>Package</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.packageName}/>
            
            <Form.Label>Days Accommodated</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.daysAccommodated}/>

            <Form.Label>Day and Time</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.dayTime}/>

            <Form.Label>Check In Date</Form.Label>
            <Form.Control  type="text" disabled  value={stateBookData.checkIn}/>

            <Form.Label>Check Out Date</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.checkOut}/>

            <Form.Label>Package Amount</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.packageAmount}/>

            <Form.Label>Total Payment</Form.Label>
            <Form.Control  type="text" disabled  value={stateBookData.totalAmount}/>
          </div>
          <div className={cssBooking['modal-div-button']}>
          <Button onClick={() => {databaseUpdateReferenceStatus(stateBookData.packageID, stateBookData.customerID, stateBookData.reference, "CHECKED-IN")}}>CHECK IN</Button>
          </div>
        </Modal.Body>
      </Modal>
    }

    const bookCheckOut = () => {
      return <Modal 
      show={stateBookReference.checkOut}
      animation={true}  
      centered
      onHide={() =>{setStateBookReference({...stateBookReference, checkOut: false});}}>
        <Modal.Header closeButton className={cssBooking.modalHeader}>
          <div>
            <p>Customer Reservation</p>
            <p>Reservation Check Out</p>
            </div>
        </Modal.Header>

        <Modal.Body className={cssBooking['modal-body']}>
          <div>
            <h1>Reservation Check Out</h1>
          </div>
          <div className={cssBooking['modal-check-in']}>
            <Form.Label>Reservation Date and Time</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.reservationDateTime} />

            <Form.Label>Customer ID</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.customerID}/>

            <Form.Label>Customer Name</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.customerName}/>

            <Form.Label>Customer Request</Form.Label>
            <Form.Control  as="textarea" disabled value={stateBookData.customerRequest}/>

            <Form.Label>Package</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.packageName}/>
            
            <Form.Label>Days Accommodated</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.daysAccommodated}/>

            <Form.Label>Day and Time</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.dayTime}/>

            <Form.Label>Check In Date</Form.Label>
            <Form.Control  type="text" disabled  value={stateBookData.checkIn}/>

            <Form.Label>Check Out Date</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.checkOut}/>

            <Form.Label>Package Amount</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.packageAmount}/>

            <Form.Label>Total Payment</Form.Label>
            <Form.Control  type="text" disabled  value={stateBookData.totalAmount}/>
          </div>
          <div className={cssBooking['modal-div-button']}>
          <Button onClick={() => {databaseUpdateReferenceStatus(stateBookData.packageID, stateBookData.customerID, stateBookData.reference, "CHECKED-OUT")}}>CHECK OUT</Button>
          </div>
        </Modal.Body>
      </Modal>
    }

    const bookViewInfo = () => {
      return <Modal 
      show={stateBookReference.viewInfo}
      animation={true}  
      centered
      onHide={() =>{setStateBookReference({...stateBookReference, viewInfo: false});}}>
        <Modal.Header closeButton className={cssBooking.modalHeader}>
          <div>
            <p>Customer Reservation</p>
            <p>Reservation Information</p>
            </div>
        </Modal.Header>

        <Modal.Body className={cssBooking['modal-body']}>
          <div>
            <h1>Reservation Information</h1>
          </div>
          <div className={cssBooking['modal-check-in']}>
            <Form.Label>Reservation Date and Time</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.reservationDateTime} />

            <Form.Label>Customer ID</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.customerID}/>

            <Form.Label>Customer Name</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.customerName}/>

            <Form.Label>Customer Request</Form.Label>
            <Form.Control  as="textarea" disabled value={stateBookData.customerRequest}/>

            <Form.Label>Package</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.packageName}/>
            
            <Form.Label>Days Accommodated</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.daysAccommodated}/>

            <Form.Label>Day and Time</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.dayTime}/>

            <Form.Label>Check In Date</Form.Label>
            <Form.Control  type="text" disabled  value={stateBookData.checkIn}/>

            <Form.Label>Check Out Date</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.checkOut}/>

            <Form.Label>Package Amount</Form.Label>
            <Form.Control  type="text" disabled value={stateBookData.packageAmount}/>

            <Form.Label>Total Payment</Form.Label>
            <Form.Control  type="text" disabled  value={stateBookData.totalAmount}/>
          </div>
          <div className={cssBooking['modal-div-button']}>
            <Button onClick={() => {setStateBookReference({...stateBookReference, viewInfo: false});}}>OK</Button>
          </div>
        </Modal.Body>
      </Modal>
    }

    //Links component----------------------------------------------------------------------------
    const linkDashboard = () => {
      let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      });
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
                  <h1>{statePending}</h1>
                </div>
              </div>                   
            </div>

            <div className={css['checked-out']}>
            <span className="material-icons-sharp">done_all</span> 
              <div className={css.middle}>
                <div className={css.left}>
                  <h3>Customer Served</h3>
                  <h1>{stateCustomerServed}</h1>
                </div>
              </div>                   
            </div>

            <div className={css['total-income']}>
            <span className="material-icons-sharp">stacked_line_chart</span> 
              <div className={css.middle}>
                <div className={css.left}>
                  <h3>Total Income</h3>
                  <h1>{formatter.format(stateTotalIncome)}</h1>
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
                    stateRecentBooking.map((value, index) => 
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
      let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      });
      return(
        <main className={`${css.main} ${cssBooking.main}`}>
          <div className={css['dashboard-header']}>
              <div className={css['dashboard-title']}>
                <h1>Booking</h1>
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

          {/* -----------------Booking Status------------------ */}
          <div className={`${css.insights} ${cssBooking.insights}`}>
                <div className={css.pending}>
                  <div className={cssBooking.pending}>
                    <span className="material-icons-sharp">pending_actions</span> 
                    <div className={css.middle}>
                      <div className={css.left}>
                        <h3>Pending</h3>
                      </div>
                    </div>   
                  </div>
                  <h1>{stateBookPending}</h1>
                </div>

                <div className={css['checked-out']}>
                  <div className={cssBooking['checked-out']}>
                    <span className="material-icons-sharp">done_all</span> 
                    <div className={css.middle}>
                      <div className={css.left}>
                        <h3>Approved</h3>
                      </div>
                    </div>   
                  </div>   
                  <h1>{stateBookApproved}</h1>        
                </div>

                <div className={css['total-income']}>
                  <div className={cssBooking['total-income']}>
                  <span className="material-icons-sharp">event_available</span>
                      <div className={css.middle}>
                        <div className={css.left}>
                          <h3>Checked Out</h3>
                        </div>
                      </div>                   
                  </div>
                  <h1>{stateBookCheckOut}</h1>
                </div>
          </div>

          {/* ----------------NAVIGATION CARD-------------------------- */}
          <div className={cssBooking['nav-card']}>
            <div>
              <h3>Total Income</h3>
              <h2>{formatter.format(stateBookIncome)}</h2>
            </div>
            <div>
              <h3>Filter By Date</h3>
              <Form.Control ref={bookFilterDate} type="date" onChange={() => {BookFilter("date")}} value={stateRefFilterDate} />
            </div>
            <div>
              <h3>Filter By Month</h3>
              {getSelectMonth()}
            </div>
            <div>
              <h3>Clear Filter</h3>
              <Button variant="outline-danger" onClick={() => {BookFilter("clear")}}>Clear</Button>
            </div>
          </div>

          {/* -------------------Booking Table--------------------------------- */}
          <div className={cssBooking['booking-table']}>
            {bookingTable()}
          </div>
        </main>
      );
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
                <div className={cssBooking.aside}>
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
                    <a onClick={()=> changeTab("dashboard")} className={linkActive == "dashboard" ? css.active : ""}>
                      <span className="material-icons-sharp">grid_view</span>
                      <h3>Dashboard</h3>
                    </a>

                    <a onClick={()=> changeTab("booking")} className={linkActive == "booking" ? css.active : ""}>
                      <span className="material-icons-sharp">book_online</span>
                      <h3>Booking</h3>
                    </a>

                    <a onClick={()=> changeTab("package")} className={linkActive == "package" ? css.active : ""}>
                      <span className="material-icons-sharp">inventory_2</span>
                      <h3>Package</h3>
                    </a>

                    <a onClick={()=> changeTab("settings")} className={linkActive == "settings" ? css.active : ""}>
                      <span className="material-icons-sharp">settings</span>
                      <h3>Settings</h3>
                    </a>

                    <a onClick={()=> changeTab("account")} className={linkActive == "account" ? css.active : ""}>
                      <span className="material-icons-sharp">manage_accounts</span>
                      <h3>Manager Account</h3>
                    </a>

                    <a onClick={LogOut}>
                      <span className="material-icons-sharp">logout</span>
                      <h3>Logout</h3>
                    </a>
                  </div>
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
      {bookApproved()}
      {bookCheckIn()}
      {bookCheckOut()}
      {bookViewInfo()}
      </>
    );
}