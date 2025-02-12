import React, { useState } from 'react';
import { Button, Form, Container, Alert } from 'react-bootstrap';
import { post } from '@/utils/httpHelper';

const Register = () => {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [nick, setNick] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await post('/user/register', {
        name,
        surname,
        nick,
        password,
      });
      setSuccess(response.data.message);
      setName('');
      setSurname('');
      setNick('');
      setPassword('');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container style={{ flex: 1, padding: 10, maxWidth: '30%'}}>
      <div className='register-form'>
        <h2 className="text-center text-primary mb-4">Rejestracja do systemu</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Imię</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-pill shadow-sm"
              style={{ transition: 'all 0.3s ease' }}
            />
          </Form.Group>
          <Form.Group controlId="surname" className="mb-3">
            <Form.Label>Nazwisko</Form.Label>
            <Form.Control
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
              className="rounded-pill shadow-sm"
              style={{ transition: 'all 0.3s ease' }}
            />
          </Form.Group>
          <Form.Group controlId="nick" className="mb-3">
            <Form.Label>Nickname</Form.Label>
            <Form.Control
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              required
              className="rounded-pill shadow-sm"
              style={{ transition: 'all 0.3s ease' }}
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Hasło</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-pill shadow-sm"
              style={{ transition: 'all 0.3s ease' }}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 rounded-pill shadow-lg mt-3"
            style={{ backgroundColor: '#6a11cb', border: 'none', transition: '0.3s ease' }}
          >
            Utwórz konto
          </Button>
        </Form>
      </div>
    </Container>
  );
};
export default Register;
