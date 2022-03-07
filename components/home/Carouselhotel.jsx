import css from '../../styles/Components/carouselHotel.module.css'
import { Row } from 'react-bootstrap';
import Slider from "react-slick";
import {FaArrowRight, FaArrowLeft} from 'react-icons/fa';
import { useState } from 'react';

export default function Carouselhotel({hotel}) {
    
    //state management
    const [imageIndex,setimageIndex] = useState(0);

    //ARRAY MANIPULATION
    //hotel sort by rating
    hotel.sort((a,b) => {return b['RATING-USER RATING'] - a['RATING-USER RATING']});
    let imageHotel = hotel.map(value => value['HOTEL-COVER']);

    //event handler
    const NextArrow = ({onClick}) => {
        return (
            <div className='arrow next' onClick={onClick}>
                <FaArrowRight />
            </div>
        )
    }
    const PrevArrow = ({onClick}) => {
        return (
            <div className='arrow prev' onClick={onClick}>
                <FaArrowLeft />
            </div>
        )
    }

    //variable initialization
    const settingSlider = {
        infinite: true,
        LazyLoad: true,
        speed: 300,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: 0,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    //Components
    const topHotel = () => {
        return imageHotel.map((value,index) => (
            <div className={index === imageIndex ? "slide activeSlide" : "slide"} key={index}>
                    <img src={`data:image/jpeg;base64,${value}`} alt={index} />
            </div>
            
        )); 
    } 

    return (
    <Row className={css.containerPopular}>
        <h1 className={css.textPopular}>POPULAR PLACES</h1>
        <div className={css.carouselPopular}>
            <Slider {...settingSlider}>
                {topHotel()}
            </Slider>
        </div>
    </Row>
    );
}