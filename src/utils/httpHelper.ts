import axios from "axios";

const BASE_URL = import.meta.env.VITE_PROD_URL || import.meta.env.VITE_DEV_URL;

const handleResponse = (response: any) => {
    if (response.status < 200 || response.status >= 300) {
        return response.data.error;
    }

    return response;
};

export const get = async (endpoint: string, params: Record<string, any> = {}): Promise<any> => {
    try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
            params,
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error in GET request:', error);
        throw error;
    }
};

export const post = async (endpoint: string, data: Record<string, any>): Promise<any> => {
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error in POST request:', error);
        throw error;
    }
};

export const postMimetype = async (endpoint: string, data: Record<string, any>): Promise<any> => {
    try {
        const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
        const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error in PUT request:', error);
        throw error;
    }
};

export const del = async (endpoint: string, data?: Record<string, any>): Promise<any> => {
    try {
        const response = await axios.delete(`${BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            data: data
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error in DELETE request:', error);
        throw error;
    }
};
