import cssHome from '../styles/Pages/Home.module.css'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Navbar from '../components/home/navbar';
import Image from 'next/image';
import { useSelector,useDispatch } from 'react-redux';
import { useEffect,useState, Fragment } from 'react';
import { getHotel } from '../redux/reduxSlice/hotelSlice';
import { Typeahead } from 'react-bootstrap-typeahead';
import {BiSearchAlt2} from 'react-icons/bi';

export default function Home() {
  const dispatch = useDispatch();
  const [singleSelections, setSingleSelections] = useState([]);
  let searchOption  = [];
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
        <div className={cssHome.containerSearch}>
          <div className={cssHome.containerInputSearch}>
          <Fragment>
                <Form.Group>  
                  <Typeahead
                    clearButton
                    id="basic-typeahead-single"
                    onChange={setSingleSelections}
                    options={searchOption}
                    placeholder="Search Resort..."
                    selected={singleSelections}
                    size='lg'
                    labelKey="name"
                    filterBy={['name','location']}
                    renderMenuItemChildren = {
                      (option) => (
                        <div>
                          {option.name}
                        <div>
                          <small>Location: {option.location}</small>
                        </div>
                      </div>
                      )
                    }
                  />
                </Form.Group>
          </Fragment>
          </div>
          <div className={cssHome.containerButton}>
            <Button size="lg" variant="success" className={cssHome.bsButton}>
                <BiSearchAlt2 size = '2rem'/>
            </Button> 
          </div>
        </div>
      </Container>
    </>
  )
}
