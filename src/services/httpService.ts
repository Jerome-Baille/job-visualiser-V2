import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';
import { logout } from '../services/authService'
import { store } from '../store';
import { setUserAuthenticated } from '../redux/actions/authActions';
import { showLoader, hideLoader } from '../redux/reducers/loadingSlice';

const handleLogout = (errorMessage: string) => {
    store.dispatch(setUserAuthenticated(false));
    logout();
    throw new Error(errorMessage);
}

// Create an axios instance
const instance = axios.create();

// Function to refresh token
async function refreshTokenFunction() {
    try {
        const response = await instance.post(`${API_ENDPOINTS.auth}/refresh`, {}, { withCredentials: true });
        const { accessToken: newAccessToken } = response.data;

        if (!newAccessToken) {
            handleLogout('Tokens are missing in the response');
        }

        return newAccessToken;
    } catch (error) {
        handleLogout('Failed to refresh access token');
    }
}

// Add a request interceptor
instance.interceptors.request.use(
    (config) => {
        // Show loader
        store.dispatch(showLoader());
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
        if (error.config && error.response && (error.response.status === 403)) {
            const originalRequest = error.config;
            const retryCount = originalRequest._retryCount || 0;

            if (retryCount >= 2) {
                store.dispatch(hideLoader());
                throw new Error('Failed to refresh access token after 2 retries');
            }

            try {
                // Refresh token
                await refreshTokenFunction();

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