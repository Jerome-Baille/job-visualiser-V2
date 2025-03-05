import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserAuthenticated } from '../redux/actions/authActions';
import { showToast } from '../services/toastService';
import { showLoader, hideLoader } from '../redux/reducers/loadingSlice';

const AfterLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyAuth = async () => {
            dispatch(showLoader());
            try {
                const response = await axios.get('https://auth.jerome-baille.fr/api/auth/verify', {
                    withCredentials: true
                });

                if (response.data.status === 'success' && response.data.userId) {
                    dispatch(setUserAuthenticated(true));
                    showToast({ type: 'success', message: 'Successfully logged in!' });
                    navigate('/');
                } else {
                    throw new Error('Authentication verification failed');
                }
            } catch (error) {
                dispatch(setUserAuthenticated(false));
                showToast({ type: 'error', message: 'Authentication failed. Please try again.' });
                navigate('/auth');
            } finally {
                dispatch(hideLoader());
            }
        };

        verifyAuth();
    }, [dispatch, navigate]);

    return null;
};

export default AfterLogin;