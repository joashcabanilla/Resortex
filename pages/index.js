import cssHome from '../styles/Pages/Home.module.css'
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../components/navbar.js';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Container fluid className={cssHome.container}>
        <Row>
          <Col className={cssHome.imageCol}>
            <Navbar />
            <Image className={cssHome.imageBackground} src='/image/cover_02.png' alt='Resortex Logo' layout='fill' quality={100} priority />
          </Col>
        </Row>
      </Container>
    </>
  )
}
