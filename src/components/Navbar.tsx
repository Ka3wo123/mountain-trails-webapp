import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Outlet } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faMap, faUser, faPersonHiking } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Banner from '@/components/Banner';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/authContext';
import { getNickname } from '@/utils/jwtDecoder';
import axiosInstance from '@/utils/axiosInstance';
import { API_ENDPOINTS, ERROR_MESSAGES, HTTP_STATUS } from '@/constants';

const Header = () => {
  const [nick, setNick] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string>('');
  const { isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    setNick(getNickname());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.USERS.LOGIN, {
        nick,
        password,
      });
      const { accessToken } = response.data;
      login(accessToken);
    } catch (error: any) {
      switch (error.status) {
        case HTTP_STATUS.NOT_FOUND:
          toast.error(ERROR_MESSAGES.USER_NOT_FOUND);
          break;
        case HTTP_STATUS.BAD_REQUEST:
          toast.error(ERROR_MESSAGES.INVALID_PASSWORD);
          break;
        default:
          toast.error(ERROR_MESSAGES.SERVER_ERROR);
      }
    }
  };

  return (
    <>
      <Banner />
      <Navbar sticky="top" expand="lg" bg="dark" variant="dark" className="shadow-lg px-3">
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
                    <Link to={`${nick}/profile`} className="w-100 mb-2">
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
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </>
  );
};

export default Header;
