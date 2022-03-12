import { Navbar, Nav, Modal, Button, FloatingLabel, Form } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import cssNavbar from '../../styles/Components/Navbar.module.css';
import { useState, useEffect, useRef } from 'react';
import css from '../../styles/Components/modalSignIn.module.css';

export default function navbar() {
    //state declaration
    const [navbar, setNavbar] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [modalSignInShow,setModalSignInShow] = useState(false);
    const [modalCustomerShow,setModalCustomerShow] = useState(false);
    const [modalHotelShow,setModalHotelShow] = useState(false);

    //react Hooks useRef
    const usernameSignIn = useRef(null);

    //react Hooks use effect
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
    }, []);

    const onScroll = () => {
        window.scrollY >= 100 ? setNavbar(true) : setNavbar(false);
    }

    //event handlers functions
    //sign in form submit
    const handleSubmitSignIn = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        let username = usernameSignIn.current.value;

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
        <Modal show={modalSignInShow} onHide={()=> setModalSignInShow(false)} animation={true}  centered>
            <Modal.Header closeButton className={css.modalSignInHeader}>
                <div>
                    <p>Welcome Back to Resortex</p>
                    <p>Sign in to your account to continue using Resortex</p>
                </div>
            </Modal.Header>

            <Modal.Body className={css.modalSignInBody}>
                <Form noValidate onSubmit={handleSubmitSignIn}>
                    <Form.Group controlId='signInUsernameValidation'>
                        <Form.Floating>
                            <Form.Control ref={usernameSignIn} type="text" placeholder="Username" required isInvalid={true} />
                            <label htmlFor="signInUsernameValidation">Username</label>
                        </Form.Floating>
                        <Form.Control.Feedback tooltip type='invalid'>Please choose a username.</Form.Control.Feedback>
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
