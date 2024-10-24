import http from './httpService';
import { API_ENDPOINTS } from "../config/apiConfig";
import { ProfileData } from '../interfaces';

export const getProfile = async () => {
    const response = await http.get(`${API_ENDPOINTS.user}/profile`, { withCredentials: true });
    return response.data;
}

export const searchUser = async (searchTerm: string) => {
    const response = await http.get(`${API_ENDPOINTS.user}/search?username=${searchTerm}`, { withCredentials: true });
    return response.data;
}

export const patchUser = async (userId: number, profile: ProfileData) => {
    const response = await http.patch(`${API_ENDPOINTS.user}/${userId}`, profile, { withCredentials: true });
    return response;
}

export const deleteAccount = async (userId: number) => {
    const response = await http.delete(`${API_ENDPOINTS.user}/${userId}`, { withCredentials: true });
    return response;
}