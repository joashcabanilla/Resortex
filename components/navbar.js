import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import cssNavbar from '../styles/Components/Navbar.module.css';

export default function navbar() {
    return (
        <>
            <Navbar sticky="top" expand="sm" collapseOnSelect>
                <Navbar.Brand>
                    <Link href="/">
                        <a>
                            <Image src="/logo/resortex_02.png" alt="Resortex Logo" width={65} height={65} />
                        </a>
                    </Link>
                </Navbar.Brand>
                <p className={cssNavbar.title}>Resort Reservation</p>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" className={cssNavbar.toggler}>
                    <span className={`${cssNavbar[`toggler-icon`]} ${cssNavbar[`top-bar`]}`}></span>
                    <span className={`${cssNavbar[`toggler-icon`]} ${cssNavbar[`middle-bar`]}`}></span>
                    <span className={`${cssNavbar[`toggler-icon`]} ${cssNavbar[`bottom-bar`]}`}></span>
                </Navbar.Toggle>
                <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
                    <Nav>
                        <Nav.Link>
                            <Link href="/">
                                <p>HOME</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link href="/about">
                                <p>ABOUT US</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link href="/contact">
                                <p>CONTACT US</p>
                            </Link>
                        </Nav.Link>
                        <Nav.Link>
                            REGISTER
                        </Nav.Link>
                        <Nav.Link>
                            LOGIN
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
