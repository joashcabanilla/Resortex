import cssHome from '../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as reactBoostrap from 'react-bootstrap';
import Navbar from '../components/navbar.js';

export default function Home() {
  return (
    <>
      <reactBoostrap.Container fluid className={cssHome.container}>
        <Navbar />
      </reactBoostrap.Container>
    </>
  )
}
