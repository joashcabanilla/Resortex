import cssHome from '../styles/Pages/Home.module.css'
import { Container } from 'react-bootstrap';
import Navbar from '../components/navbar.js';

export default function Home() {
  return (
    <>
      <Container fluid className={cssHome.container}>
        <Navbar />
      </Container>
    </>
  )
}
