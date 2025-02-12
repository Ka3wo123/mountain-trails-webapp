import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api/' 
    : 'https://mountain-trails-api.vercel.app/api/',
});

export default api;
