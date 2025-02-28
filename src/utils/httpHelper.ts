import axios from "axios";
import axiosInstance from "./axiosInstance";

const BASE_URL = import.meta.env.VITE_PROD_URL || import.meta.env.VITE_DEV_URL;


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
                const refreshResponse = await axios.post(`${BASE_URL}/users/refresh-token`, {}, { withCredentials: true });
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

const handleResponse = (response: any) => {
    if (response.status < 200 || response.status >= 300) {
        return response.data.error;
    }

    return response;
};

export const get = async (endpoint: string, params: Record<string, any> = {}): Promise<any> => {
    try {
        const response = await axiosInstance.get(endpoint, { params });
        return handleResponse(response);
    } catch (error) {
        console.error('Error in GET request:', error);
        throw error;
    }
};

export const post = async (endpoint: string, data: Record<string, any>): Promise<any> => {
    try {
        const response = await axiosInstance.post(endpoint, data);
        return handleResponse(response);
    } catch (error) {
        console.error('Error in POST request:', error);
        throw error;
    }
};

export const postMimetype = async (endpoint: string, data: Record<string, any>): Promise<any> => {
    try {
        const response = await axiosInstance.post(endpoint, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error in POST request:', error);
        throw error;
    }
}

export const put = async (endpoint: string, data: Record<string, any>): Promise<any> => {
    try {
        const response = await axiosInstance.put(endpoint, data);
        return handleResponse(response);
    } catch (error) {
        console.error('Error in PUT request:', error);
        throw error;
    }
};

export const del = async (endpoint: string, data?: Record<string, any>): Promise<any> => {
    try {
        const response = await axiosInstance.delete(endpoint, { data: data });
        return handleResponse(response);
    } catch (error) {
        console.error('Error in DELETE request:', error);
        throw error;
    }
};
