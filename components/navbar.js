import 'bootstrap/dist/css/bootstrap.min.css';
import * as reactBoostrap from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

export default function navbar() {
    return (
        <>
            <reactBoostrap.Navbar fixed="top" expand="sm" collapseOnSelect>
                <reactBoostrap.Navbar.Brand>
                    <Link href="/">
                        <a><Image src="/logo/resortex_02.png" alt="Resortex Logo" width={80} height={80} /></a>
                    </Link>
                </reactBoostrap.Navbar.Brand>

                <reactBoostrap.Navbar.Toggle />
                <reactBoostrap.Navbar.Collapse>
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
                    </reactBoostrap.Nav>
                </reactBoostrap.Navbar.Collapse>
            </reactBoostrap.Navbar>
        </>
    );
}
