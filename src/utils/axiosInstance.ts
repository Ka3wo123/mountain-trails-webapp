import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PROD_URL || import.meta.env.VITE_DEV_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('jwtToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        if (response.status === 401 && !config._retry) {
            config._retry = true;
            try {
                const refreshResponse = await axios.post(`/api/users/refresh-token`, {}, { withCredentials: true });
                const newAccessToken = refreshResponse.data.accessToken;

                localStorage.setItem('jwtToken', newAccessToken);

                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(config);
            } catch (error) {
                console.error('Refresh token failed', error);
            }
        }

        return Promise.reject(error);
    }
)



export default axiosInstance;
