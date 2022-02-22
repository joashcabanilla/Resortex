import cssHome from '../styles/Pages/Home.module.css'
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../components/home/navbar';
import Image from 'next/image';
import { useSelector,useDispatch } from 'react-redux';
import { getHotelData } from '../redux/reduxSlice/hotelSlice';
import { useEffect } from 'react';

export default function Home() {
  const dispatch = useDispatch();
  console.log(useSelector(state => state.storeHotel));
  
  useEffect(() => {
    dispatch(getHotelData());
  },[]);

  return (
    <>
      <Container fluid>
        <Navbar />
        <Row>
          <Col className={cssHome.imageCol}>
            <Image className={cssHome.imageBackground} src='/image/cover_02.png' alt='Resortex Logo' layout='fill' quality={100} priority />
          </Col>
          <div className={cssHome.divTagline}>
            <h1>It’s not just a hotel,</h1>
            <h1>it’s a way of life.</h1>
            <p>The art of meeting your highest expectations.</p>
          </div>
          <div className={cssHome.divSearch}>
          </div>
        </Row>
      </Container>
    </>
  )
}
