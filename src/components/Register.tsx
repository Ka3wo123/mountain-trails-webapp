import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { post } from '@/utils/httpHelper';
import { toast, Toaster } from 'react-hot-toast';
import '@/styles/registration.css';


const Register = () => {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [nick, setNick] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post('/users/register', {
        name,
        surname,
        nick,
        password,
      });
      toast.success(`Utworzono nowe konto dla ${nick}`);
      setName('');
      setSurname('');
      setNick('');
      setPassword('');
    } catch (error: any) {
      error.status === 400 ?
        toast.error('Nickname już istnieje')
        :
        toast.error('Coś poszło nie tak');

    }
  };

  return (
    <div className='register-form'>
      <h2 className="form-header">Rejestracja do systemu</h2>
      <Form onSubmit={handleSubmit} className='form-controll'>
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
        <Button
          variant="primary"
          type="submit"
          className='submit-btn'
        >
          Utwórz konto
        </Button>
      </Form>
      <Toaster position='top-right' toastOptions={{ duration: 3000 }} />
    </div>

  );
};
export default Register;
