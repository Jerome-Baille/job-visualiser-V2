import axios from 'axios';
import http from './httpService';
import { API_ENDPOINTS } from '../config/apiConfig';
import { setTokensAndUserId, removeTokensAndUserId } from '../helpers/cookieHelper';

export const register = async (username: string, password: string) => {
    const response = await axios.post(`${API_ENDPOINTS.auth}/register`, { username, password });
    return response.data;
}

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_ENDPOINTS.auth}/login`, { username, password });

    const { accessToken, refreshToken, accessTokenExpireDate, refreshTokenExpireDate, userId, userIdExpireDate } = response.data;

    // Store tokens in storage
    setTokensAndUserId(accessToken, refreshToken, userId, accessTokenExpireDate, refreshTokenExpireDate, userIdExpireDate);

    return response.data;
};

export const logout = async () => {
    removeTokensAndUserId();
    localStorage.clear();
};

export const checkTokenValidity = async () => {
    try {
        // Send a request to the token verification endpoint
        const response = await http.get(`${API_ENDPOINTS.auth}/verify`);

        // If the token is valid, the server should return a success response
        return response.data.auth;
    } catch (error) {
        // If the token is not valid or some other error occurred, return false
        return false;
    }
};