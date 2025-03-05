import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showToast } from '../services/toastService';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../redux/reducers/loadingSlice';

const AfterRegister = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyRegistration = async () => {
            dispatch(showLoader());
            try {
                const response = await axios.get('https://auth.jerome-baille.fr/api/auth/verify', {
                    withCredentials: true
                });

                if (response.data.status === 'success' && response.data.userId) {
                    showToast({ 
                        type: 'success', 
                        message: 'Registration successful! You can now log in.' 
                    });
                    navigate('/auth');
                } else {
                    throw new Error('Registration verification failed');
                }
            } catch (error) {
                showToast({ 
                    type: 'error', 
                    message: 'Registration verification failed. Please try again.' 
                });
                navigate('/auth');
            } finally {
                dispatch(hideLoader());
            }
        };

        verifyRegistration();
    }, [dispatch, navigate]);

    return null;
};

export default AfterRegister;