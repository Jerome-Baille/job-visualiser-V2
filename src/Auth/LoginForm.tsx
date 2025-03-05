import { useDispatch } from 'react-redux';
import { login } from "../services/authService";
import { showLoader, hideLoader } from '../redux/reducers/loadingSlice';
import { Button, VStack } from '@chakra-ui/react';

export const LoginForm = () => {
    const dispatch = useDispatch();

    const handleLogin = async () => {
        dispatch(showLoader());
        try {
            await login();
        } catch (error) {
            dispatch(hideLoader());
        }
    };

    return (
        <VStack spacing={4} align="flex-end">
            <Button
                colorScheme="yellow"
                onClick={handleLogin}
            >
                Login with Auth Service
            </Button>
        </VStack>
    );
}