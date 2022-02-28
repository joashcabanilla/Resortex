import css from '../../styles/Components/carouselHotel.module.css'
import { Row, Button, Carousel } from 'react-bootstrap';

export default function Carouselhotel({hotel}) {
  console.log(hotel);

    return (
    <Row className={css.containerPopular}>
        <h1 className={css.textPopular}>POPULAR PLACES</h1>
        <div className={css.carouselPopular}>
          <Carousel fade>
            <Carousel.Item>
                <img className="d-block w-100" src="https://cf.bstatic.com/xdata/images/hotel/max1280x900/201898141.jpg?k=4d46abb08b9f5374d01920238b9914093b5d785d29ca1edf16948b8c095a72f2&o=&hp=1" alt="TOP 1 RESORT" />
                <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    <Button>VISIT</Button>
                </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
    </Row>
    );
}