import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';

const buildReturnUrl = (path: string): string => {
    const origin = window.location.origin;
    // Since we're using HashRouter, we need to add the # to the path
    return encodeURIComponent(`${origin}/#${path}`);
};

export const register = async () => {
    const returnUrl = buildReturnUrl('/auth/after-register');
    window.location.href = `https://auth.jerome-baille.fr/register?returnUrl=${returnUrl}`;
};

export const login = async () => {
    const returnUrl = buildReturnUrl('/auth/after-login');
    window.location.href = `https://auth.jerome-baille.fr/login?returnUrl=${returnUrl}`;
};

export const logout = async () => {
    const response = await axios.post(`${API_ENDPOINTS.auth}/logout`, {}, { withCredentials: true });
    return response.data;
};

export const verifyToken = async (): Promise<boolean> => {
    try {
        const response = await axios.get(
            'https://auth.jerome-baille.fr/api/auth/verify',
            { withCredentials: true }
        );
        return response.status === 200 && response.data.status === 'success' && response.data.userId;
    } catch (error) {
        return false;
    }
};