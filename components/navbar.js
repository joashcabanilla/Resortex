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
            <Navbar fixed='top' expand='sm' collapseOnSelect className={navbar ? `${cssNavbar[`navbar-scroll`]}` : `${cssNavbar[`navbar`]}`}>
                <Navbar.Brand>
                    <Link href='/'>
                        <a>
                            <Image src='/logo/resortex_02.png' alt='Resortex Logo' width={65} height={65} priority />
                        </a>
                    </Link>
                </Navbar.Brand>
                <Link href='/'>
                    <a className={cssNavbar.title}>Resort Reservation</a>
                </Link>
                <Navbar.Toggle aria-controls='responsive-navbar-nav' className='navbar-toggler'>
                    <span className='toggler-icon top-bar'></span>
                    <span className='toggler-icon middle-bar'></span>
                    <span className='toggler-icon bottom-bar'></span>
                </Navbar.Toggle>
                <Navbar.Collapse className='justify-content-end' id='responsive-navbar-nav'>
                    <Nav>
                        <Nav.Link>
                            <Link href='/'>
                                <p>HOME</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link href='/about'>
                                <p>ABOUT US</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link href='/contact'>
                                <p>CONTACT US</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <p>SIGN IN</p>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
