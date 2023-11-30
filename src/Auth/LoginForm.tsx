import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserAuthenticated } from '../redux/actions/authActions';

// Services
import { login } from "../services/authService";
import { showToast } from '../services/toastService';

import { hideLoader, showLoader } from '../redux/reducers/loadingSlice';
import { userValidationSchema } from '../helpers/formValidationSchema';

// Styles
import './AuthStyle.css';
import { UserData } from '../interfaces';
import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';

export const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialValues: UserData = {
        username: '',
        email: '',
        password: '',
    };

    const handleLogin = async (values: UserData) => {
        const { username, password } = values;

        const showError = (message: string) => {
            console.error(message);
            dispatch(setUserAuthenticated(false));
            dispatch(hideLoader());
            showToast({ type: 'error', message });
        };

        const showSuccess = () => {
            dispatch(setUserAuthenticated(true));
            dispatch(hideLoader());
            showToast({ type: 'success', message: `Welcome back, ${username}!` });
            navigate('/');
        };

        dispatch(showLoader());

        try {
            await login(username, password);
            showSuccess();
        } catch (error: unknown) {
            showError(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    };


    return (
        <Formik
            initialValues={initialValues}
            validationSchema={userValidationSchema}
            onSubmit={(values, actions) => {
                handleLogin(values);
                actions.setSubmitting(false);
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <VStack spacing={4} align="flex-end">
                        <Field name="username">
                            {({ field, form }: FieldProps) => (
                                <FormControl isInvalid={!!(form.errors.username && form.touched.username)}>
                                    <FormLabel htmlFor="username">Username</FormLabel>
                                    <Input {...field} id="username" placeholder="username" />
                                    <ErrorMessage name="username" />
                                </FormControl>
                            )}
                        </Field>
                        <Field name="password">
                            {({ field, form }: FieldProps) => (
                                <FormControl isInvalid={!!(form.errors.password && form.touched.password)}>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Input {...field} id="password" placeholder="password" type="password" />
                                    <ErrorMessage name="password" />
                                </FormControl>
                            )}
                        </Field>
                        <Button
                            colorScheme="yellow"
                            isLoading={isSubmitting}
                            type="submit"
                        >
                            Submit
                        </Button>
                    </VStack>
                </Form>
            )}

        </Formik>
    );
}