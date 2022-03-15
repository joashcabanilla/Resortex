import { Navbar, Nav, Modal, Button, FloatingLabel, Form } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import cssNavbar from '../../styles/Components/Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import css from '../../styles/Components/modalSignIn.module.css';
import { getUser, getHotelManager, getAdminAccount } from '../../redux/reduxSlice/userSlice';
import { useSelector,useDispatch } from 'react-redux';
import {useRouter} from 'next/router';

export default function navbar() {
    //import variables
    const dispatch = useDispatch();
    const router = useRouter();

    //reducer state
    const stateUser = useSelector(state => state.storeUsers.userList);
    const stateHotelManagerAcct = useSelector(state => state.storeUsers.hotelManagerAcct);
    const stateAdminAccount = useSelector(state => state.storeUsers.adminList);

    //state declaration
    const [navbar, setNavbar] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [modalSignInShow, setModalSignInShow] = useState(false);
    const [modalCustomerShow, setModalCustomerShow] = useState(false);
    const [modalHotelShow, setModalHotelShow] = useState(false);
    const [formSignInShowPassword, setFormSignInShowPassword] = useState(false);
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

    //react Hooks useRef
    const usernameSignIn = useRef();
    const passwordSignIn = useRef();
    const showPasswordSignIn = useRef();

    //react Hooks use effect
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        // dispatch(getUser());
        // dispatch(getHotelManager());
        // dispatch(getAdminAccount());
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

    const changeShowpasswordSignIn = () => {
        showPasswordSignIn.current.checked ? setFormSignInShowPassword(true) : setFormSignInShowPassword(false);
    }

    //event handlers functions
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
        
        Object.values(stateAdminAccount).forEach(value => {
            let datausername = value['USERNAME'];
            let datapassword = value['PASSWORD'];
            let id = value['ID'];
            signInAcct.push({username: datausername, password: datapassword, type: "admin", id: id});
        });

        
        Object.values(stateHotelManagerAcct).forEach(value => {
            let datausername = value['USERNAME'];
            let datapassword = value['PASSWORD'];
            let id = value['ID'];
            signInAcct.push({username: datausername, password: datapassword, type: "manager", id: id});
        });

        Object.values(stateUser).forEach(value => {
            let datausername = value['ACCOUNT-USERNAME'];
            let datapassword = value['ACCOUNT-PASSWORD'];
            let id = value['ACCOUNT-ID NUMBER'];
            signInAcct.push({username: datausername, password: datapassword, type: "user", id: id});
        });

        
        signInAcct.forEach((value) => {
            if(value.username == username) validatedUsername = true;    
            if(value.password == password) validatedPassword = true;
            if(value.username == username && value.password == password){
                type = value.type;
                id = value.id;
            }
        });

        validatedUsername = true;
        validatedPassword = true;
        type="admin";
        id="admin";

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
            type == "admin" ? setRouterLogin(type, id) : null;
            type == "manager" ? setRouterLogin(type, id) : null;
            type == "user" ? setRouterLogin(type, id) : null;
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
    
    //components
    const customerModal = () => {
        return (
            <Modal show={modalCustomerShow} onHide={()=> setModalCustomerShow(false)} animation={true}  centered>
                <Modal.Header closeButton className={css.modalCustomerHeader}>
                    <p>CUSTOMER</p>
                </Modal.Header>
    
                <Modal.Body>
                </Modal.Body>
    
                <Modal.Footer className={css.modalCustomerFooter}>
                </Modal.Footer>
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
                    <Form.Group controlId='signInUsernameValidation'>
                        <Form.Floating>
                            <Form.Control ref={usernameSignIn} type="text" placeholder="Username" isInvalid={errorSignIn.username.isInvalid} />
                            <Form.Control.Feedback type='invalid' tooltip>{errorSignIn.username.error}</Form.Control.Feedback>
                            <Form.Label>Username</Form.Label>
                        </Form.Floating>
                    </Form.Group>
                    
                    <Form.Group controlId='signInPasswordValidation'>
                        <Form.Floating>
                            <Form.Control ref={passwordSignIn} type={formSignInShowPassword ? "text" : "password"} placeholder="Password" isInvalid={errorSignIn.password.isInvalid} />
                            <Form.Control.Feedback type='invalid' tooltip>{errorSignIn.password.error}</Form.Control.Feedback>
                            <Form.Label>Password</Form.Label>
                        </Form.Floating>
                    </Form.Group>
                    
                    <Form.Group controlId='signInShowPassword'>
                        <Form.Check ref={showPasswordSignIn} label="Show Password" onChange={()=>{changeShowpasswordSignIn()}} />
                    </Form.Group>

                    <Button type="submit">Sign In</Button>
                </Form> 
            </Modal.Body>

            <Modal.Footer className={css.modalSignInFooter}>
                {/* <Button onClick={() => {setModalSignInShow(false); setModalCustomerShow(true);}}>CREATE ACCOUNT AS CUSTOMER</Button>
                <Button onClick={() => {setModalSignInShow(false); setModalHotelShow(true);}}>CREATE ACCOUNT AS HOTEL OWNER</Button> */}
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
