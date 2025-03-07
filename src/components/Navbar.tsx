import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Outlet } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faMap, faUser, faPersonHiking } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import Banner from '@/components/Banner';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/authContext';
import { getNickname } from '@/utils/jwtDecoder';
import axiosInstance from '@/utils/axiosInstance';
import { API_ENDPOINTS, ERROR_MESSAGES, HTTP_STATUS } from '@/constants';
import '@/styles/navbar.css';

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
      <Navbar expand="lg" bg="dark" variant="dark" className="navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <FontAwesomeIcon icon={faPersonHiking} className="nav-logo" />
            Mountain Trails
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="nav-links">
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
              <Dropdown.Menu className="dropdown-menu">
                {!isAuthenticated ? (
                  <Form onSubmit={handleLogin} className="w-100">
                    <div>
                      <div>
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
                        <button className="success" type="submit">
                          Zaloguj się
                        </button>
                      </div>
                    </div>
                  </Form>
                ) : (
                  <div>
                    <p>Witaj {nick}!</p>
                    <div className="logged">
                      <Link to={`${nick}/profile`} className="profile-link">
                        Przejdź do profilu
                      </Link>
                      <button onClick={logout} className="danger">
                        Wyloguj się
                      </button>
                    </div>
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
