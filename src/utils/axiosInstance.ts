import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PROD_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;
