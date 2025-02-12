import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Outlet } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faMap, faUser, faPersonHiking } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Banner from '@/components/Banner';
import { post } from '@/utils/httpHelper';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/authContext';

const Header = () => {
    const [nick, setNick] = useState<string>('');
    const [password, setPassword] = useState<string>('');    
    const { isAuthenticated, login, logout } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await post('/user/login', { nick, password });
            const { token } = response;
            login(token);
        } catch (error: any) {            
            toast.error(error.message);
        }
    };

    return (
        <>
            <Banner />
            <Navbar sticky='top' expand="lg" bg="dark" variant="dark" className="shadow-lg px-3">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <FontAwesomeIcon icon={faPersonHiking} className="me-2" />
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
                            <Nav.Link as={Link} to="/register">
                                <FontAwesomeIcon icon={faUser} className="me-1" />
                                Rejestracja
                            </Nav.Link>
                        </Nav>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary">
                                {isAuthenticated ? 'Profil' : 'Zaloguj się'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant={'dark'} style={{ width: '300px' }}>
                                {!isAuthenticated ? (
                                    <div className="p-3">                                        
                                        <Form onSubmit={handleLogin} className="w-100">
                                            <div className="row">
                                                <div className="col-12">
                                                    <Form.Group controlId="nickname" className="mb-3">
                                                        <Form.Label>Nickname</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={nick}
                                                            onChange={(e) => setNick(e.target.value)}
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <Form.Group controlId="password" className="mb-3">
                                                        <Form.Label>Hasło</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <Button variant="primary" type="submit" className="w-100">
                                                        Zaloguj się
                                                    </Button>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                ) : (
                                    <div className="p-3 text-center">
                                        <p>Witaj, {nick}!</p>
                                        <Link to="/profile" className="w-100 mb-2">
                                            Przejdź do profilu
                                        </Link>
                                        <Button variant="outline-danger" onClick={logout} className="w-100">
                                            Wyloguj się
                                        </Button>
                                    </div>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
            <Toaster position='top-right' toastOptions={{ duration: 3000 }} />
        </>
    );
};

export default Header;