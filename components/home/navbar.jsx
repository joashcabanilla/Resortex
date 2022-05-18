import { Navbar, Nav, Modal, Button, Form } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import cssNavbar from '../../styles/Components/Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import css from '../../styles/Components/modalSignIn.module.css';
import {addUser} from '../../redux/reduxSlice/userSlice';
import { useSelector,useDispatch } from 'react-redux';
import {useRouter} from 'next/router';
import {auth} from '../../firebase/firebaseConfig';
import {signInWithPhoneNumber, RecaptchaVerifier} from 'firebase/auth';
import {database} from '../../firebase/firebaseConfig';
import { ref, set } from "firebase/database";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import cssHome from '../../styles/Pages/Home.module.css';
import Hotelmanager from './Hotelmanager';
import { showModalHotelManager } from '../../redux/reduxSlice/hotelSlice';

export default function ComponentNavbar() {
    //import variables
    const dispatch = useDispatch();
    const router = useRouter();
    const mySwal = withReactContent(Swal);
    
    //redux state
    const stateHotelManagerAcct = useSelector(state => state.storeUsers.hotelManagerAcct);
    const stateUser = useSelector(state => state.storeUsers.userList);

    //state declaration
    const [navbar, setNavbar] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [modalSignInShow, setModalSignInShow] = useState(false);
    const [modalCustomerShow, setModalCustomerShow] = useState(false);
    const [modalCustomerAuthShow, setModalCustomerAuthShow] = useState(false);
    const [formSignInShowPassword, setFormSignInShowPassword] = useState(false);
    const [uploadProfile, setUploadProfile] = useState("");
    const [customerAccountID, setCustomerAccountID] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerTelephone, setCustomerTelephone] = useState("");
    const [customerVerifyAuth, setCustomerVerifyAuth] = useState("");
    const [hotelAccountID, setHotelAccountID] = useState("");

    const [errorSignIn,setErrorSignIn] = useState({
        username:{
            isInvalid: false,
            error:"",
        },
        password:{
            isInvalid: false,
            error: "",
        }
    });
    const [errorCustomer,setErrorCustomer] = useState({
        firstname:{
            isValid: false,
            isInvalid: false,
            error:"",
        },
        middlename:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        lastname:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        address:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        phone:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        telephone:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        birthdate:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        gender:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        nationality:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        username:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        password:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        confirmpassword:{
            isValid: false,
            isInvalid: false,
            error: "",
        },
        profilepic:{
            isValid: false,
            isInvalid: false,
            error: "",
        }
    });
    const [errorCustomerAuth, setErrorCustomerAuth] = useState({
        isInvalid: false,
        error:"",
    });
    const [errorCustomerAuthVerify, setErrorCustomerAuthVerify] = useState("");
    const [customerSignUpData, setCustomerSignUpData] = useState("");

    //react Hooks useRef
    const usernameSignIn = useRef();
    const passwordSignIn = useRef();
    const showPasswordSignIn = useRef();
    const firstnameCustomer = useRef();
    const middlenameCustomer = useRef();
    const lastnameCustomer = useRef();
    const profilePicCustomer = useRef();
    const addressCustomer = useRef();
    const phoneCustomer = useRef();
    const telephoneCustomer = useRef();
    const birthdateCustomer = useRef();
    const genderCustomer = useRef();
    const nationalityCustomer = useRef();
    const usernameCustomer = useRef();
    const passwordCustomer = useRef();
    const confirmpasswordCustomer = useRef();
    const customerAuthInputCode = useRef();

    //react Hooks use effect
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
    }, []);

    const onScroll = () => {
        window.scrollY >= 100 ? setNavbar(true) : setNavbar(false);
    }

    //component functions
    const updateStateSignIn = (error, invalid, input) => {
        setErrorSignIn(errorSignIn => ({...errorSignIn,
            [input]:{
                isInvalid: invalid,
                error: error,
            }}))
    }

    const hidemodalSignIn = () => {
        setModalSignInShow(false); 
        updateStateSignIn("",false,"username"); 
        updateStateSignIn("",false,"password");
    }

    const resetCustomerSignUpState = () => {
        setUploadProfile("");
        setCustomerPhone("");
        setCustomerTelephone("");
        setErrorCustomer({
            firstname:{
                isValid: false,
                isInvalid: false,
                error:"",
            },
            middlename:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            lastname:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            address:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            phone:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            telephone:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            birthdate:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            gender:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            nationality:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            username:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            password:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            confirmpassword:{
                isValid: false,
                isInvalid: false,
                error: "",
            },
            profilepic:{
                isValid: false,
                isInvalid: false,
                error: "",
            }
        });
    }

    const hidemodalCustomer = () => {
        setModalCustomerShow(false);
        resetCustomerSignUpState();
    }

    const hidemodalCustomerAuth = () => {
        resetCustomerSignUpState();
        setModalCustomerAuthShow(false);
        setErrorCustomerAuthVerify("");
        setCustomerSignUpData("");
        setErrorCustomerAuth({
            isInvalid: false,
            error:"",
        });
    } 

    const changeShowpasswordSignIn = () => {
        showPasswordSignIn.current.checked ? setFormSignInShowPassword(true) : setFormSignInShowPassword(false);
    }

        const setImgProfile = () => {
        return uploadProfile != "" ? (
                <div className={css.profileIcon}>
                    <img src={uploadProfile} alt="profile picture" />
                </div>
            ) : (
            <div className={css.profileIcon}>
                <img src='/image/profile-icon-9.png' alt="profile picture" />
            </div>
        ); 
        }

    //get new customer account id
    const customerCreateAccount = () => {
        let date = new Date();
        let month = date.getMonth()+1 < 10 ?  `0${date.getMonth()+1}` : date.getMonth()+1;
        let day = date.getDate() < 10 ?  `0${date.getDate()}` : date.getDate();
        let accountDate = `HRS-${date.getFullYear()}-${month}-${day}`;
        let id = 0;
        Object.values(stateUser).forEach(value => {
            let dataId = value['ACCOUNT-ID NUMBER'];
            id = parseInt(dataId.split("-")[4]) + 1;
        });
        setModalSignInShow(false); 
        setModalCustomerShow(true);
        setCustomerAccountID(`${accountDate}-${'0000'.substr( String(id).length ) + id}`);
    }
    
    const managerCreateAccount = () => {
        setModalSignInShow(false); 
        dispatch(showModalHotelManager(true));

        //Get Hotel Manager Account ID-------------------------------------------------
        let date = new Date();
        let month = date.getMonth()+1 < 10 ?  `0${date.getMonth()+1}` : date.getMonth()+1;
        let accountDate = `${date.getFullYear()}-${month}`;
        let id = 0;
        Object.values(stateHotelManagerAcct).forEach(value => {
            let dataId = value['ID'];
            id = parseInt(dataId.split("-")[2]) + 1;
        });
        const accountID = `${accountDate}-${'0000'.substr( String(id).length ) + id}`;
        setHotelAccountID(accountID);
    }

    //event handlers functions
    //sign in form username and password onchage
    const signInchangeInput = (input) => {
        input == "username" ? updateStateSignIn("",false,"username") : updateStateSignIn("",false,"password");
    }

    //sign in form submit
    const handleSubmitSignIn = (e) => {
        e.preventDefault();
        let username = usernameSignIn.current.value;
        let password = passwordSignIn.current.value;
        let type = "";
        let id = "";
        let validatedUsername = false;
        let validatedPassword = false;
        let signInAcct = [];
        
        Object.values(stateHotelManagerAcct).forEach(value => {
            let datausername = value['USERNAME'];
            let datapassword = value['PASSWORD'];
            let id = value['ID'];
            signInAcct.push({username: datausername, password: datapassword, type: "manager", id: id});
        });

        signInAcct.forEach((value) => {
            if(value.username == username) validatedUsername = true;    
            if(value.password == password) validatedPassword = true;
            if(value.username == username && value.password == password){
                type = value.type;
                id = value.id;
            }
        });

        const setRouterLogin = (type, id) => {
            fetch("/api/login", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({type: type, id: id}),
            });
            router.replace(`${id}`);
        }
         
        if(validatedUsername && validatedPassword){
            type == "manager" ? setRouterLogin(type, id) : null;
            updateStateSignIn("",false,"username"); 
            updateStateSignIn("",false,"password");
        }
        else{
            !validatedUsername && username != "" ?  updateStateSignIn("Incorrect Username",true,"username") : updateStateSignIn("",false,"username");
            !validatedPassword && password != "" ? updateStateSignIn("Incorrect Password",true,"password") : updateStateSignIn("",false,"password");
            username == "" ? updateStateSignIn("Enter Username",true,"username") : null;
            password == "" ? updateStateSignIn("Enter Password",true,"password") : null;
        }
        
    }

     //update customer form control feedback state
     const updateStateCustomer = (error, invalid, valid, input) => {
        setErrorCustomer(errorCustomer => ({...errorCustomer,
            [input]:{
                isValid: valid,
                isInvalid: invalid,
                error: error,
            }}));
    }

    //onkeydown customer telephone
    const keydownCustomerTelephone = (e) => {
        if(e.key == "Backspace"){
            setCustomerTelephone(customerTelephone.slice(0, -1));
        }
        else{
            switch(customerTelephone.length){
                case 0:
                case 1:
                    if(!isNaN(e.key)){
                        setCustomerTelephone(`(${e.key}`);
                    } 
                break;
                
                case 2:
                    if(!isNaN(e.key)) setCustomerTelephone(`${customerTelephone}${e.key})`);
                break;
                
                case 3:
                    if(!isNaN(e.key)) setCustomerTelephone(`${customerTelephone})${e.key}`);
                break;

                case 4:
                case 5:
                case 6:
                case 7:
                case 9:
                case 10:
                case 11:
                case 12:
                    if(!isNaN(e.key)) setCustomerTelephone(`${customerTelephone}${e.key}`);
                break;

                case 8:             
                    if(!isNaN(e.key)) setCustomerTelephone(`${customerTelephone}-${e.key}`);
                break;
            }
        }
    }

    //customer form control onchage
    const customerchangeInput = (input) => {
        switch(input){
            case "profilepic":
                let profilepic = profilePicCustomer.current.value;
                profilepic != "" ? setUploadProfile(URL.createObjectURL(profilePicCustomer.current.files[0])) : setUploadProfile("");
                profilepic != "" ? updateStateCustomer("",false,true,"profilepic") :updateStateCustomer("",false,false,"profilepic");  
            break;

            case "firstname":
                let firstname = firstnameCustomer.current.value;
                firstname == "" ?  updateStateCustomer("",false,false,"firstname") : updateStateCustomer("",false,true,"firstname");
            break;

            case "middlename":
                let middlename = middlenameCustomer.current.value;
                middlename == "" ?  updateStateCustomer("",false,false,"middlename") : updateStateCustomer("",false,true,"middlename");
            break;

            case "lastname":
                let lastname = lastnameCustomer.current.value;
                lastname == "" ?  updateStateCustomer("",false,false,"lastname") : updateStateCustomer("",false,true,"lastname");
            break;

            case "address":
                let address = addressCustomer.current.value;
                address == "" ?  updateStateCustomer("",false,false,"address") : updateStateCustomer("",false,true,"address");
            break;

            case "phone": 
                let phone = phoneCustomer.current.value;
                setCustomerPhone(value => phoneCustomer.current.validity.valid ? phone : value); 
                phone != "" && phone.length == 10 && phone[0] == "9" ? updateStateCustomer("",false,true,"phone") : updateStateCustomer("",false,false,"phone");
            break;

            case "telephone":
                let telephone = telephoneCustomer.current.value;
                telephone != "" && customerTelephone.length >= 12 ? updateStateCustomer("",false,true,"telephone") : updateStateCustomer("",false,false,"telephone");
            break;

            case "birthdate":
                let birthdate = birthdateCustomer.current.value;
                birthdate == "" ?  updateStateCustomer("",false,false,"birthdate") : updateStateCustomer("",false,true,"birthdate");
            break;

            case "gender":
                let gender = genderCustomer.current.value;
                gender == "" ?  updateStateCustomer("",false,false,"gender") : updateStateCustomer("",false,true,"gender");
            break;

            case "nationality":
                let nationality = nationalityCustomer.current.value;
                nationality == "" ?  updateStateCustomer("",false,false,"nationality") : updateStateCustomer("",false,true,"nationality");
            break;

            case "username":
                let username = usernameCustomer.current.value;
                username == "" ?  updateStateCustomer("",false,false,"username") : updateStateCustomer("",false,true,"username");
            break;
            
            case "password":
                let password = passwordCustomer.current.value;
                password == "" ?  updateStateCustomer("",false,false,"password") : updateStateCustomer("",false,true,"password");
            break;
            
            case "confirmpassword":
                let confirmpassword = confirmpasswordCustomer.current.value;
                confirmpassword == "" ?  updateStateCustomer("",false,false,"confirmpassword") : updateStateCustomer("",false,true,"confirmpassword");
            break;
        }
    }

    //customer form submit
    const handleSubmitCustomer = async (e) => {
        e.preventDefault(); 
        let profilepic = profilePicCustomer.current.value;
        let firstname = firstnameCustomer.current.value;
        let middlename = middlenameCustomer.current.value;
        let lastname = lastnameCustomer.current.value;
        let address = addressCustomer.current.value;
        let phone = phoneCustomer.current.value;
        let telephone = telephoneCustomer.current.value;
        let birthdate = birthdateCustomer.current.value;
        let gender = genderCustomer.current.value;
        let nationality = nationalityCustomer.current.value;
        let username = usernameCustomer.current.value;
        let password = passwordCustomer.current.value;
        let confirmpassword = confirmpasswordCustomer.current.value; 
        let phoneInput = `(+63)${phone.substring(0,3)}-${phone.substring(3,6)}-${phone.substring(6,10)}`;
        
        //function for capitalized each word
        const CapitalizedWord = (word) => {
            let words = word.split(" ");
           return words.map(word => word[0].toUpperCase() + word.substring(1)).join(" ");
        }

        //phone number and username validation if already used
        const inputDataValidation = () => {
            let validation = {
                phone: false,
                username: false,
            };
            Object.values(stateUser).forEach(value => {
                let phoneNumber = value['CONTACT-PHONE NUMBER'];
                let userName = value['ACCOUNT-USERNAME'];
                if(phoneNumber == phoneInput) validation.phone = true;
                if(userName == username) validation.username = true;
            });
            return validation;
        }

        if(profilepic == ""){
            updateStateCustomer("Upload Profile Picture",true,false,"profilepic");
            profilePicCustomer.current.focus();
        }
        else if(firstname == ""){
            updateStateCustomer("Enter Your First Name",true,false,"firstname");
            firstnameCustomer.current.focus();
        }
        else if(lastname == ""){
            updateStateCustomer("Enter Your Last Name",true,false,"lastname");
            lastnameCustomer.current.focus();
        }
        else if(address == ""){
            updateStateCustomer("Enter Your Address",true,false,"address");
            addressCustomer.current.focus();
        }
        else if(phone == ""){
            updateStateCustomer("Enter Your Phone Number",true,false,"phone");
            phoneCustomer.current.focus();
        }
        else if(phone[0] != "9" || phone.length != 10){
            updateStateCustomer("Invalid Phone Number",true,false,"phone");
            phoneCustomer.current.focus();
        }
        else if(inputDataValidation().phone == true){
            updateStateCustomer("Phone Number Already Used",true,false,"phone");
            phoneCustomer.current.focus();
        }
        else if(customerTelephone != "" && customerTelephone.length < 12){
            updateStateCustomer("Invalid Telephone Number",true,false,"telephone");
            telephoneCustomer.current.focus();
        }
        else if(birthdate == ""){
            updateStateCustomer("Set Your Birthday",true,false,"birthdate");
            birthdateCustomer.current.focus();
        }
        else if(gender == ""){
            updateStateCustomer("Select Your Gender",true,false,"gender");
            genderCustomer.current.focus();
        }
        else if(nationality == ""){
            updateStateCustomer("Enter Your Nationality",true,false,"nationality");
            nationalityCustomer.current.focus();
        }
        else if(username == ""){
            updateStateCustomer("Enter Your Username",true,false,"username");
            usernameCustomer.current.focus();
        }
        else if(username.length < 4){
            updateStateCustomer("Username must contain atleast 4 characters",true,false,"username");
            usernameCustomer.current.focus();
        }
        else if(inputDataValidation().username == true){
            updateStateCustomer("Username Already Exist",true,false,"username");
            usernameCustomer.current.focus();
        }
        else if(password == ""){
            updateStateCustomer("Enter Your Password",true,false,"password");
            passwordCustomer.current.focus();
        }
        else if(password.length < 6){
            updateStateCustomer("Password must contain atleast 6 characters",true,false,"password");
            passwordCustomer.current.focus();
        }
        else if(confirmpassword != password){
            updateStateCustomer("Password and Confirm Password do not match",true,false,"confirmpassword");
            confirmpasswordCustomer.current.focus();
        }
        else{
            firstname = CapitalizedWord(firstname);
            middlename = middlename != "" ? CapitalizedWord(middlename):"";
            lastname = CapitalizedWord(lastname);
            address = CapitalizedWord(address);
            telephone = telephone == "" ? "N/A" : telephone;
            birthdate = `${birthdate.substring(5,7)}/${birthdate.substring(8)}/${birthdate.substring(0,4)}`;
            nationality = CapitalizedWord(nationality);
            let date = new Date();
            let month = date.getMonth()+1 < 10 ?  `0${date.getMonth()+1}` : date.getMonth()+1;
            let day = date.getDate() < 10 ?  `0${date.getDate()}` : date.getDate();
            let year = date.getFullYear();
            let time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            let registrationDate = `${year}-${month}-${day} | ${time}`;
            let registrationStatus = "ACTIVE";
            setupRecaptcha(`+63${phone}`);

            //converting image file to base64
            try{
                let file = profilePicCustomer.current.files[0];
                let imageFiletype = `data:${file.type};base64,`;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    setCustomerSignUpData({
                        "ACCOUNT-FULL NAME": `${lastname}, ${firstname} ${middlename}`,
                        "ACCOUNT-ID NUMBER": customerAccountID,
                        "ACCOUNT-PASSWORD": password,
                        "ACCOUNT-USERNAME": username,
                        "ACCOUNT-USER_PROFILE": reader.result.substring(imageFiletype.length),
                        "CONTACT-HOME ADDRESS": address,
                        "CONTACT-PHONE NUMBER": phoneInput,
                        "CONTACT-TELEPHONE NUMBER": telephone,
                        "NAME-FIRST NAME": firstname,
                        "NAME-LAST NAME": lastname,
                        "NAME-MIDDLE NAME": middlename,
                        "PERSONAL-BIRTHDATE": birthdate,
                        "PERSONAL-GENDER": gender,
                        "PERSONAL-NATIONALITY": nationality,
                        "REGISTRATION-DATE AND TIME": registrationDate,
                        "REGISTRATION-STATUS": registrationStatus,
                    });
                };
            }
            catch(error){
                console.log(error);
            }
        }   
    }

    //setup Recaptcha customer phone number
    const setupRecaptcha = (phone) => {
        // auth.settings.appVerificationDisabledForTesting = true; //for phone authentication testing remove this in production/deploy mode 
        const recaptchaVerifier = new RecaptchaVerifier("customer-recaptcha-container",{}, auth);
        recaptchaVerifier.render();
        signInWithPhoneNumber(auth, phone, recaptchaVerifier)
        .then((confirmationResult) => {
            setCustomerVerifyAuth(confirmationResult);
            setModalCustomerAuthShow(true);
            setModalCustomerShow(false);
        }).catch((error) => {
            console.log(error);
        });
    }

    //firebase database customer sign up
    const databaseCustomerSignUp = async () => {
        await dispatch(addUser({
            [customerAccountID]:{
                ...customerSignUpData,
            }
        }));
        await set(ref(database, `HOTEL-RESERVATION-SYSTEM/USERS/${customerAccountID}`),{
            ...customerSignUpData,
        })
        .then(() => {
            hidemodalCustomerAuth();
            mySwal.fire({
                icon: 'success',
                title: <p className={cssHome.swalText}>Account has been successfully registered</p>,
                customClass:{
                  confirmButton: `${cssHome.swalButton}`,
                }
              });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    //customer authentication verfiy code
    const verifyCustomerAuth = (e) => {
        e.preventDefault();
        let code = customerAuthInputCode.current.value;
        if(code == ""){
            setErrorCustomerAuth({isInvalid:true, error: "Enter OTP"});
        }
        else{
            errorCustomerAuthVerify != "" ? setErrorCustomerAuth({isInvalid:true, error: "Invalid/Expired OTP"}) : setErrorCustomerAuth({isInvalid:false, error: ""});
            customerVerifyAuth.confirm(code).then(result => {
                setErrorCustomerAuthVerify("");  
                databaseCustomerSignUp();    
            }).catch((error) => {
                console.log(error);
                setErrorCustomerAuthVerify(`${error.message}`);
            });
        }
    }

    //components--------------------------------------------------
    const customerModal = () => {
        return (
            <Modal className={css.customerModal} show={modalCustomerShow} onHide={()=> {hidemodalCustomer()}} animation={true}  centered>
                <Modal.Header closeButton className={css.modalSignInHeader}>
                    <div>
                        <p>Join For Free</p>
                        <p>Access thousand of online Resorts</p>
                    </div>
                </Modal.Header>
    
                <Modal.Body className={css.modalCustomerBody}>
                    {setImgProfile()}
                    <Form onSubmit={handleSubmitCustomer}>
                        <Form.Group className={`${css.customerInput} ${css.conProfileCustomer}`}>
                            <Form.Label>PROFILE PICTURE</Form.Label>
                            <div>
                                <Form.Control type="file" ref={profilePicCustomer} onChange={()=>{customerchangeInput("profilepic")}} isInvalid={errorCustomer.profilepic.isInvalid} isValid={errorCustomer.profilepic.isValid} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{errorCustomer.profilepic.error}</Form.Control.Feedback>
                            </div>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.conAccountIDCustomer}`}>
                            <Form.Control type="text" disabled value={`ACCOUNT ID:  ${customerAccountID}`} readOnly />
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={firstnameCustomer} type="text" placeholder='First Name' isInvalid={errorCustomer.firstname.isInvalid} isValid={errorCustomer.firstname.isValid} onChange={() => {customerchangeInput("firstname")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{errorCustomer.firstname.error}</Form.Control.Feedback>
                                <Form.Label>First Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={middlenameCustomer} type="text" placeholder='Middle Name' isInvalid={errorCustomer.middlename.isInvalid} isValid={errorCustomer.middlename.isValid} onChange={() => {customerchangeInput("middlename")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{errorCustomer.middlename.error}</Form.Control.Feedback>
                                <Form.Label>Middle Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={lastnameCustomer} type="text" placeholder='Last Name' isInvalid={errorCustomer.lastname.isInvalid} isValid={errorCustomer.lastname.isValid} onChange={() => {customerchangeInput("lastname")}} />
                                <Form.Control.Feedback className={css.error}  type="invalid" tooltip>{errorCustomer.lastname.error}</Form.Control.Feedback>
                                <Form.Label>Last Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.address}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={addressCustomer} type="text" placeholder='Address' isInvalid={errorCustomer.address.isInvalid} isValid={errorCustomer.address.isValid} onChange={() => {customerchangeInput("address")}} />
                                <Form.Control.Feedback className={css.error}  type="invalid" tooltip>{errorCustomer.address.error}</Form.Control.Feedback>
                                <Form.Label>Address</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.conPhoneCustomer}`}>
                            <Form.Label className={errorCustomer.phone.isValid ? css.phoneValid : errorCustomer.phone.isInvalid ? css.phoneInvalid : null}>+63</Form.Label>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={phoneCustomer} type="text" maxLength="10" pattern="[0-9]*" value={customerPhone} placeholder='Phone Number' isInvalid={errorCustomer.phone.isInvalid} isValid={errorCustomer.phone.isValid} onChange={() => {customerchangeInput("phone")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{errorCustomer.phone.error}</Form.Control.Feedback>
                                <Form.Label>Phone Number</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.conTelephoneCustomer}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={telephoneCustomer} onKeyDown={keydownCustomerTelephone} type="text" maxLength="13" value={customerTelephone} placeholder='Telephone Number' isInvalid={errorCustomer.telephone.isInvalid} isValid={errorCustomer.telephone.isValid} onChange={() => {customerchangeInput("telephone")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{errorCustomer.telephone.error}</Form.Control.Feedback>
                                <Form.Label>Telephone Number</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.conBirthdateCustomer}`}>
                                <Form.Label>Birthday</Form.Label>
                                <Form.Control ref={birthdateCustomer} type="date" placeholder='Birthday' isInvalid={errorCustomer.birthdate.isInvalid} isValid={errorCustomer.birthdate.isValid} onChange={() => {customerchangeInput("birthdate")}} />
                                <Form.Control.Feedback className={`${css.error} ${css.errorBirthday}`} type="invalid" tooltip>{errorCustomer.birthdate.error}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.genderCustomer}`} >
                            <Form.Label>Gender</Form.Label>
                            <Form.Select type="select" ref={genderCustomer} className={css.genderCustomer} isInvalid={errorCustomer.gender.isInvalid} isValid={errorCustomer.gender.isValid} onChange={() => {customerchangeInput("gender")}} >
                                <option value="" hidden>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                            <Form.Control.Feedback className={`${css.error} ${css.errorGender}`} type="invalid" tooltip>{errorCustomer.gender.error}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.nationality}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={nationalityCustomer} type="text" placeholder='Nationality' isInvalid={errorCustomer.nationality.isInvalid} isValid={errorCustomer.nationality.isValid} onChange={() => {customerchangeInput("nationality")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{errorCustomer.nationality.error}</Form.Control.Feedback>
                                <Form.Label>Nationality</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={usernameCustomer} type="text" placeholder='Username' isInvalid={errorCustomer.username.isInvalid} isValid={errorCustomer.username.isValid} onChange={() => {customerchangeInput("username")}}/>
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{errorCustomer.username.error}</Form.Control.Feedback>
                                <Form.Label>Username</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={passwordCustomer} type="password" placeholder='Password' isInvalid={errorCustomer.password.isInvalid} isValid={errorCustomer.password.isValid} onChange={() => {customerchangeInput("password")}}/>
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{errorCustomer.password.error}</Form.Control.Feedback>
                                <Form.Label>Password</Form.Label>
                            </Form.Floating>
                        </Form.Group>
                        
                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={confirmpasswordCustomer} type="password" placeholder='Password' isInvalid={errorCustomer.confirmpassword.isInvalid} isValid={errorCustomer.confirmpassword.isValid} onChange={() => {customerchangeInput("confirmpassword")}} />
                                <Form.Control.Feedback className={css.error} type="invalid" tooltip>{errorCustomer.confirmpassword.error}</Form.Control.Feedback>
                                <Form.Label>Confirm Password</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <div id="customer-recaptcha-container" />
                        </Form.Group>

                        <div className={css.customerButton}>
                            <Button type="submit">Sign Up</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            );
    }
    const signInModal = () => {
        return (
        <Modal show={modalSignInShow} onHide={()=> {hidemodalSignIn()}} animation={true}  centered>
            <Modal.Header closeButton className={css.modalSignInHeader}>
                <div>
                    <p>Welcome Back to Resortex</p>
                    <p>Sign in to your account to continue using Resortex</p>
                </div>
            </Modal.Header>

            <Modal.Body className={css.modalSignInBody}>
                <Form onSubmit={handleSubmitSignIn}>
                    <Form.Group className={css.signInInput}> 
                        <Form.Floating>
                            <Form.Control ref={usernameSignIn} type="text" placeholder="Username" isInvalid={errorSignIn.username.isInvalid} onChange={() => {signInchangeInput("username")}} />
                            <Form.Control.Feedback type='invalid' tooltip>{errorSignIn.username.error}</Form.Control.Feedback>
                            <Form.Label>Username</Form.Label>
                        </Form.Floating>
                    </Form.Group>
                    
                    <Form.Group className={css.signInInput}>
                        <Form.Floating>
                            <Form.Control ref={passwordSignIn} type={formSignInShowPassword ? "text" : "password"} placeholder="Password" isInvalid={errorSignIn.password.isInvalid} onChange={() => {signInchangeInput("password")}} />
                            <Form.Control.Feedback type='invalid' tooltip>{errorSignIn.password.error}</Form.Control.Feedback>
                            <Form.Label>Password</Form.Label>
                        </Form.Floating>
                    </Form.Group>
                    

                    <Form.Group className={css.signInInput}>
                        <Form.Check ref={showPasswordSignIn} label="Show Password" onChange={()=>{changeShowpasswordSignIn()}} />
                    </Form.Group>
                    <div className={css.signInButton}>
                        <Button type="submit">Sign In</Button>
                    </div>
                </Form> 
            </Modal.Body>

            <Modal.Footer className={css.modalSignInFooter}>
                <p>Not a member yet? </p>
                <p>Sign Up</p>
                <a onClick={() => {customerCreateAccount()}}>Customer</a>
                <a onClick={() => {managerCreateAccount()}}>/ Manager</a>
            </Modal.Footer>
        </Modal>
        );
    }
    const customerAuth = () => {
        return(
            <Modal show={modalCustomerAuthShow} onHide={()=> {hidemodalCustomerAuth()}} animation={true}  centered>
                <Modal.Header closeButton className={css.modalSignInHeader}>
                    <div>
                        <p>Customer Phone Authentication</p>
                        <p>Verify Your Phone Number </p>
                    </div>
                </Modal.Header>

                <Modal.Body className={css.modalSignInBody}>
                        <Form onSubmit={verifyCustomerAuth}>
                            <Form.Group className={css.signInInput}> 
                                <Form.Floating>
                                    <Form.Control ref={customerAuthInputCode} type="number" placeholder="Code" isInvalid={errorCustomerAuth.isInvalid} />
                                    <Form.Control.Feedback type='invalid' tooltip>{errorCustomerAuth.error}</Form.Control.Feedback>
                                    <Form.Label>Code</Form.Label>
                                </Form.Floating>
                            </Form.Group>
                        </Form>       
                    </Modal.Body>
    
                    <Modal.Footer className={css.modalSignInFooter}>
                        <div className={css.customerAuthConBtn}>
                            <Button variant='success' onClick={verifyCustomerAuth}>Verify</Button>
                        </div>
                    </Modal.Footer>
            </Modal>
        );
    }
    return (
        <>
            <Navbar expanded={expanded} fixed='top' expand='sm' variant='dark' bg={navbar ? `light` : null} collapseOnSelect className={navbar ? `${cssNavbar[`navbar-scroll`]}` : `${cssNavbar[`navbar`]}`}>
                <Navbar.Brand>
                    <Link href='/'>
                        <a>
                            <Image src='/logo/logo.png' alt='Resortex Logo' width={60} height={60} priority />
                        </a>
                    </Link>
                </Navbar.Brand>
                <Link href='/'>
                    <a className={navbar ? `${cssNavbar[`title-scroll`]}` : `${cssNavbar[`title`]}`}>Resort Reservation</a>
                </Link>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' className='navbar-toggler' onClick={() => setExpanded(expanded ? false : "expanded")}>
                    <span className={navbar ? 'toggler-icon-scroll top-bar' : 'toggler-icon top-bar'}></span>
                    <span className={navbar ? 'toggler-icon-scroll middle-bar' : 'toggler-icon middle-bar'}></span>
                    <span className={navbar ? 'toggler-icon-scroll bottom-bar' : 'toggler-icon bottom-bar'}></span>
                </Navbar.Toggle>
                <Navbar.Collapse className='justify-content-end' id='responsive-navbar-nav'>
                    <Nav className={navbar ? 'nav-scroll' : null}>
                        <Nav.Link className={navbar ? 'navLink-scroll' : 'navLink'} onClick={() => setExpanded(false)}>
                            <Link href='/'>
                                <p className={navbar ? 'navLinkP-scroll' : 'navLinkP'}>HOME</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link className={navbar ? 'navLink-scroll' : 'navLink'} onClick={() => setExpanded(false)}>
                            <Link href='/about'>
                                <p className={navbar ? 'navLinkP-scroll' : 'navLinkP'}>ABOUT US</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link className={navbar ? 'navLink-scroll' : 'navLink'} onClick={()=> {setModalSignInShow(true);setExpanded(false);updateStateSignIn("",false,"username");updateStateSignIn("",false,"password");}}>
                            <p className={navbar ? 'navLinkP-scroll' : 'navLinkP'}>SIGN IN</p>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {signInModal()}
            {customerModal()}
            {customerAuth()}
            <Hotelmanager accountId={hotelAccountID} />
        </>
    );
}
