import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Outlet } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartSimple, faMap } from '@fortawesome/free-solid-svg-icons';
import Banner from '@/components/Banner';


const Header = () => {
    return (
        <>
            <Banner />
            <Navbar sticky='top' expand="lg" bg="dark" variant="dark" className="shadow-lg px-3">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <FontAwesomeIcon icon={faMap} className="me-2" />
                        Mountain Trails
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/">
                                <FontAwesomeIcon icon={faMap} className="me-1" />
                                Mapa
                            </Nav.Link>
                            <Nav.Link as={Link} to="/stats">
                                <FontAwesomeIcon icon={faChartSimple} className="me-1" />
                                Statystyki
                            </Nav.Link>                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet/>
        </>
    );
};

export default Header;
