import 'bootstrap/dist/css/bootstrap.min.css';
import * as reactBoostrap from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function navbar() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <reactBoostrap.Navbar sticky="top" expand="sm" collapseOnSelect>
                <reactBoostrap.Navbar.Brand>
                    <Link href="/">
                        <a>
                            <Image src="/logo/resortex_02.png" alt="Resortex Logo" width={70} height={70} />
                        </a>
                    </Link>
                </reactBoostrap.Navbar.Brand>
                <p>Resort Reservation</p>
                <reactBoostrap.Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <reactBoostrap.Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
                    <reactBoostrap.Nav>
                        <reactBoostrap.Nav.Link>
                            <Link href="/">
                                <p>HOME</p>
                            </Link>
                        </reactBoostrap.Nav.Link>
                        <reactBoostrap.Nav.Link>
                            <Link href="/about">
                                <p>ABOUT US</p>
                            </Link>
                        </reactBoostrap.Nav.Link>
                        <reactBoostrap.Nav.Link>
                            <Link href="/contact">
                                <p>CONTACT US</p>
                            </Link>
                        </reactBoostrap.Nav.Link>
                        <reactBoostrap.Nav.Link>
                            <reactBoostrap.Button variant="primary" onClick={handleShow}>
                                REGISTER
                            </reactBoostrap.Button>

                            <reactBoostrap.Modal show={show} onHide={handleClose}>
                                <reactBoostrap.Modal.Header closeButton>
                                    <reactBoostrap.Modal.Title>Modal heading</reactBoostrap.Modal.Title>
                                </reactBoostrap.Modal.Header>
                                <reactBoostrap.Modal.Body>Woohoo, you're reading this text in a modal!</reactBoostrap.Modal.Body>
                                <reactBoostrap.Modal.Footer>
                                    <reactBoostrap.Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </reactBoostrap.Button>
                                    <reactBoostrap.Button variant="primary" onClick={handleClose}>
                                        Save Changes
                                    </reactBoostrap.Button>
                                </reactBoostrap.Modal.Footer>
                            </reactBoostrap.Modal>
                        </reactBoostrap.Nav.Link>
                        <reactBoostrap.Nav.Link>
                            LOGIN
                        </reactBoostrap.Nav.Link>
                    </reactBoostrap.Nav>
                </reactBoostrap.Navbar.Collapse>
            </reactBoostrap.Navbar>
        </>
    );
}
