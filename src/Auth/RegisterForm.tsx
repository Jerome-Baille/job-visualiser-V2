// Libraries
import { useDispatch } from 'react-redux';
import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';

// Interfaces
import { UserData } from '../interfaces';

// Services
import { register } from "../services/authService";
import { showToast } from '../services/toastService';

// Redux actions
import { hideLoader, showLoader } from '../redux/reducers/loadingSlice';

// Helpers
import { userValidationSchema } from '../helpers/formValidationSchema';

// Styles
import './AuthStyle.css';

export const RegisterForm = () => {
    const dispatch = useDispatch();

    const initialValues: UserData = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    // Handle form submission
    const handleRegister = async (values: UserData) => {
        const { username, password } = values;

        const showError = (error: unknown) => {
            console.error(error);
            dispatch(hideLoader());
            showToast({ type: 'error', message: 'An error occurred during registration.' });
        };

        const showSuccess = () => {
            dispatch(hideLoader());
            showToast({ type: 'success', message: `Account created for ${username}. Please login.` });
        };

        dispatch(showLoader());

        try {
            await register(username, password);
            showSuccess();
        } catch (error) {
            showError(error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={userValidationSchema}
            onSubmit={(values, actions) => {
                handleRegister(values);
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
                        <Field name="confirmPassword">
                            {({ field, form }: FieldProps) => (
                                <FormControl isInvalid={!!(form.errors.confirmPassword && form.touched.confirmPassword)}>
                                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                    <Input {...field} id="confirmPassword" placeholder="confirmPassword" type="password" />
                                    <ErrorMessage name="confirmPassword" />
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