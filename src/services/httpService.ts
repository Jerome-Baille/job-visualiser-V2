import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';
import { logout } from '../services/authService'
import { store } from '../store';
import { setUserAuthenticated } from '../redux/actions/authActions';
import { showLoader, hideLoader } from '../redux/reducers/loadingSlice';
import { getTokenAndUserId, setTokensAndUserId } from '../helpers/cookieHelper';

// Create an axios instance
const instance = axios.create();

// Function to refresh token
async function refreshTokenFunction() {
    const { refreshToken } = getTokenAndUserId();
    const response = await instance.post(`${API_ENDPOINTS.auth}/refresh`, { refreshToken });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, accessTokenExpireDate: newAccessTokenExpireDate, refreshTokenExpireDate: newRefreshTokenExpireDate, userId, userIdExpireDate } = response.data;
    setTokensAndUserId(newAccessToken, newRefreshToken, userId, newAccessTokenExpireDate, newRefreshTokenExpireDate, userIdExpireDate);
    return newAccessToken;
}

// Add a request interceptor
instance.interceptors.request.use(async (config) => {
    // Show loader
    store.dispatch(showLoader());

    // Get token and expiration date from storage
    const auth = getTokenAndUserId();
    let { accessToken } = auth;
    const { refreshToken, accessTokenExpireDate, refreshTokenExpireDate } = auth;

    // If refresh token is missing, logout the user
    if (!refreshToken || (refreshTokenExpireDate && new Date().getTime() > new Date(refreshTokenExpireDate).getTime())) {
        store.dispatch(setUserAuthenticated(false));
        logout();
        store.dispatch(hideLoader());
        throw new Error('Refresh token is missing');
    }

    // If token is expired, refresh it
    if (accessTokenExpireDate && new Date().getTime() > new Date(accessTokenExpireDate).getTime()) {
        try {
            accessToken = await refreshTokenFunction();
        } catch (error) {
            // Hide loader
            store.dispatch(hideLoader());
            throw new Error('Failed to refresh access token');
        }
    }

    // Set token in headers
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
}, (error) => {
    store.dispatch(hideLoader());
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use((response) => {
    store.dispatch(hideLoader());
    return response;
}, async (error) => {
    if (error.config && error.response && (error.response.status === 403 || error.response.status === 401)) {
        const originalRequest = error.config;

        try {
            // Refresh token
            const newAccessToken = await refreshTokenFunction();

            // Set token in headers
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return instance(originalRequest);
        } catch (refreshError) {
            // Hide loader
            store.dispatch(hideLoader());
            throw new Error('Failed to refresh access token after 403 response');
        }
    }

    store.dispatch(hideLoader());
    return Promise.reject(error);
});

export default instance;