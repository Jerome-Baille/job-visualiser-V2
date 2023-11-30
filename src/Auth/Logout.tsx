import { useDispatch } from 'react-redux';
import { setUserAuthenticated } from '../redux/actions/authActions';
import { logout } from '../services/authService';
import { showToast } from '../services/toastService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react"
import { useRef } from 'react';
import { hideLoader, showLoader } from '../redux/reducers/loadingSlice';


const AuthLogout = () => {
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const onLogout = async () => {
        onClose();

        const showError = (message: string) => {
            console.error(message);
            dispatch(setUserAuthenticated(true));
            dispatch(hideLoader());
            showToast({ type: 'error', message });
        };

        const showSuccess = () => {
            dispatch(hideLoader());
            dispatch(setUserAuthenticated(false));
            showToast({ type: 'success', message: `Farewell my friend !` });
        };

        dispatch(showLoader());

        try {
            await logout();
            showSuccess();
        } catch (error: unknown) {
            showError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };

    return (
        <>
            <button onClick={onOpen} className='logout-button'>
                <FontAwesomeIcon icon={faPowerOff} size="lg" />
            </button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Logout
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to logout ?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={onLogout} ml={3}>
                                Logout
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default AuthLogout;