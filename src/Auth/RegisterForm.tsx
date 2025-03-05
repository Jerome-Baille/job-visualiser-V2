// Libraries
import { useDispatch } from 'react-redux';
import { Button, VStack } from '@chakra-ui/react';

// Services
import { register } from "../services/authService";

// Redux actions
import { hideLoader, showLoader } from '../redux/reducers/loadingSlice';

// Styles
import './AuthStyle.css';

export const RegisterForm = () => {
    const dispatch = useDispatch();

    const handleRegister = async () => {
        dispatch(showLoader());
        try {
            await register();
        } catch (error) {
            dispatch(hideLoader());
        }
    };

    return (
        <VStack spacing={4} align="flex-end">
            <Button
                colorScheme="yellow"
                onClick={handleRegister}
            >
                Register with Auth Service
            </Button>
        </VStack>
    );
}