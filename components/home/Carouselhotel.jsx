import css from '../../styles/Components/carouselHotel.module.css'
import Slider from "react-slick";
import {FaArrowRight, FaArrowLeft,FaStar} from 'react-icons/fa';
import { useState } from 'react';
import {Button} from 'react-bootstrap';
import {useRouter} from 'next/router';

export default function Carouselhotel({hotel}) {
    //import variable
    const router = useRouter();

    //state management
    const [imageIndex,setimageIndex] = useState(0);

    //ARRAY MANIPULATION
    //hotel sort by rating
    hotel.sort((a,b) => {return b['RATING-USER RATING'] - a['RATING-USER RATING']});

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
        beforeChange: (current,next) => setimageIndex(next),
    };

    //Components
    const topHotel = () => {
        let rank = 0;
        const starRanking = ranking => {
            let newRanking = Math.floor(ranking);
            switch(newRanking){
                case 1:
                    return (<FaStar />);
                    break;
                case 2:
                    return (
                        <>
                            <FaStar /><FaStar />
                        </>);
                    break;
                case 3:
                    return (
                        <>
                            <FaStar /><FaStar /><FaStar />
                        </>);
                    break;
                case 4:
                    return (
                        <>
                            <FaStar /><FaStar /><FaStar /><FaStar />
                        </>);
                    break;
                case 5:
                    return (
                        <>
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </>);
                    break;
            } 
        }
        return hotel.map((value,index) => {
            let name = value['HOTEL-NAME'];
            let cover = value['HOTEL-COVER'];
            let ranking = value['RATING-USER RATING'];
            let hotelReferenceNo = value['HOTEL-REFERENCE NUMBER'];
            rank++;
            console.log(value);
        return rank <= 5 ? (
            <div className={index === imageIndex ? "slide activeSlide" : "slide"} key={index}>
                <img src={`data:image/jpeg;base64,${cover}`} alt={index} />
                <div className={index === imageIndex ? `${css['conActiveSlide']}` : `${css['conSlide']}`}>
                    <p>{`${name}`}</p>
                    <div className={css.slideHotelRanking}>
                        <p>{`${ranking}`}</p>
                        {starRanking(ranking)}  
                    </div>
                    <Button variant='info' className={css.slidebtn} onClick={() => {router.push(`hotel/${hotelReferenceNo}`)}}>VIEW</Button>
                </div>    
            </div>
            ) : null;
        }); 
    } 

    return (
    <div className={css.containerPopular}>
        <h1 className={css.textPopular}>POPULAR PLACES</h1>
        <div className={css.carouselPopular}>
            <Slider {...settingSlider}>
                {topHotel()}
            </Slider>
        </div>
    </div>
    );
}