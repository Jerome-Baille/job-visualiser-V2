import http from './httpService';
import { API_ENDPOINTS } from "../config/apiConfig";
import { ProfileData } from '../interfaces';

export const getProfile = async () => {
    const response = await http.get(`${API_ENDPOINTS.user}/profile`);
    return response.data;
}

export const patchUser = async (userId: number, profile: ProfileData) => {
    const response = await http.patch(`${API_ENDPOINTS.user}/${userId}`, profile);
    return response;
}

export const deleteAccount = async (userId: number) => {
    const response = await http.delete(`${API_ENDPOINTS.user}/${userId}`);
    return response;
}