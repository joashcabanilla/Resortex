import css from '../../styles/Components/carouselHotel.module.css'
import Slider from "react-slick";
import {FaArrowRight, FaArrowLeft,FaStar} from 'react-icons/fa';
import { useState } from 'react';
import {Button} from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Carouselhotel({hotel}) {
    //import variable
    const mySwal = withReactContent(Swal);

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

    const clickBookNow = () => {
        mySwal.fire({
            icon: 'error',
            title: <p className={css.swalText}>PLEASE DOWNLOAD THE APP TO CONTINUE...</p>,
            customClass:{
              confirmButton: `${css.swalButton}`,
            }
          });
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
        return rank <= 5 ? (
            <div className={index === imageIndex ? "slide activeSlide" : "slide"} key={index}>
                <img src={`data:image/jpeg;base64,${cover}`} alt={index} />
                <div className={index === imageIndex ? `${css['conActiveSlide']}` : `${css['conSlide']}`}>
                    <p>{`${name}`}</p>
                    <div className={css.slideHotelRanking}>
                        <p>{`${ranking}`}</p>
                        {starRanking(ranking)}  
                    </div>
                    <Button variant='info' className={css.slidebtn} onClick={() => {clickBookNow()}}>BOOK NOW</Button>
                </div>    
            </div>
            ) : null;
        }); 
    } 

    const topRecommend = () => {
        let rank = 0;
        return hotel.map((value,index) => {
            let room1 = value['VIEW-ROOM GALLERY']['ROOM-01'];
            let room2 = value['VIEW-ROOM GALLERY']['ROOM-02'];
            let name = value['HOTEL-NAME'];
            rank++; 
            return rank <= 5 ? (
                <div key={`room1-${index}`} className={css.conCard}>
                    <div className={css.cardRecommend}>
                        <img src={`data:image/jpeg;base64,${room1}`} alt={index} />
                        <div className={css.concardHotelName}>
                            <p>{`${name}`}</p>
                        </div>
                    </div>
                    <div className={css.cardRecommend}>
                        <img src={`data:image/jpeg;base64,${room2}`} alt={index}/>
                        <div className={css.concardHotelName}>
                            <p>{`${name}`}</p>
                        </div>
                    </div>
                </div>
            ) : null;
        });

    }

    return (
    <div className={css.containerPopular}>
        <h1 className={css.textPopular}>Best and Popular Places</h1>
        <div className={css.carouselPopular}>
            <Slider {...settingSlider}>
                {topHotel()}
            </Slider>
        </div>
        <h1 className={css.textRecommend}>Best View for Popular Resort</h1>
        <div className={css.Recommendation}>
            {topRecommend()}
        </div>
    </div>
    );
}