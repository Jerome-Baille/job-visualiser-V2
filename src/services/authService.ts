import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';

export const register = async (username: string, password: string) => {
    const response = await axios.post(`${API_ENDPOINTS.auth}/register`, { username, password });
    return response.data;
}

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_ENDPOINTS.auth}/login`, { username, password }, { withCredentials: true });
    return response.data;
};

export const logout = async () => {
    const response = await axios.post(`${API_ENDPOINTS.auth}/logout`, {}, { withCredentials: true });
    return response.data;
};

export const verifyToken = async (): Promise<boolean> => {
    try {
        const response = await axios.get(
            `${API_ENDPOINTS.cookie}/verify`,
            { withCredentials: true }
        );
        return response.status === 200;
    } catch (error) {
        return false;
    }
};