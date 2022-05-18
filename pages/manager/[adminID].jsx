import { useRouter } from "next/router";
import cookie from "cookie";
import css from "../../styles/Pages/manager.module.css";
import cssBooking from "../../styles/Pages/booking.module.css";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { database } from "../../firebase/firebaseConfig";
import { ref, child, get, onValue, set } from "firebase/database";
import QRCode from "qrcode.react";
import {
  getReservation,
  updateReferenceStatus,
  updateHotelPackage,
  updateCover,
  updateRoom1,
  updateRoom2,
  updateHotelInfo
} from "../../redux/reduxSlice/hotelSlice";
import { updateManagerAccount } from "../../redux/reduxSlice/userSlice";
import { Form, Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export async function getServerSideProps({ req, res }) {
  const mycookie = cookie.parse((req && req.headers.cookie) || "");
  const type = mycookie.type;
  const id = mycookie.id;
  const databaseRef = ref(database);
  const reservationPath = `PACKAGE-RESERVATION/${id}`;
  let reservation = {};

  if (type != undefined && type != "manager") {
    if (type == "user") {
      return {
        redirect: {
          destination: `/${type}`,
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: `${type}/${id}`,
          permanent: false,
        },
      };
    }
  }
  if (type == undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  await get(child(databaseRef, reservationPath))
  .then((snapshot) => {
      snapshot.exists() ? reservation = { ...snapshot.val() } : null;
  })
  .catch((err) => {
      console.log(err);
  });

  return {
    props: { reservation },
  };
}
// export async function getStaticPaths({ req, res }) {
//  return {
//    paths: [],
//    fallback: false,
//  }
// }

export default function Manager({ reservation }) {
  //import variables-------------------------------------------------------------------------
  const dispatch = useDispatch();
  const router = useRouter();
  const { adminID } = router.query;
  const mySwal = withReactContent(Swal);

  //redux state------------------------------------------------------------------------------
  const stateManager = useSelector(
    (state) => state.storeUsers.hotelManagerAcct
  );
  const stateHotel = useSelector((state) => state.storeHotel.hotelList);
  const stateReservation = useSelector((state) => state.storeHotel.reservation);
  const managerName = `${stateManager[`${adminID}`].FIRSTNAME} ${
    stateManager[`${adminID}`].LASTNAME
  }`;
  const hotelName = stateHotel[`${adminID}`]["HOTEL-NAME"];

  //state UI----------------------------------------------------------------------------------
  const [linkActive, setLinkActive] = useState("dashboard");
  const [stateRecentBooking, setStateRecentBooking] = useState([]);
  const [stateAllBooking, setStateAllBooking] = useState([]);
  const [stateAllPackage, setStateAllPackage] = useState([]);
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
  const [stateRefPackageSearch, setStateRefPackageSearch] = useState("");
  const [stateBookData, setStateBookData] = useState({});
  const [stateBookReference, setStateBookReference] = useState({});
  const [statePackageModal, setStatePackageModal] = useState({});
  const [statePackageError, setStatePackageError] = useState({
    name: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
    description: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
    amount: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
  });
  const [stateSettingsError, setStateSettingsError] = useState({
    name: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
    location: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
    description: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
    rooms: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
    cover: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
    room1: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
    room2: {
      isInvalid: false,
      isValid: false,
      error: "",
    },
  });
  const [stateAccountError, setStateAccountError] = useState({
    firstname:{
      isInvalid: false,
      isValid: false,
      error: "",
    },
    middlename:{
      isInvalid: false,
      isValid: false,
      error: "",
    },
    lastname:{
      isInvalid: false,
      isValid: false,
      error: "",
    },
    username:{
      isInvalid: false,
      isValid: false,
      error: "",
    },
    password:{
      isInvalid: false,
      isValid: false,
      error: "",
    }
  });
  const [statePackageData, setStatePackageData] = useState({});
  const [stateSettingsData, setStateSettingsData] = useState({});
  const [stateAccountData, setStateAccountData] = useState({});
  const [stateResortCover, setStateResortCover] = useState("");
  const [stateResortGallery1, setStateResortGallery1] = useState("");
  const [stateResortGallery2, setStateResortGallery2] = useState("");

  //useRef Hooks variables----------------------------------------------------------------------
  const bookFilterDate = useRef();
  const bookFilterMonth = useRef();
  const bookSearch = useRef();
  const packageSearch = useRef();
  const packageName = useRef();
  const packageDescription = useRef();
  const packageAmount = useRef();
  const packageID = useRef();
  const resortID = useRef();
  const resortName = useRef();
  const resortLocation = useRef();
  const resortDescription = useRef();
  const resortRooms = useRef();
  const resortCover = useRef();
  const resortRoomGallery1 = useRef();
  const resortRoomGallery2 = useRef();
  const accountID = useRef();
  const accountFirstname = useRef();
  const accountMiddlename = useRef();
  const accountLastname = useRef();
  const accountUsername = useRef();
  const accountPassword = useRef();

  //function Resrvation Get and Update Data-----------------------------------------------------
  const ReservationData = () => {
    let recentBookingCounter = 0;
    let totalIncome = 0;
    let recentBookingData = [];
    let allBooking = [];
    let totalPending = 0;
    let totalCustomerServed = 0;
    let totalApproved = 0;
    let allPackage = [];
    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });

    Object.values(stateReservation).forEach((valPackage) => {
      Object.values(valPackage).forEach((valReference) => {
        Object.values(valReference).forEach((value) => {
          let customerName = value["USER-FULL NAME"];
          let dateCheckIn = value["DATE-CHECK IN"];
          let dateCheckOut = value["DATE-CHECK OUT"];
          let packageName = value["PACKAGE-NAME"];
          let payment = value["PACKAGE-AMOUNT TOTAL"];
          let status = value["REFERENCE STATUS"];
          let dateReserved = value["USER-DATE OF RESERVATION"].substring(0, 10);
          let totalAmount = value["PACKAGE-RAW-AMOUNT TOTAL"];
          let reference = value["REFERENCE NUMBER"];
          let packageID = value["PACKAGE-ID"];
          let userID = value["USER-USER ID"];

          switch (status) {
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
            userID: userID,
          });

          if (dateReserved == getDateToday() && status == "PENDING") {
            recentBookingCounter <= 5
              ? recentBookingData.push({
                  customerName: customerName,
                  dateCheckIn: dateCheckIn,
                  dateCheckOut: dateCheckOut,
                  packageName: packageName,
                  payment: payment,
                  status: status,
                })
              : null;
          }
        });
      });
    });

    stateHotel[adminID]["VIEW-PACKAGE"] != undefined
      ? Object.values(stateHotel[adminID]["VIEW-PACKAGE"]).forEach((value) => {
          allPackage.push({
            id: value["ID"],
            name: value["PACKAGE NAME"],
            description: value["DESCRIPTION"],
            amount: formatter.format(value["AMOUNT"]),
            amountData: value["AMOUNT"],
          });
        })
      : null;

    Object.values(stateHotel).forEach((value) => {
      if (adminID == value["HOTEL-REFERENCE NUMBER"]) {
        setStateSettingsData({
          id: value["HOTEL-REFERENCE NUMBER"],
          name: value["HOTEL-NAME"],
          location: value["HOTEL-LOCATION"],
          description: value["HOTEL-DESCRIPTION"],
          rooms: value["ROOMS"],
        });
        setStateResortCover(`data:image/jpeg;base64,${value["HOTEL-COVER"]}`);
        value["VIEW-ROOM GALLERY"]["ROOM-01"] != "N/A"
          ? setStateResortGallery1(
              `data:image/jpeg;base64,${value["VIEW-ROOM GALLERY"]["ROOM-01"]}`
            )
          : setStateResortGallery1("");
        value["VIEW-ROOM GALLERY"]["ROOM-02"] != "N/A"
          ? setStateResortGallery2(
              `data:image/jpeg;base64,${value["VIEW-ROOM GALLERY"]["ROOM-02"]}`
            )
          : setStateResortGallery2("");
      }
    });
    
    Object.values(stateManager).forEach((value) => {
      value['ID'] == adminID ? 
      setStateAccountData({
        id: value['ID'],
        firstname: value['FIRSTNAME'],
        middlename: value['MIDDLENAME'],
        lastname: value['LASTNAME'],
        username: value['USERNAME'],
        password: value['PASSWORD']
      }) : null;
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
    setStateAllPackage(allPackage);
  };

  //REACT HOOKS-------------------------------------------------------------------------
  useEffect(async () => {
    await dispatch(getReservation({ ...reservation }));
    ReservationData();
  }, []);

  useEffect(() => {
    ReservationData();
  }, [stateReservation, stateHotel]);

  //function for logout-----------------------------------------------------------------------
  const LogOut = () => {
    fetch("/api/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    });
    router.replace("/");
  };

  //function get date today--------------------------------------------------------------------
  const getDateToday = () => {
    let date = new Date();
    let month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    let year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  //function select tag for month-------------------------------------------------------------
  const getSelectMonth = () => {
    let month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return (
      <Form.Select
        ref={bookFilterMonth}
        type="select"
        onChange={() => {
          BookFilter("month");
        }}
        value={stateRefFilterMonth}
      >
        <option value="" hidden>
          Select Month
        </option>
        {month.map((value, index) => {
          return (
            <option key={index} value={index}>
              {value}
            </option>
          );
        })}
      </Form.Select>
    );
  };

  //function booking filter by date-----------------------------------------------------------
  const BookFilter = (filter) => {
    let search = bookSearch.current.value;
    let date = bookFilterDate.current.value;
    let month = parseInt(bookFilterMonth.current.value) + 1;
    month = month < 10 ? `0${month}` : month.toString();
    date = `${date.substring(5, 7)}-${date.substring(8)}-${date.substring(
      0,
      4
    )}`;

    let pending = 0;
    let approved = 0;
    let checkOut = 0;
    let totalIncome = 0;
    let allBooking = [];

    const changeData = (
      totalAmount,
      status,
      customerName,
      dateCheckIn,
      dateCheckOut,
      packageName,
      reference,
      packageID,
      userID
    ) => {
      switch (status) {
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
        userID: userID,
      });
    };

    Object.values(stateReservation).forEach((valPackage) => {
      Object.values(valPackage).forEach((valReference) => {
        Object.values(valReference).forEach((value) => {
          let dataDate = value["USER-DATE OF RESERVATION"].substring(0, 10);
          let totalAmount = value["PACKAGE-RAW-AMOUNT TOTAL"];
          let status = value["REFERENCE STATUS"];
          let customerName = value["USER-FULL NAME"];
          let dateCheckIn = value["DATE-CHECK IN"];
          let dateCheckOut = value["DATE-CHECK OUT"];
          let packageName = value["PACKAGE-NAME"];
          let reference = value["REFERENCE NUMBER"];
          let packageID = value["PACKAGE-ID"];
          let userID = value["USER-USER ID"];

          switch (filter) {
            case "date":
              setStateRefFilterDate(bookFilterDate.current.value);
              setStateRefFilterMonth("");
              setStateRefBookSearch("");
              dataDate == date
                ? changeData(
                    totalAmount,
                    status,
                    customerName,
                    dateCheckIn,
                    dateCheckOut,
                    packageName,
                    reference,
                    packageID,
                    userID
                  )
                : null;
              break;

            case "month":
              setStateRefFilterMonth(bookFilterMonth.current.value);
              setStateRefFilterDate("");
              setStateRefBookSearch("");
              dataDate.substring(0, 2) == month
                ? changeData(
                    totalAmount,
                    status,
                    customerName,
                    dateCheckIn,
                    dateCheckOut,
                    packageName,
                    reference,
                    packageID,
                    userID
                  )
                : null;
              break;

            case "clear":
              setStateRefFilterDate("");
              setStateRefFilterMonth("");
              setStateRefBookSearch("");
              changeData(
                totalAmount,
                status,
                customerName,
                dateCheckIn,
                dateCheckOut,
                packageName,
                reference,
                packageID,
                userID
              );
              break;

            case "search":
              setStateRefFilterDate("");
              setStateRefFilterMonth("");
              setStateRefBookSearch(search);
              customerName.toLowerCase().search(search.toLowerCase()) != -1 ||
              dateCheckIn.toLowerCase().search(search.toLowerCase()) != -1 ||
              dateCheckOut.toLowerCase().search(search.toLowerCase()) != -1 ||
              packageName.toLowerCase().search(search.toLowerCase()) != -1 ||
              status.toLowerCase().search(search.toLowerCase()) != -1
                ? changeData(
                    totalAmount,
                    status,
                    customerName,
                    dateCheckIn,
                    dateCheckOut,
                    packageName,
                    reference,
                    packageID,
                    userID
                  )
                : search == ""
                ? changeData(
                    totalAmount,
                    status,
                    customerName,
                    dateCheckIn,
                    dateCheckOut,
                    packageName,
                    reference,
                    packageID,
                    userID
                  )
                : null;
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
  };

  //function change Tab---------------------------------------------------------------
  const changeTab = (tab) => {
    ReservationData();
    setStateRefFilterDate("");
    setStateRefFilterMonth("");
    setStateRefBookSearch("");
    setStateRefPackageSearch("");
    setStateBookReference({});
    setStatePackageModal({});
    setStatePackageError({
      name: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
      description: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
      amount: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
    });
    setStatePackageData({});
    setStateSettingsError({
      name: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
      location: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
      description: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
      rooms: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
      cover: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
      room1: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
      room2: {
        isInvalid: false,
        isValid: false,
        error: "",
      },
    });
    setStateAccountError({
      firstname:{
        isInvalid: false,
        isValid: false,
        error: "",
      },
      middlename:{
        isInvalid: false,
        isValid: false,
        error: "",
      },
      lastname:{
        isInvalid: false,
        isValid: false,
        error: "",
      },
      username:{
        isInvalid: false,
        isValid: false,
        error: "",
      },
      password:{
        isInvalid: false,
        isValid: false,
        error: "",
      }
    });
    switch (tab) {
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
    const referenceStatus = ref(
      database,
      `PACKAGE-RESERVATION/${adminID}/${packageID}/${userID}/${reference}/REFERENCE STATUS`
    );
    onValue(referenceStatus, (snapshot) => {
      const data = snapshot.val();
      if (data == "APPROVED") {
        setStateBookReference({
          ...stateBookReference,
          approved: false,
          checkIn: true,
        });
        dispatch(
          updateReferenceStatus([
            packageID,
            userID,
            reference,
            "REFERENCE STATUS",
            "APPROVED",
          ])
        );
        bookData(reference);
      }
    });
  };

  //function get customer booking data---------------------------------------------------------------
  const bookData = (reference) => {
    Object.values(stateReservation).forEach((valPackage) => {
      Object.values(valPackage).forEach((valReference) => {
        Object.values(valReference).forEach((value) => {
          let valReference = value["REFERENCE NUMBER"];
          if (valReference == reference) {
            setStateBookData({
              reservationDateTime: value["USER-DATE OF RESERVATION"],
              customerID: value["USER-USER ID"],
              customerName: value["USER-FULL NAME"],
              packageName: value["PACKAGE-NAME"],
              customerRequest: value["PACKAGE-USER REQUEST"],
              daysAccommodated: value["DATE-DAYS ACCOMMODATED"],
              dayTime: value["DATE-DAY TIME"],
              checkIn: value["DATE-CHECK IN"],
              checkOut: value["DATE-CHECK OUT"],
              packageAmount: value["PACKAGE-AMOUNT"],
              totalAmount: value["PACKAGE-AMOUNT TOTAL"],
              reference: value["REFERENCE NUMBER"],
              packageID: value["PACKAGE-ID"],
            });
          }
        });
      });
    });
  };

  //function sweet alert-----------------------------------------------------------------------------
  const sweetAlert = (msg) => {
    mySwal.fire({
      icon: "success",
      title: <p className={cssBooking.swalText}>{msg}</p>,
      customClass: {
        confirmButton: `${cssBooking.swalButton}`,
      },
    });
  };

  //function update reference status----------------------------------------------------------------
  const databaseUpdateReferenceStatus = (
    packageID,
    userID,
    reference,
    status
  ) => {
    const referenceStatus = ref(
      database,
      `PACKAGE-RESERVATION/${adminID}/${packageID}/${userID}/${reference}/REFERENCE STATUS`
    );
    set(referenceStatus, `${status}`)
      .then(() => {
        if (status == "CHECKED-IN") {
          dispatch(
            updateReferenceStatus([
              packageID,
              userID,
              reference,
              "REFERENCE STATUS",
              "CHECKED-IN",
            ])
          );
          setStateBookReference({ ...stateBookReference, checkIn: false });
          sweetAlert("Customer Reservation Successfully Check In");
        } else {
          dispatch(
            updateReferenceStatus([
              packageID,
              userID,
              reference,
              "REFERENCE STATUS",
              "CHECKED-OUT",
            ])
          );
          setStateBookReference({ ...stateBookReference, checkOut: false });
          sweetAlert("Customer Reservation Successfully Check Out");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //function package search filter-----------------------------------------------------------
  const packageFilter = () => {
    let search = packageSearch.current.value;
    let allPackage = [];
    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });
    setStateRefPackageSearch(search);

    Object.values(stateHotel[adminID]["VIEW-PACKAGE"]).forEach((value) => {
      let id = value["ID"];
      let name = value["PACKAGE NAME"];
      let description = value["DESCRIPTION"];
      let amount = value["AMOUNT"];

      id.toLowerCase().search(search.toLowerCase()) != -1 ||
      name.toLowerCase().search(search.toLowerCase()) != -1 ||
      description.toLowerCase().search(search.toLowerCase()) != -1 ||
      amount.toString().toLowerCase().search(search.toLowerCase()) != -1
        ? allPackage.push({
            id: id,
            name: name,
            description: description,
            amount: formatter.format(amount),
          })
        : null;
    });
    setStateAllPackage(allPackage);
  };

  const addPackage = (btn, id, name, description, amount) => {
    setStatePackageModal({ ...statePackageModal, add: true });
    let packageID = `PACKAGE-${stateAllPackage.length + 1}`;
    btn == "add"
      ? setStatePackageData({ id: packageID })
      : setStatePackageData({
          id: id,
          name: name,
          description: description,
          amount: amount,
        });
  };

  const updateErrorPackage = (error, invalid, valid, input) => {
    setStatePackageError((statePackageError) => ({
      ...statePackageError,
      [input]: {
        isValid: valid,
        isInvalid: invalid,
        error: error,
      },
    }));
  };

  const onChangePackage = (input) => {
    setStatePackageData({});
    switch (input) {
      case "name":
        let name = packageName.current.value;
        name == ""
          ? updateErrorPackage("", false, false, "name")
          : updateErrorPackage("", false, true, "name");
        break;

      case "description":
        let description = packageDescription.current.value;
        description == ""
          ? updateErrorPackage("", false, false, "description")
          : updateErrorPackage("", false, true, "description");
        break;

      case "amount":
        let amount = packageAmount.current.value;
        amount == ""
          ? updateErrorPackage("", false, false, "amount")
          : updateErrorPackage("", false, true, "amount");
        break;
    }
  };

  const createPackage = () => {
    let id = packageID.current.value;
    let name = packageName.current.value;
    let description = packageDescription.current.value;
    let amount = packageAmount.current.value;

    if (name == "") {
      updateErrorPackage("Enter Package Name", true, false, "name");
      packageName.current.focus();
    } else if (description == "") {
      updateErrorPackage(
        "Enter Package Description",
        true,
        false,
        "description"
      );
      packageDescription.current.focus();
    } else if (amount == "") {
      updateErrorPackage("Enter Package Amount", true, false, "amount");
      packageAmount.current.focus();
    } else {
      const databaseRef = ref(
        database,
        `HOTEL-RESERVATION-SYSTEM/HOTELS/${adminID}/VIEW-PACKAGE/${id}`
      );
      set(databaseRef, {
        AMOUNT: parseFloat(amount),
        DESCRIPTION: description,
        ID: id,
        "PACKAGE NAME": name,
      })
        .then(() => {
          dispatch(
            updateHotelPackage([
              adminID,
              "VIEW-PACKAGE",
              id,
              {
                AMOUNT: parseFloat(amount),
                DESCRIPTION: description,
                ID: id,
                "PACKAGE NAME": name,
              },
            ])
          );
          setStatePackageModal({ ...statePackageModal, add: false });
          sweetAlert("Resort Package Successfully Saved");
          setStatePackageError({
            name: {
              isInvalid: false,
              isValid: false,
              error: "",
            },
            description: {
              isInvalid: false,
              isValid: false,
              error: "",
            },
            amount: {
              isInvalid: false,
              isValid: false,
              error: "",
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const updateErrorSettings = (error, invalid, valid, input) => {
    setStateSettingsError((stateSettingsError) => ({
      ...stateSettingsError,
      [input]: {
        isValid: valid,
        isInvalid: invalid,
        error: error,
      },
    }));
  };

  const onChangeSettings = (input) => {
    setStateSettingsData({});
    switch (input) {
      case "name":
        let name = resortName.current.value;
        name == ""
          ? updateErrorSettings("", false, false, "name")
          : updateErrorSettings("", false, true, "name");
        break;

      case "location":
        let location = resortLocation.current.value;
        location == ""
          ? updateErrorSettings("", false, false, "location")
          : updateErrorSettings("", false, true, "location");
        break;

      case "description":
        let description = resortDescription.current.value;
        description == ""
          ? updateErrorSettings("", false, false, "description")
          : updateErrorSettings("", false, true, "description");
        break;

      case "rooms":
        let rooms = resortRooms.current.value;
        rooms == ""
          ? updateErrorSettings("", false, false, "rooms")
          : updateErrorSettings("", false, true, "rooms");
        break;

      case "cover":
        let Cover = resortCover.current.value;
        Cover != ""
          ? setStateResortCover(
              URL.createObjectURL(resortCover.current.files[0])
            )
          : setStateResortCover("");
        Cover != ""
          ? updateErrorSettings("", false, true, "cover")
          : updateErrorSettings("", false, false, "cover");
        break;

      case "room1":
        let roomGallery1 = resortRoomGallery1.current.value;
        roomGallery1 != ""
          ? setStateResortGallery1(
              URL.createObjectURL(resortRoomGallery1.current.files[0])
            )
          : setStateResortGallery1("");
        roomGallery1 != ""
          ? updateErrorSettings("", false, true, "room1")
          : updateErrorSettings("", false, false, "room1");
        break;

      case "room2":
        let roomGallery2 = resortRoomGallery2.current.value;
        roomGallery2 != ""
          ? setStateResortGallery2(
              URL.createObjectURL(resortRoomGallery2.current.files[0])
            )
          : setStateResortGallery2("");
        roomGallery2 != ""
          ? updateErrorSettings("", false, true, "room2")
          : updateErrorSettings("", false, false, "room2");
        break;
    }
  };

  const updateErrorAccount = (error, invalid, valid, input) => {
    setStateSettingsError((stateSettingsError) => ({
      ...stateSettingsError,
      [input]: {
        isValid: valid,
        isInvalid: invalid,
        error: error,
      },
    }));
  };
  
  const updateSettings = (e) => {
    e.preventDefault();
    let name = resortName.current.value;
    let location = resortLocation.current.value;
    let description = resortDescription.current.value;
    let rooms = resortRooms.current.value;
    let cover = resortCover.current.value;
    let room1 = resortRoomGallery1.current.value;
    let room2 = resortRoomGallery2.current.value;

    if (name == "") {
      updateErrorSettings("Enter Resort Name", true, false, "name");
      resortID.current.focus();
    } else if (location == "") {
      updateErrorSettings("Enter Resort Location", true, false, "location");
      resortLocation.current.focus();
    } else if (description == "") {
      updateErrorSettings("Enter Resort Location", true, false, "description");
      resortDescription.current.focus();
    } else if (rooms == "") {
      updateErrorSettings("Enter Number of Resort Rooms", true, false, "rooms");
      resortRooms.current.focus();
    } else {
      const coverRef = ref(
        database,
        `HOTEL-RESERVATION-SYSTEM/HOTELS/${adminID}/HOTEL-COVER`
      );
      const room1Ref = ref(
        database,
        `HOTEL-RESERVATION-SYSTEM/HOTELS/${adminID}/VIEW-ROOM GALLERY/ROOM-01`
      );
      const room2Ref = ref(
        database,
        `HOTEL-RESERVATION-SYSTEM/HOTELS/${adminID}/VIEW-ROOM GALLERY/ROOM-02`
      );

      if (cover != "") {
        try {
          let file = resortCover.current.files[0];
          let imageFiletype = `data:${file.type};base64,`;
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            set(coverRef, reader.result.substring(imageFiletype.length))
              .then(() => {
                dispatch(
                  updateCover([
                    `${adminID}`,
                    reader.result.substring(imageFiletype.length),
                  ])
                );
              })
              .catch((error) => {
                console.log(error);
              });
          };
        } catch (error) {
          console.log(error);
        }
      }

      if (room1 != "") {
        try {
          let file1 = resortRoomGallery1.current.files[0];
          let imageFiletype1 = `data:${file1.type};base64,`;
          const reader1 = new FileReader();
          reader1.readAsDataURL(file1);
          reader1.onload = () => {
            set(room1Ref, reader1.result.substring(imageFiletype1.length))
              .then(() => {
                dispatch(
                  updateRoom1([
                    `${adminID}`,
                    reader1.result.substring(imageFiletype1.length),
                  ])
                );
              })
              .catch((error) => {
                console.log(error);
              });
          };
        } catch (error) {
          console.log(error);
        }
      }

      if (room2 != "") {
        try {
          let file2 = resortRoomGallery2.current.files[0];
          let imageFiletype2 = `data:${file2.type};base64,`;
          const reader2 = new FileReader();
          reader2.readAsDataURL(file2);
          reader2.onload = () => {
            set(room2Ref, reader2.result.substring(imageFiletype2.length))
              .then(() => {
                dispatch(
                  updateRoom2([
                    `${adminID}`,
                    reader2.result.substring(imageFiletype2.length),
                  ])
                );
              })
              .catch((error) => {
                console.log(error);
              });
          };
        } catch (error) {
          console.log(error);
        }
      }

      set(
        ref(
          database,
          `HOTEL-RESERVATION-SYSTEM/HOTELS/${adminID}/HOTEL-DESCRIPTION`
        ),
        description
      );
      set(
        ref(
          database,
          `HOTEL-RESERVATION-SYSTEM/HOTELS/${adminID}/HOTEL-LOCATION`
        ),
        location
      );
      set(
        ref(database, `HOTEL-RESERVATION-SYSTEM/HOTELS/${adminID}/HOTEL-NAME`),
        name
      );
      set(
        ref(database, `HOTEL-RESERVATION-SYSTEM/HOTELS/${adminID}/ROOMS`),
        rooms
      )
        .then(() => {
            dispatch(updateHotelInfo([`${adminID}`, description, location, name, rooms]));
            sweetAlert("Resort Information Successfully Updated");
            setStateSettingsError({
              name: {
                isInvalid: false,
                isValid: false,
                error: "",
              },
              location: {
                isInvalid: false,
                isValid: false,
                error: "",
              },
              description: {
                isInvalid: false,
                isValid: false,
                error: "",
              },
              rooms: {
                isInvalid: false,
                isValid: false,
                error: "",
              },
              cover: {
                isInvalid: false,
                isValid: false,
                error: "",
              },
              room1: {
                isInvalid: false,
                isValid: false,
                error: "",
              },
              room2: {
                isInvalid: false,
                isValid: false,
                error: "",
              }
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onChangeAccount = (input) => {
    setStateAccountData({});
    switch(input){
      case "firstname": 
      let firstname = accountFirstname.current.value;
      firstname == ""
        ? updateErrorAccount("", false, false, "firstname")
        : updateErrorAccount("", false, true, "firstname");
      break;

      case "middlename": 
      let middlename = accountMiddlename.current.value;
      middlename == ""
        ? updateErrorAccount("", false, false, "middlename")
        : updateErrorAccount("", false, true, "middlename");
      break;

      case "lastname": 
      let lastname = accountLastname.current.value;
      lastname == ""
        ? updateErrorAccount("", false, false, "lastname")
        : updateErrorAccount("", false, true, "lastname");
      break;

      case "username": 
      let username = accountUsername.current.value;
      username == ""
        ? updateErrorAccount("", false, false, "username")
        : updateErrorAccount("", false, true, "username");
      break;

      case "password": 
      let password = accountPassword.current.value;
      password == ""
        ? updateErrorAccount("", false, false, "password")
        : updateErrorAccount("", false, true, "password");
      break;
    }
  }

  const updateAccount = (e) => {
    e.preventDefault();
    let firstname = accountFirstname.current.value;
    let middlename = accountMiddlename.current.value;
    let lastname = accountLastname.current.value;
    let username = accountUsername.current.value;
    let password = accountPassword.current.value;

    if (firstname == "") {
      updateErrorAccount("Enter First Name", true, false, "firstname");
      accountID.current.focus();
    }
    else if(lastname == ""){
      updateErrorAccount("Enter Last Name", true, false, "lastname");
      accountLastname.current.focus();
    }
    else if(username == ""){
      updateErrorAccount("Enter Username", true, false, "username");
      accountUsername.current.focus();
    }
    else if(password == ""){
      updateErrorAccount("Enter Password", true, false, "password");
      accountPassword.current.focus();
    }
    else{
      const databaseRef = ref(database,`ADMIN/HOTEL-MANAGER/${adminID}`);
      set(databaseRef,{
        "FIRSTNAME": firstname,
        "MIDDLENAME": middlename,
        "LASTNAME": lastname,
        "USERNAME": username,
        "PASSWORD": password,
        "ID": adminID
      })
      .then(() => {
        dispatch(updateManagerAccount([`${adminID}`, firstname, middlename, lastname, username, password]));
        sweetAlert("Manager Account Successfully Updated");
        setStateAccountError({
          firstname:{
            isInvalid: false,
            isValid: false,
            error: "",
          },
          middlename:{
            isInvalid: false,
            isValid: false,
            error: "",
          },
          lastname:{
            isInvalid: false,
            isValid: false,
            error: "",
          },
          username:{
            isInvalid: false,
            isValid: false,
            error: "",
          },
          password:{
            isInvalid: false,
            isValid: false,
            error: "",
          }
        });
      })
      .catch((error) => {console.log(error);});
    }
  }

  //function component-----------------------------------------------------------------------
  const bookingTable = () => {
    let headers = [
      { label: "Customer Name", key: "customerName" },
      { label: "Date Check In", key: "dateCheckIn" },
      { label: "Date Check Out", key: "dateCheckOut" },
      { label: "Package", key: "packageName" },
      { label: "Status", key: "status" },
    ];
    const columns = [
      {
        name: "Customer Name",
        selector: (row) => row.customerName,
        sortable: true,
        id: "columnName-1",
        style: {
          "font-family": "poppins, sans-serif",
          "font-size": "0.8rem",
          "text-align": "center",
          "justify-content": "center",
        },
      },
      {
        name: "Date Check In",
        selector: (row) => row.dateCheckIn,
        id: "columnName-2",
        style: {
          "font-family": "poppins, sans-serif",
          "font-size": "0.8rem",
          "text-align": "center",
          "justify-content": "center",
        },
      },
      {
        name: "Date Check Out",
        selector: (row) => row.dateCheckOut,
        id: "columnName-3",
        style: {
          "font-family": "poppins, sans-serif",
          "font-size": "0.8rem",
          "text-align": "center",
          "justify-content": "center",
        },
      },
      {
        name: "Package",
        selector: (row) => row.packageName,
        id: "columnName-4",
        style: {
          "font-family": "poppins, sans-serif",
          "font-size": "0.8rem",
          "text-align": "center",
          "justify-content": "center",
        },
      },
      {
        name: "Status",
        cell: (row) => {
          switch (row.status) {
            case "PENDING":
              return <p className={cssBooking["pending"]}>{row.status}</p>;
              break;

            case "APPROVED":
              return <p className={cssBooking["approved"]}>{row.status}</p>;
              break;

            case "CHECKED-IN":
              return <p className={cssBooking["checked-in"]}>{row.status}</p>;
              break;

            case "CHECKED-OUT":
              return <p className={cssBooking["checked-out"]}>{row.status}</p>;
              break;
          }
        },
        id: "columnName-5",
        style: {
          "text-align": "center",
          "justify-content": "center",
          "align-items": "center",
        },
      },
      {
        name: "Action",
        cell: (row) => {
          switch (row.status) {
            case "PENDING":
              return (
                <div className={cssBooking["control-header"]}>
                  <Button
                    variant="info"
                    onClick={() => {
                      setStateBookReference({
                        ref: row.reference,
                        packageID: row.packageID,
                        userID: row.userID,
                        approved: true,
                        checkIn: false,
                        checkOut: false,
                        viewInfo: false,
                      });
                      referenceStatusUpdate(
                        row.packageID,
                        row.userID,
                        row.reference
                      );
                    }}
                  >
                    Approved
                  </Button>
                </div>
              );
              break;

            case "APPROVED":
              return (
                <div className={cssBooking["control-header"]}>
                  <Button
                    variant="info"
                    onClick={() => {
                      setStateBookReference({
                        ref: row.reference,
                        packageID: row.packageID,
                        userID: row.userID,
                        approved: false,
                        checkIn: true,
                        checkOut: false,
                        viewInfo: false,
                      });
                      bookData(row.reference);
                    }}
                  >
                    Check In
                  </Button>
                </div>
              );
              break;

            case "CHECKED-IN":
              return (
                <div className={cssBooking["control-header"]}>
                  <Button
                    variant="info"
                    onClick={() => {
                      setStateBookReference({
                        ref: row.reference,
                        packageID: row.packageID,
                        userID: row.userID,
                        approved: false,
                        checkIn: false,
                        checkOut: true,
                        viewInfo: false,
                      });
                    }}
                  >
                    Check Out
                  </Button>
                </div>
              );
              break;

            case "CHECKED-OUT":
              return (
                <div className={cssBooking["control-header"]}>
                  <Button
                    variant="info"
                    onClick={() => {
                      setStateBookReference({
                        ref: row.reference,
                        packageID: row.packageID,
                        userID: row.userID,
                        approved: false,
                        checkIn: false,
                        checkOut: false,
                        viewInfo: true,
                      });
                    }}
                  >
                    View Info
                  </Button>
                </div>
              );
              break;
          }
        },
        id: "columnName-6",
        style: {
          "justify-content": "center",
        },
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={stateAllBooking}
        pagination
        fixedHeader
        highlightOnHover
        actions={
          <Button variant="success">
            <CSVLink
              data={stateAllBooking}
              headers={headers}
              filename={"BookingReport.csv"}
              className={cssBooking["booking-report-download"]}
            >
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
            <Form.Control
              type="text"
              placeholder="Search"
              ref={bookSearch}
              onChange={() => {
                BookFilter("search");
              }}
              value={stateRefBookSearch}
            />
          </>
        }
      />
    );
  };

  const bookApproved = () => {
    return (
      <Modal
        show={stateBookReference.approved}
        animation={true}
        centered
        onHide={() => {
          setStateBookReference({ ...stateBookReference, approved: false });
        }}
      >
        <Modal.Header closeButton className={cssBooking.modalHeader}>
          <div>
            <p>Customer Reservation</p>
            <p>Reservation Qrcode Reference</p>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className={cssBooking.qrcode}>
            <QRCode
              value={stateBookReference.ref}
              size="128"
              imageSettings={{
                src: "/logo/logo.png",
                x: null,
                y: null,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const bookCheckIn = () => {
    return (
      <Modal
        show={stateBookReference.checkIn}
        animation={true}
        centered
        onHide={() => {
          setStateBookReference({ ...stateBookReference, checkIn: false });
        }}
      >
        <Modal.Header closeButton className={cssBooking.modalHeader}>
          <div>
            <p>Customer Reservation</p>
            <p>Reservation Check In</p>
          </div>
        </Modal.Header>

        <Modal.Body className={cssBooking["modal-body"]}>
          <div>
            <h1>Reservation Check In</h1>
          </div>
          <div className={cssBooking["modal-check-in"]}>
            <Form.Label>Reservation Date and Time</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.reservationDateTime}
            />

            <Form.Label>Customer ID</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.customerID}
            />

            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.customerName}
            />

            <Form.Label>Customer Request</Form.Label>
            <Form.Control
              as="textarea"
              disabled
              value={stateBookData.customerRequest}
            />

            <Form.Label>Package</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.packageName}
            />

            <Form.Label>Days Accommodated</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.daysAccommodated}
            />

            <Form.Label>Day and Time</Form.Label>
            <Form.Control type="text" disabled value={stateBookData.dayTime} />

            <Form.Label>Check In Date</Form.Label>
            <Form.Control type="text" disabled value={stateBookData.checkIn} />

            <Form.Label>Check Out Date</Form.Label>
            <Form.Control type="text" disabled value={stateBookData.checkOut} />

            <Form.Label>Package Amount</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.packageAmount}
            />

            <Form.Label>Total Payment</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.totalAmount}
            />
          </div>
          <div className={cssBooking["modal-div-button"]}>
            <Button
              onClick={() => {
                databaseUpdateReferenceStatus(
                  stateBookData.packageID,
                  stateBookData.customerID,
                  stateBookData.reference,
                  "CHECKED-IN"
                );
              }}
            >
              CHECK IN
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const bookCheckOut = () => {
    return (
      <Modal
        show={stateBookReference.checkOut}
        animation={true}
        centered
        onHide={() => {
          setStateBookReference({ ...stateBookReference, checkOut: false });
        }}
      >
        <Modal.Header closeButton className={cssBooking.modalHeader}>
          <div>
            <p>Customer Reservation</p>
            <p>Reservation Check Out</p>
          </div>
        </Modal.Header>

        <Modal.Body className={cssBooking["modal-body"]}>
          <div>
            <h1>Reservation Check Out</h1>
          </div>
          <div className={cssBooking["modal-check-in"]}>
            <Form.Label>Reservation Date and Time</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.reservationDateTime}
            />

            <Form.Label>Customer ID</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.customerID}
            />

            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.customerName}
            />

            <Form.Label>Customer Request</Form.Label>
            <Form.Control
              as="textarea"
              disabled
              value={stateBookData.customerRequest}
            />

            <Form.Label>Package</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.packageName}
            />

            <Form.Label>Days Accommodated</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.daysAccommodated}
            />

            <Form.Label>Day and Time</Form.Label>
            <Form.Control type="text" disabled value={stateBookData.dayTime} />

            <Form.Label>Check In Date</Form.Label>
            <Form.Control type="text" disabled value={stateBookData.checkIn} />

            <Form.Label>Check Out Date</Form.Label>
            <Form.Control type="text" disabled value={stateBookData.checkOut} />

            <Form.Label>Package Amount</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.packageAmount}
            />

            <Form.Label>Total Payment</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.totalAmount}
            />
          </div>
          <div className={cssBooking["modal-div-button"]}>
            <Button
              onClick={() => {
                databaseUpdateReferenceStatus(
                  stateBookData.packageID,
                  stateBookData.customerID,
                  stateBookData.reference,
                  "CHECKED-OUT"
                );
              }}
            >
              CHECK OUT
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const bookViewInfo = () => {
    return (
      <Modal
        show={stateBookReference.viewInfo}
        animation={true}
        centered
        onHide={() => {
          setStateBookReference({ ...stateBookReference, viewInfo: false });
        }}
      >
        <Modal.Header closeButton className={cssBooking.modalHeader}>
          <div>
            <p>Customer Reservation</p>
            <p>Reservation Information</p>
          </div>
        </Modal.Header>

        <Modal.Body className={cssBooking["modal-body"]}>
          <div>
            <h1>Reservation Information</h1>
          </div>
          <div className={cssBooking["modal-check-in"]}>
            <Form.Label>Reservation Date and Time</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.reservationDateTime}
            />

            <Form.Label>Customer ID</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.customerID}
            />

            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.customerName}
            />

            <Form.Label>Customer Request</Form.Label>
            <Form.Control
              as="textarea"
              disabled
              value={stateBookData.customerRequest}
            />

            <Form.Label>Package</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.packageName}
            />

            <Form.Label>Days Accommodated</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.daysAccommodated}
            />

            <Form.Label>Day and Time</Form.Label>
            <Form.Control type="text" disabled value={stateBookData.dayTime} />

            <Form.Label>Check In Date</Form.Label>
            <Form.Control type="text" disabled value={stateBookData.checkIn} />

            <Form.Label>Check Out Date</Form.Label>
            <Form.Control type="text" disabled value={stateBookData.checkOut} />

            <Form.Label>Package Amount</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.packageAmount}
            />

            <Form.Label>Total Payment</Form.Label>
            <Form.Control
              type="text"
              disabled
              value={stateBookData.totalAmount}
            />
          </div>
          <div className={cssBooking["modal-div-button"]}>
            <Button
              onClick={() => {
                setStateBookReference({
                  ...stateBookReference,
                  viewInfo: false,
                });
              }}
            >
              OK
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  //function package component-----------------------------------------------------------------------
  const addPackageModal = () => {
    return (
      <Modal
        show={statePackageModal.add}
        animation={true}
        centered
        onHide={() => {
          setStatePackageModal({ ...statePackageModal, add: false });
          setStatePackageError({
            name: {
              isInvalid: false,
              isValid: false,
              error: "",
            },
            description: {
              isInvalid: false,
              isValid: false,
              error: "",
            },
            amount: {
              isInvalid: false,
              isValid: false,
              error: "",
            },
          });
        }}
      >
        <Modal.Header closeButton className={cssBooking.modalHeader}>
          <div>
            <p>Resort Package</p>
            <p>Create New Resort Package</p>
          </div>
        </Modal.Header>

        <Modal.Body className={cssBooking["modal-body"]}>
          <div>
            <h1>Create Resort Package</h1>
          </div>
          <div className={cssBooking["modal-check-in"]}>
            <Form.Label>Package ID</Form.Label>
            <Form.Control
              type="text"
              ref={packageID}
              disabled
              value={statePackageData.id}
            />

            <Form.Group className={css.customerInput}>
              <Form.Label>Package Name</Form.Label>
              <Form.Control
                type="text"
                ref={packageName}
                isInvalid={statePackageError.name.isInvalid}
                isValid={statePackageError.name.isValid}
                onChange={() => {
                  onChangePackage("name");
                }}
                value={statePackageData.name}
              />
              <Form.Control.Feedback
                className={css.error}
                type="invalid"
                tooltip
              >
                {statePackageError.name.error}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={css.customerInput}>
              <Form.Label>Package Description</Form.Label>
              <Form.Control
                as="textarea"
                ref={packageDescription}
                isInvalid={statePackageError.description.isInvalid}
                isValid={statePackageError.description.isValid}
                onChange={() => {
                  onChangePackage("description");
                }}
                value={statePackageData.description}
              />
              <Form.Control.Feedback
                className={css.error}
                type="invalid"
                tooltip
              >
                {statePackageError.description.error}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className={css.customerInput}>
              <Form.Label>Package Amount</Form.Label>
              <Form.Control
                type="number"
                pattern="[0-9]+([,\.][0-9]+)?"
                ref={packageAmount}
                isInvalid={statePackageError.amount.isInvalid}
                isValid={statePackageError.amount.isValid}
                onChange={() => {
                  onChangePackage("amount");
                }}
                value={statePackageData.amount}
              />
              <Form.Control.Feedback
                className={css.error}
                type="invalid"
                tooltip
              >
                {statePackageError.amount.error}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className={cssBooking["modal-div-button"]}>
            <Button
              onClick={() => {
                createPackage();
              }}
            >
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const packageTable = () => {
    const columns = [
      {
        name: "ID",
        selector: (row) => row.id,
        sortable: true,
        id: "columnName-1",
        style: {
          "font-family": "poppins, sans-serif",
          "font-size": "0.8rem",
          "text-align": "center",
          "justify-content": "center",
        },
      },
      {
        name: "Name",
        selector: (row) => row.name,
        id: "columnName-2",
        style: {
          "font-family": "poppins, sans-serif",
          "font-size": "0.8rem",
          "text-align": "center",
          "justify-content": "center",
        },
      },
      {
        name: "Description",
        selector: (row) => row.description,
        id: "columnName-3",
        style: {
          "font-family": "poppins, sans-serif",
          "font-size": "0.8rem",
          "text-align": "center",
          "justify-content": "center",
        },
      },
      {
        name: "Amount",
        selector: (row) => row.amount,
        id: "columnName-4",
        style: {
          "font-family": "poppins, sans-serif",
          "font-size": "0.8rem",
          "text-align": "center",
          "justify-content": "center",
        },
      },
      {
        name: "Action",
        cell: (row) => (
          <div className={cssBooking["control-header"]}>
            <Button
              variant="info"
              onClick={() => {
                addPackage(
                  "edit",
                  row.id,
                  row.name,
                  row.description,
                  row.amountData
                );
              }}
            >
              Edit
            </Button>
          </div>
        ),
        id: "columnName-6",
        style: {
          "justify-content": "center",
        },
      },
    ];

    return (
      <DataTable
        columns={columns}
        data={stateAllPackage}
        pagination
        fixedHeader
        highlightOnHover
        actions={
          <Button
            variant="success"
            onClick={() => {
              addPackage("add");
            }}
          >
            {" "}
            Add Package{" "}
          </Button>
        }
        subHeader
        subHeaderComponent={
          <>
            <Form.Label>
              <span className="material-icons-sharp">search</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Search"
              ref={packageSearch}
              onChange={() => {
                packageFilter();
              }}
              value={stateRefPackageSearch}
            />
          </>
        }
      />
    );
  };

  //Set Hotel Cover Image Component------------------------------------------------
  const ResortCoverComponent = () => {
    return stateResortCover != "" ? (
      <div
        className={`${cssBooking.conHotelCoverImage} ${cssBooking.profileIcon}`}
      >
        <img src={stateResortCover} alt="Resort Cover Picture" />
      </div>
    ) : (
      <div className={`${cssBooking.conHotelCover} ${cssBooking.profileIcon}`}>
        <img src="/image/image_icon.png" alt="Resort Cover Picture" />
      </div>
    );
  };

  //Set Room Gallery 1 Component----------------------------------------------------
  const ResortRoomGallery1 = () => {
    return stateResortGallery1 != "" ? (
      <div
        className={`${cssBooking.conHotelCoverImage} ${cssBooking.profileIcon}`}
      >
        <img src={stateResortGallery1} alt="Resort Cover Picture" />
      </div>
    ) : (
      <div className={`${cssBooking.conHotelCover} ${cssBooking.profileIcon}`}>
        <img src="/image/image_icon.png" alt="Resort Cover Picture" />
      </div>
    );
  };

  //Set Room Gallery 2 Component----------------------------------------------------
  const ResortRoomGallery2 = () => {
    return stateResortGallery2 != "" ? (
      <div
        className={`${cssBooking.conHotelCoverImage} ${cssBooking.profileIcon}`}
      >
        <img src={stateResortGallery2} alt="Resort Cover Picture" />
      </div>
    ) : (
      <div className={`${cssBooking.conHotelCover} ${cssBooking.profileIcon}`}>
        <img src="/image/image_icon.png" alt="Resort Cover Picture" />
      </div>
    );
  };

  //Links component----------------------------------------------------------------------------
  const linkDashboard = () => {
    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });
    return (
      <main className={css.main}>
        <div className={css["dashboard-header"]}>
          <div className={css["dashboard-title"]}>
            <h1>Dashboard</h1>
          </div>
          <div className={css["dashboard-profile"]}>
            <div className={css["dashboard-admin"]}>
              <h3>{managerName}</h3>
              <small className={css["text-muted"]}>Resort Manager</small>
            </div>
            <span className="material-icons-sharp">account_circle_full</span>
          </div>
        </div>
        <div className={css["resort-name"]}>
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

          <div className={css["checked-out"]}>
            <span className="material-icons-sharp">done_all</span>
            <div className={css.middle}>
              <div className={css.left}>
                <h3>Customer Served</h3>
                <h1>{stateCustomerServed}</h1>
              </div>
            </div>
          </div>

          <div className={css["total-income"]}>
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
        <div className={css["recent-booking"]}>
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
              {stateRecentBooking.map((value, index) => (
                <tr key={index}>
                  <td>{value.customerName}</td>
                  <td>{value.dateCheckIn}</td>
                  <td>{value.dateCheckOut}</td>
                  <td>{value.packageName}</td>
                  <td>{value.payment}</td>
                  <td>{value.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  };

  const linkBooking = () => {
    let formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    });
    return (
      <main className={`${css.main} ${cssBooking.main}`}>
        <div className={css["dashboard-header"]}>
          <div className={css["dashboard-title"]}>
            <h1>Booking</h1>
          </div>
          <div className={css["dashboard-profile"]}>
            <div className={css["dashboard-admin"]}>
              <h3>{managerName}</h3>
              <small className={css["text-muted"]}>Resort Manager</small>
            </div>
            <span className="material-icons-sharp">account_circle_full</span>
          </div>
        </div>
        <div className={css["resort-name"]}>
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

          <div className={css["checked-out"]}>
            <div className={cssBooking["checked-out"]}>
              <span className="material-icons-sharp">done_all</span>
              <div className={css.middle}>
                <div className={css.left}>
                  <h3>Approved</h3>
                </div>
              </div>
            </div>
            <h1>{stateBookApproved}</h1>
          </div>

          <div className={css["total-income"]}>
            <div className={cssBooking["total-income"]}>
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
        <div className={cssBooking["nav-card"]}>
          <div>
            <h3>Total Income</h3>
            <h2>{formatter.format(stateBookIncome)}</h2>
          </div>
          <div>
            <h3>Filter By Date</h3>
            <Form.Control
              ref={bookFilterDate}
              type="date"
              onChange={() => {
                BookFilter("date");
              }}
              value={stateRefFilterDate}
            />
          </div>
          <div>
            <h3>Filter By Month</h3>
            {getSelectMonth()}
          </div>
          <div>
            <h3>Clear Filter</h3>
            <Button
              variant="outline-danger"
              onClick={() => {
                BookFilter("clear");
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* -------------------Booking Table--------------------------------- */}
        <div className={cssBooking["booking-table"]}>{bookingTable()}</div>
      </main>
    );
  };

  const linkPackage = () => {
    return (
      <main className={`${css.main} ${cssBooking.main}`}>
        <div className={css["dashboard-header"]}>
          <div className={css["dashboard-title"]}>
            <h1>Package</h1>
          </div>
          <div className={css["dashboard-profile"]}>
            <div className={css["dashboard-admin"]}>
              <h3>{managerName}</h3>
              <small className={css["text-muted"]}>Resort Manager</small>
            </div>
            <span className="material-icons-sharp">account_circle_full</span>
          </div>
        </div>
        <div className={css["resort-name"]}>
          <h2>{hotelName}</h2>
        </div>

        {/* -------------------Booking Table--------------------------------- */}
        <div className={cssBooking["booking-table"]}>{packageTable()}</div>
      </main>
    );
  };

  const linkSettings = () => {
    return (
      <main className={`${css.main} ${cssBooking.main}`}>
        <div className={css["dashboard-header"]}>
          <div className={css["dashboard-title"]}>
            <h1>Settings</h1>
          </div>
          <div className={css["dashboard-profile"]}>
            <div className={css["dashboard-admin"]}>
              <h3>{managerName}</h3>
              <small className={css["text-muted"]}>Resort Manager</small>
            </div>
            <span className="material-icons-sharp">account_circle_full</span>
          </div>
        </div>
        <div className={css["resort-name"]}>
          <h2>{hotelName}</h2>
        </div>

        {/* -------------------Booking Table--------------------------------- */}
        <div className={cssBooking["nav-settings"]}>
          <h2>Resort Information</h2>
          <div className={cssBooking["modal-check-in"]}>
            <Form onSubmit={updateSettings}>
              <Form.Label>Resort Reference ID</Form.Label>
              <Form.Control
                type="text"
                ref={resortID}
                disabled
                value={stateSettingsData.id}
              />

              <Form.Group className={css.customerInput}>
                <Form.Label>Resort Name</Form.Label>
                <Form.Control
                  type="text"
                  ref={resortName}
                  isInvalid={stateSettingsError.name.isInvalid}
                  isValid={stateSettingsError.name.isValid}
                  onChange={() => {
                    onChangeSettings("name");
                  }}
                  value={stateSettingsData.name}
                />
                <Form.Control.Feedback
                  className={css.error}
                  type="invalid"
                  tooltip
                >
                  {stateSettingsError.name.error}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={css.customerInput}>
                <Form.Label>Resort Location</Form.Label>
                <Form.Control
                  type="text"
                  ref={resortLocation}
                  isInvalid={stateSettingsError.location.isInvalid}
                  isValid={stateSettingsError.location.isValid}
                  onChange={() => {
                    onChangeSettings("location");
                  }}
                  value={stateSettingsData.location}
                />
                <Form.Control.Feedback
                  className={css.error}
                  type="invalid"
                  tooltip
                >
                  {stateSettingsError.location.error}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={css.customerInput}>
                <Form.Label>Resort Description</Form.Label>
                <Form.Control
                  as="textarea"
                  ref={resortDescription}
                  isInvalid={stateSettingsError.description.isInvalid}
                  isValid={stateSettingsError.description.isValid}
                  onChange={() => {
                    onChangeSettings("description");
                  }}
                  value={stateSettingsData.description}
                />
                <Form.Control.Feedback
                  className={css.error}
                  type="invalid"
                  tooltip
                >
                  {stateSettingsError.description.error}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={css.customerInput}>
                <Form.Label>Number of Resort Rooms</Form.Label>
                <Form.Control
                  type="number"
                  pattern="[0-9]*"
                  ref={resortRooms}
                  isInvalid={stateSettingsError.rooms.isInvalid}
                  isValid={stateSettingsError.rooms.isValid}
                  onChange={() => {
                    onChangeSettings("rooms");
                  }}
                  value={stateSettingsData.rooms}
                />
                <Form.Control.Feedback
                  className={css.error}
                  type="invalid"
                  tooltip
                >
                  {stateSettingsError.rooms.error}
                </Form.Control.Feedback>
              </Form.Group>

              <div className={cssBooking.settingsCover}>
                <div>
                  <Form.Group className={`${css.customerInput}`}>
                    <Form.Label>Resort Cover Photo</Form.Label>
                    <div>
                      <Form.Control
                        type="file"
                        ref={resortCover}
                        onChange={() => {
                          onChangeSettings("cover");
                        }}
                        isInvalid={stateSettingsError.cover.isInvalid}
                        isValid={stateSettingsError.cover.isValid}
                      />
                      <Form.Control.Feedback
                        className={css.error}
                        type="invalid"
                        tooltip
                      >
                        {stateSettingsError.cover.error}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  <div className={cssBooking.HotelCover}>
                    {ResortCoverComponent()}
                  </div>
                </div>
                <div>
                  <Form.Group className={`${css.customerInput}`}>
                    <Form.Label>Resort Room Gallery 1</Form.Label>
                    <div>
                      <Form.Control
                        type="file"
                        ref={resortRoomGallery1}
                        onChange={() => {
                          onChangeSettings("room1");
                        }}
                        isInvalid={stateSettingsError.room1.isInvalid}
                        isValid={stateSettingsError.room1.isValid}
                      />
                      <Form.Control.Feedback
                        className={css.error}
                        type="invalid"
                        tooltip
                      >
                        {stateSettingsError.room1.error}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  <div className={cssBooking.HotelCover}>
                    {ResortRoomGallery1()}
                  </div>
                </div>
                <div>
                  <Form.Group className={`${css.customerInput}`}>
                    <Form.Label>Resort Room Gallery 2</Form.Label>
                    <div>
                      <Form.Control
                        type="file"
                        ref={resortRoomGallery2}
                        onChange={() => {
                          onChangeSettings("room2");
                        }}
                        isInvalid={stateSettingsError.room2.isInvalid}
                        isValid={stateSettingsError.room2.isValid}
                      />
                      <Form.Control.Feedback
                        className={css.error}
                        type="invalid"
                        tooltip
                      >
                        {stateSettingsError.room2.error}
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  <div className={cssBooking.HotelCover}>
                    {ResortRoomGallery2()}
                  </div>
                </div>
              </div>

              <div className={cssBooking["modal-div-button"]}>
                <Button type="submit">Save</Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    );
  };

  const linkAccount = () => {
    return (
      <main className={`${css.main} ${cssBooking.main}`}>
        <div className={css["dashboard-header"]}>
          <div className={css["dashboard-title"]}>
            <h1>Account</h1>
          </div>
          <div className={css["dashboard-profile"]}>
            <div className={css["dashboard-admin"]}>
              <h3>{managerName}</h3>
              <small className={css["text-muted"]}>Resort Manager</small>
            </div>
            <span className="material-icons-sharp">account_circle_full</span>
          </div>
        </div>
        <div className={css["resort-name"]}>
          <h2>{hotelName}</h2>
        </div>

        {/* -------------------Booking Table--------------------------------- */}
        <div className={cssBooking["nav-settings"]}>
          <h2>Manager Account</h2>
          <div className={cssBooking["modal-check-in"]}>
            <Form onSubmit={updateAccount}>
            <Form.Label>Manager Account ID</Form.Label>
                <Form.Control
                  type="text"
                  ref={accountID}
                  disabled
                  value={stateAccountData.id}
                />

                <Form.Group className={css.customerInput}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    ref={accountFirstname}
                    isInvalid={stateAccountError.firstname.isInvalid}
                    isValid={stateAccountError.firstname.isValid}
                    onChange={() => {
                      onChangeAccount("firstname");
                    }}
                    value={stateAccountData.firstname}
                  />
                  <Form.Control.Feedback
                    className={css.error}
                    type="invalid"
                    tooltip
                  >
                    {stateAccountError.firstname.error}
                  </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={css.customerInput}>
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    ref={accountMiddlename}
                    isInvalid={stateAccountError.middlename.isInvalid}
                    isValid={stateAccountError.middlename.isValid}
                    onChange={() => {
                      onChangeAccount("middlename");
                    }}
                    value={stateAccountData.middlename}
                  />
                  <Form.Control.Feedback
                    className={css.error}
                    type="invalid"
                    tooltip
                  >
                    {stateAccountError.middlename.error}
                  </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={css.customerInput}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    ref={accountLastname}
                    isInvalid={stateAccountError.lastname.isInvalid}
                    isValid={stateAccountError.lastname.isValid}
                    onChange={() => {
                      onChangeAccount("lastname");
                    }}
                    value={stateAccountData.lastname}
                  />
                  <Form.Control.Feedback
                    className={css.error}
                    type="invalid"
                    tooltip
                  >
                    {stateAccountError.lastname.error}
                  </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={css.customerInput}>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    ref={accountUsername}
                    isInvalid={stateAccountError.username.isInvalid}
                    isValid={stateAccountError.username.isValid}
                    onChange={() => {
                      onChangeAccount("username");
                    }}
                    value={stateAccountData.username}
                  />
                  <Form.Control.Feedback
                    className={css.error}
                    type="invalid"
                    tooltip
                  >
                    {stateAccountError.username.error}
                  </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className={css.customerInput}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={accountPassword}
                    isInvalid={stateAccountError.isInvalid}
                    isValid={stateAccountError.password.isValid}
                    onChange={() => {
                      onChangeAccount("password");
                    }}
                    value={stateAccountData.password}
                  />
                  <Form.Control.Feedback
                    className={css.error}
                    type="invalid"
                    tooltip
                  >
                    {stateAccountError.password.error}
                  </Form.Control.Feedback>
              </Form.Group>

              <div className={cssBooking["modal-div-button"]}>
                <Button type="submit">Save</Button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    );
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp"
          rel="stylesheet"
        />
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
                  <span className={`material-icons-sharp ${css.closebtn}`}>
                    close
                  </span>
                </div>
              </div>

              <div className={css.sidebar}>
                <a
                  onClick={() => changeTab("dashboard")}
                  className={linkActive == "dashboard" ? css.active : ""}
                >
                  <span className="material-icons-sharp">grid_view</span>
                  <h3>Dashboard</h3>
                </a>

                <a
                  onClick={() => changeTab("booking")}
                  className={linkActive == "booking" ? css.active : ""}
                >
                  <span className="material-icons-sharp">book_online</span>
                  <h3>Booking</h3>
                </a>

                <a
                  onClick={() => changeTab("package")}
                  className={linkActive == "package" ? css.active : ""}
                >
                  <span className="material-icons-sharp">inventory_2</span>
                  <h3>Package</h3>
                </a>

                <a
                  onClick={() => changeTab("settings")}
                  className={linkActive == "settings" ? css.active : ""}
                >
                  <span className="material-icons-sharp">settings</span>
                  <h3>Settings</h3>
                </a>

                <a
                  onClick={() => changeTab("account")}
                  className={linkActive == "account" ? css.active : ""}
                >
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

          {linkActive == "dashboard"
            ? linkDashboard()
            : linkActive == "booking"
            ? linkBooking()
            : linkActive == "package"
            ? linkPackage()
            : linkActive == "settings"
            ? linkSettings()
            : linkActive == "account"
            ? linkAccount()
            : null}
        </div>
      </div>
      {bookApproved()}
      {bookCheckIn()}
      {bookCheckOut()}
      {bookViewInfo()}
      {addPackageModal()}
    </>
  );
}
