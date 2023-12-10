import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';
import { logout } from '../services/authService'
import { store } from '../store';
import { setUserAuthenticated } from '../redux/actions/authActions';
import { showLoader, hideLoader } from '../redux/reducers/loadingSlice';
import { setToken, getToken } from '../helpers/cookieHelper';

const handleLogout = (errorMessage: string) => {
    store.dispatch(setUserAuthenticated(false));
    logout();
    throw new Error(errorMessage);
}

// Create an axios instance
const instance = axios.create();

// Function to refresh token
async function refreshTokenFunction() {
    const refreshToken = getToken('refreshToken');

    if (!refreshToken || refreshToken === 'undefined') {
        handleLogout('Refresh token is missing');
    }

    try {
        const response = await instance.post(`${API_ENDPOINTS.auth}/refresh`, { refreshToken });
        const { accessToken: newAccessToken, accessTokenExpireDate: newAccessTokenExpireDate } = response.data;

        if (!newAccessToken) {
            handleLogout('Tokens are missing in the response');
        }

        // Set tokens in storage
        setToken('accessToken', newAccessToken, newAccessTokenExpireDate);
        return newAccessToken;
    } catch (error) {
        handleLogout('Failed to refresh access token');
    }
}

// Add a request interceptor
instance.interceptors.request.use(
    async (config) => {
        // Show loader
        store.dispatch(showLoader());

        // Get token and expiration date from storage
        let accessToken = getToken('accessToken');

        // If token is expired, refresh it
        if (accessToken && accessToken === null) {
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
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    (response) => {
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
    }
);

export default instance;