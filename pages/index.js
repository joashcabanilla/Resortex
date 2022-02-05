import cssHome from '../styles/Pages/Home.module.css'
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../components/navbar';
import Search from '../components/search';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Container fluid>
        <Navbar />
        <Row>
          <Col className={cssHome.imageCol}>
            <Image className={cssHome.imageBackground} src='/image/cover_02.png' alt='Resortex Logo' layout='fill' quality={100} priority />
          </Col>
        </Row>
        <Search />
      </Container>
    </>
  )
}
