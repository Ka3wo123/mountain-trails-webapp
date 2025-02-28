import axiosInstance from '@/utils/axiosInstance';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchNewAccessToken = async () => {
            try {
                const response = await axiosInstance.post('/users/refresh-token', {}, { withCredentials: true });
                setAccessToken(response.data.accessToken);
            } catch (error) {
                console.error('Could not refresh token', error);
            }
        }
        fetchNewAccessToken();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('jwtToken', token);
        window.location.reload();
    };

    const logout = () => {
        setAccessToken(null);
        localStorage.removeItem('jwtToken');
        axiosInstance.post('/users/logout', {}, { withCredentials: true });
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!accessToken, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
