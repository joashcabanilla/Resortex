import { Navbar, Nav } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import cssNavbar from '../styles/Components/Navbar.module.css';
import React, { useState, useEffect } from 'react';

export default function navbar() {
    const [navbar, setNavbar] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
    }, []);

    const onScroll = () => {
        window.scrollY >= 100 ? setNavbar(true) : setNavbar(false);
    }

    return (
        <>
            <Navbar fixed='top' expand='sm' variant='dark' bg={navbar ? `light` : null} collapseOnSelect className={navbar ? `${cssNavbar[`navbar-scroll`]}` : `${cssNavbar[`navbar`]}`}>
                <Navbar.Brand>
                    <Link href='/'>
                        <a>
                            <Image src='/logo/resortex_02.png' alt='Resortex Logo' width={60} height={60} priority />
                        </a>
                    </Link>
                </Navbar.Brand>
                <Link href='/'>
                    <a className={navbar ? `${cssNavbar[`title-scroll`]}` : `${cssNavbar[`title`]}`}>Resort Reservation</a>
                </Link>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' className='navbar-toggler'>
                    <span className={navbar ? 'toggler-icon-scroll top-bar' : 'toggler-icon top-bar'}></span>
                    <span className={navbar ? 'toggler-icon-scroll middle-bar' : 'toggler-icon middle-bar'}></span>
                    <span className={navbar ? 'toggler-icon-scroll bottom-bar' : 'toggler-icon bottom-bar'}></span>
                </Navbar.Toggle>
                <Navbar.Collapse className='justify-content-end' id='responsive-navbar-nav'>
                    <Nav className={navbar ? 'nav-scroll' : null}>
                        <Nav.Link className={navbar ? 'navLink-scroll' : 'navLink'}>
                            <Link href='/'>
                                <p className={navbar ? 'navLinkP-scroll' : 'navLinkP'}>HOME</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link className={navbar ? 'navLink-scroll' : 'navLink'}>
                            <Link href='/about'>
                                <p className={navbar ? 'navLinkP-scroll' : 'navLinkP'}>ABOUT US</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link className={navbar ? 'navLink-scroll' : 'navLink'}>
                            <Link href='/contact'>
                                <p className={navbar ? 'navLinkP-scroll' : 'navLinkP'}>CONTACT US</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link className={navbar ? 'navLink-scroll' : 'navLink'}>
                            <p className={navbar ? 'navLinkP-scroll' : 'navLinkP'}>SIGN IN</p>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
