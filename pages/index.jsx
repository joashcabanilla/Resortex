import cssHome from '../styles/Pages/Home.module.css'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Navbar from '../components/home/navbar';
import Image from 'next/image';
import { useSelector,useDispatch } from 'react-redux';
import { useEffect,useState, Fragment } from 'react';
import { getHotel } from '../redux/reduxSlice/hotelSlice';
import { Typeahead } from 'react-bootstrap-typeahead';

export default function Home() {
  const dispatch = useDispatch();
  const [singleSelections, setSingleSelections] = useState([]);
  let hotel = ["joash", "joash cabanilla", "joas"];
  useEffect(() => {
    // dispatch(getHotel());
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
        </Row>
        <div>
          <div>
          <Fragment>
                <Form.Group>
                  <Typeahead
                    clearButton
                    id="basic-typeahead-single"
                    onChange={setSingleSelections}
                    options={hotel}
                    placeholder="Search Resort..."
                    selected={singleSelections}
                    size={'lg'}
                  />
                </Form.Group>
          </Fragment>
          </div>
          <div>
            <Button size="lg" variant="success"></Button>
          </div>
        </div>
      </Container>
    </>
  )
}
