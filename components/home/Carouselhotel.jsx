import css from '../../styles/Components/carouselHotel.module.css'
import { Row } from 'react-bootstrap';
import Slider from "react-slick";

export default function Carouselhotel({hotel}) {
    //hotel sort by rating
    hotel.sort((a,b) => {return b['RATING-USER RATING'] - a['RATING-USER RATING']});
    let imageHotel = hotel.map(value => value['HOTEL-COVER']);
    
    //Components
    const topHotel = () => {
    //   return imageHotel.map(value => <img src={`data:image/jpeg;base64,${value}`}/>); 
    } 

    return (
    <Row className={css.containerPopular}>
        <h1 className={css.textPopular}>POPULAR PLACES</h1>
        <div className={css.carouselPopular}>
            {topHotel()}
        </div>
    </Row>
    );
}