import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';
import { logout } from '../services/authService'
import { store } from '../store';
import { setUserAuthenticated } from '../redux/actions/authActions';
import { showLoader, hideLoader } from '../redux/reducers/loadingSlice';
import { getTokenAndUserId, setTokensAndUserId } from '../helpers/cookieHelper';

const handleLogout = (errorMessage: string) => {
    store.dispatch(setUserAuthenticated(false));
    logout();
    throw new Error(errorMessage);
}

// Create an axios instance
const instance = axios.create();

// Function to refresh token
async function refreshTokenFunction() {
    const { refreshToken } = getTokenAndUserId();

    if (!refreshToken || refreshToken === 'undefined') {
        handleLogout('Refresh token is missing');
    }

    const response = await instance.post(`${API_ENDPOINTS.auth}/refresh`, { refreshToken });
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, accessTokenExpireDate: newAccessTokenExpireDate, refreshTokenExpireDate: newRefreshTokenExpireDate, userId, userIdExpireDate } = response.data;

    if (!newAccessToken || !newRefreshToken) {
        handleLogout('Tokens are missing in the response');
    }

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
        handleLogout('Refresh token is missing');
    }

    // If token is expired, refresh it
    if (accessTokenExpireDate && new Date().getTime() > new Date(accessTokenExpireDate).getTime()) {
        try {
            accessToken = await refreshTokenFunction();
        } catch (error) {
            handleLogout('Failed to refresh access token');
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
        const retryCount = originalRequest._retryCount || 0;

        if (retryCount >= 3) {
            store.dispatch(hideLoader());
            throw new Error('Failed to refresh access token after 3 retries');
        }

        try {
            // Refresh token
            const newAccessToken = await refreshTokenFunction();

            // Set token in headers
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            originalRequest._retryCount = retryCount + 1;

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