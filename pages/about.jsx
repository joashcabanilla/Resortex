import { Container, Row, Col } from "react-bootstrap";
import Navbar from "../components/home/navbar";
import cssHome from '../styles/Pages/Home.module.css'
import Image from 'next/image';
import css from '../styles/Pages/about.module.css';
import {BsGift, BsHeart, BsWallet2} from 'react-icons/bs';
import {useRouter} from 'next/router';
import { useEffect } from "react";
import cookie from 'cookie';

export async function getServerSideProps({req, res}){
    const mycookie = cookie.parse((req && req.headers.cookie) || "");
    const type = mycookie.type;
    const id = mycookie.id;
    if(type != undefined){
        if(type == "user"){
            return {
              redirect: {
                destination: `/${type}`,
                permanent: false,
              }
            };
          }
          else{
            return {
              redirect: {
                destination: `${type}/${id}`,
                permanent: false,
              }
            };
          }
    }
    return {
      props: {}
    };
}
  
export default function About(){
    //import variables
    const router = useRouter();

    useEffect( ()=> {
    },[]);

    return (
        <Container fluid>
            <Navbar />
            <Row>
                <Col className={cssHome.imageCol}>
                    <Image className={cssHome.imageBackground} src='/image/cover_02.png' alt='Resortex Logo' layout='fill' quality={100} priority />
                </Col>
                <div className={`${cssHome.divTagline} ${css.conTitle}`}>
                    <h1>About Us</h1>
                    <p>The art of meeting your highest expectations.</p>
                </div>
            </Row>
            <Row>
                <div className={css.conWelcome}> 
                    <p>Welcome To Our</p>
                    <p>Humble Beginnings</p>
                </div>
                <p className={css.welcomeText}>Resortex is a technology resort and property management aggregator company aiming to empower tourism in the Philippines by partnering with local hotels and resort owners by offering quality and affordable three-star accommodation at a fraction of a cost. From overnight stays to long weekends, enjoy the scent of salty sea air and the comfort of a cozy beach haven paradise.</p>
            </Row>
            <Row className={css.lastrow}>
                <div className={css.conWelcome}>
                    <p>Why</p>
                    <p>Choose Us?</p>
                </div>
                <div className={css.conChooseUs}>
                    <div className={css.conFind}>
                        <BsGift />
                        <p>We ﬁnd better deals</p>
                        <p>We are always curating ways to help our guests make the most out of their trip by providing flexible payment methods.</p>
                    </div>
                    <div className={css.conFind}>
                        <BsHeart />
                        <p>Travellers love us</p>
                        <p>Helpful meta-reviews and travel sentiments from other travelers just like you.</p>
                    </div>
                    <div className={css.conFind}>
                        <BsGift />
                        <p>Events Program</p>
                        <p>May it be a wedding, birthday, business seminar, and more. We provide tailor-made solutions to help set up your ideals.</p>
                    </div>
                    <div className={css.conFind}>
                        <BsWallet2 />
                        <p>Best Price Guaranteed</p>
                        <p>Carefully studied by our analysts, we always ensure that our rate meets customer demand.</p>
                    </div>
                </div>    
            </Row>
        </Container>
    );
}