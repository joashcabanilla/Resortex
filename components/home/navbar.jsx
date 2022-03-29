import { Navbar, Nav, Modal, Button, FloatingLabel, Form } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import cssNavbar from '../../styles/Components/Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import css from '../../styles/Components/modalSignIn.module.css';
import {getUser,getHotelManager} from '../../redux/reduxSlice/userSlice';
import { useSelector,useDispatch } from 'react-redux';
import {useRouter} from 'next/router';

export default function navbar() {
    //import variables
    const dispatch = useDispatch();
    const router = useRouter();

    //reducer state
    const stateHotelManagerAcct = useSelector(state => state.storeUsers.hotelManagerAcct);
    const stateUser = useSelector(state => state.storeUsers.userList);

    //state declaration
    const [navbar, setNavbar] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [modalSignInShow, setModalSignInShow] = useState(false);
    const [modalCustomerShow, setModalCustomerShow] = useState(false);
    const [modalHotelShow, setModalHotelShow] = useState(false);
    const [formSignInShowPassword, setFormSignInShowPassword] = useState(false);
    const [uploadProfile, setUploadProfile] = useState("");
    const [customerAccountID, setCustomerAccountID] = useState("");
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
        }
    });

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


    //react Hooks use effect
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        // dispatch(getUser());
        // dispatch(getHotelManager());
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

    const hidemodalCustomer = () => {
        setModalCustomerShow(false);
        setUploadProfile("");
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
        setModalHotelShow(true);
    }
    //event handlers functions
    const changeProfilePic = () => {
        let profilepic = profilePicCustomer.current.value;
        let srcProfile = profilepic != "" ? URL.createObjectURL(profilePicCustomer.current.files[0]) : "";  
        srcProfile != "" ? setUploadProfile(srcProfile) : setUploadProfile("");
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
            router.replace(`${type}/${id}`);
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

    //sign in form username and password onchage
    const signInchangeInput = (input) => {
        
        input == "username" ? updateStateSignIn("",false,"username") : updateStateSignIn("",false,"password");
    }


    //customer form submit
    const handleSubmitCustomer = (e) => {
        e.preventDefault();
        let firstname = firstnameCustomer.current.value;
        console.log(firstname);
    }

    //components
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
                            <Form.Control type="file" ref={profilePicCustomer} onChange={()=>{changeProfilePic()}}/>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.conAccountIDCustomer}`}>
                            <Form.Control type="text" disabled value={`ACCOUNT ID:  ${customerAccountID}`} readOnly />
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={firstnameCustomer} type="text" placeholder='First Name' isInvalid={errorCustomer.firstname.isInvalid} isValid={errorCustomer.firstname.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.firstname.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.firstname.error}</Form.Control.Feedback>
                                <Form.Label>First Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={middlenameCustomer} type="text" placeholder='Middle Name' isInvalid={errorCustomer.middlename.isInvalid} isValid={errorCustomer.middlename.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.middlename.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.middlename.error}</Form.Control.Feedback>
                                <Form.Label>Middle Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.name}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={lastnameCustomer} type="text" placeholder='Last Name' isInvalid={errorCustomer.lastname.isInvalid} isValid={errorCustomer.lastname.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.lastname.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.lastname.error}</Form.Control.Feedback>
                                <Form.Label>Last Name</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.address}`}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={addressCustomer} type="text" placeholder='Address' isInvalid={errorCustomer.address.isInvalid} isValid={errorCustomer.address.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.address.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.address.error}</Form.Control.Feedback>
                                <Form.Label>Address</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.conPhoneCustomer}`}>
                            <Form.Label>+63</Form.Label>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={phoneCustomer} type="number" placeholder='Phone Number' isInvalid={errorCustomer.phone.isInvalid} isValid={errorCustomer.phone.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.phone.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.phone.error}</Form.Control.Feedback>
                                <Form.Label>Phone Number</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={telephoneCustomer} type="number" placeholder='Telephone Number' isInvalid={errorCustomer.telephone.isInvalid} isValid={errorCustomer.telephone.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.telephone.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.telephone.error}</Form.Control.Feedback>
                                <Form.Label>Telephone Number</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.conBirthdateCustomer}`}>
                                <Form.Label>Birth Date</Form.Label>
                                <Form.Control ref={birthdateCustomer} type="date" placeholder='Birth Date' isInvalid={errorCustomer.birthdate.isInvalid} isValid={errorCustomer.birthdate.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.birthdate.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.birthdate.error}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className={`${css.customerInput} ${css.genderCustomer}`}>
                            <Form.Label>Gender</Form.Label>
                            <Form.Select ref={genderCustomer} className={css.genderCustomer}>
                                <option value="MALE">MALE</option>
                                <option value="FEMALE">FEMALE</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={nationalityCustomer} type="text" placeholder='Nationality' isInvalid={errorCustomer.nationality.isInvalid} isValid={errorCustomer.nationality.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.nationality.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.nationality.error}</Form.Control.Feedback>
                                <Form.Label>Nationality</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={usernameCustomer} type="text" placeholder='Username' isInvalid={errorCustomer.username.isInvalid} isValid={errorCustomer.username.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.username.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.username.error}</Form.Control.Feedback>
                                <Form.Label>Username</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={passwordCustomer} type="password" placeholder='Password' isInvalid={errorCustomer.password.isInvalid} isValid={errorCustomer.password.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.password.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.password.error}</Form.Control.Feedback>
                                <Form.Label>Password</Form.Label>
                            </Form.Floating>
                        </Form.Group>
                        
                        <Form.Group className={css.customerInput}>
                            <Form.Floating className={css.customerFloating}>
                                <Form.Control ref={confirmpasswordCustomer} type="password" placeholder='Password' isInvalid={errorCustomer.confirmpassword.isInvalid} isValid={errorCustomer.confirmpassword.isValid} />
                                <Form.Control.Feedback type="invalid" tooltip>{errorCustomer.confirmpassword.error}</Form.Control.Feedback>
                                <Form.Control.Feedback type="valid" tooltip>{errorCustomer.confirmpassword.error}</Form.Control.Feedback>
                                <Form.Label>Confirm Password</Form.Label>
                            </Form.Floating>
                        </Form.Group>

                        <div className={css.customerButton}>
                            <Button type="submit">Sign Up</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            );
    }
    const hotelModal = () => {
        return(
            <Modal show={modalHotelShow} onHide={()=> setModalHotelShow(false)} animation={true}  centered>
                <Modal.Header closeButton className={css.modalHotelHeader}>
                    <p>HOTEL</p>
                </Modal.Header>
    
                <Modal.Body>
                </Modal.Body>
    
                <Modal.Footer className={css.modalHotelFooter}>
                </Modal.Footer>
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
                        <Nav.Link className={navbar ? 'navLink-scroll' : 'navLink'} onClick={()=> {setModalSignInShow(true); setExpanded(false);}}>
                            <p className={navbar ? 'navLinkP-scroll' : 'navLinkP'}>SIGN IN</p>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            {signInModal()}
            {customerModal()}
            {hotelModal()}
        </>
    );
}
