import React, { useState } from 'react';
import { Breadcrumb, Form } from 'react-bootstrap';
import { toast, Toaster } from 'react-hot-toast';
import '@/styles/registration.css';
import axiosInstance from '@/utils/axiosInstance';
import { API_ENDPOINTS, ERROR_MESSAGES, HTTP_STATUS, ROUTES, SUCCESS_MESSAGES } from '@/constants';

const Register = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [nick, setNick] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post(API_ENDPOINTS.USERS.REGISTER, {
        name,
        surname,
        nick,
        password,
      });
      toast.success(SUCCESS_MESSAGES.ACCOUNT_CREATED(nick));
      setName('');
      setSurname('');
      setNick('');
      setPassword('');
    } catch (error: any) {
      error.status === HTTP_STATUS.BAD_REQUEST
        ? toast.error(ERROR_MESSAGES.NICKNAME_EXISTS)
        : toast.error(ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  return (
    <div className="register">
      <Breadcrumb>
        <Breadcrumb.Item href={ROUTES.HOME}>Mapa</Breadcrumb.Item>
        <Breadcrumb.Item active>Rejestracja</Breadcrumb.Item>
      </Breadcrumb>
      <div className="register-form">
        <h2 className="form-header">Rejestracja do systemu</h2>
        <Form onSubmit={handleSubmit} className="form-controll">
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Imię</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="surname" className="mb-3">
            <Form.Label>Nazwisko</Form.Label>
            <Form.Control
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="nick" className="mb-3">
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
          <button type="submit" className="success">
            Utwórz konto
          </button>
        </Form>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </div>
    </div>
  );
};
export default Register;
