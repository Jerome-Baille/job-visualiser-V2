import React, { useState, useEffect } from 'react';
import { Formik, Field, FieldProps, Form, ErrorMessage } from 'formik';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Flex, Card, CardBody, VStack } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import * as Yup from 'yup';
import { getProfile, deleteAccount, patchUser } from '../services/userService';

type ProfileType = {
    id: number;
    username: string;
    password: string;
    [key: string]: string | number;
};

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
    password: Yup.string()
        .required('Required')
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
        .matches(/[a-z]/, 'Password must have at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
        .matches(/\d/, 'Password must have at least one digit'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
});

const Profile = () => {
    const [profile, setProfile] = useState<ProfileType>({ id: 0, username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        getProfile().then(data => setProfile(data));
    }, []);

    const handleDelete = () => {
        if (!profile.id) return;
        deleteAccount(profile.id);
        onClose();
    };

    return (
        <Card>
            <CardBody>
                    <Formik
                        initialValues={profile}
                        validationSchema={validationSchema}
                        onSubmit={(values, actions) => {
                            delete values.confirmPassword;
                            const changes = Object.keys(values).reduce((acc: Record<string, unknown>, key) => {
                                if (values[key] !== profile[key]) {
                                    acc[key] = values[key];
                                }
                                return acc;
                            }, {});

                            patchUser(profile.id, changes)
                            actions.setSubmitting(false);
                        }}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                                <VStack spacing={4} align="stretch">
                                <Field name="username">
                                    {({ field, form }: FieldProps) => (
                                        <FormControl isInvalid={!!(form.errors.username && form.touched.username)}>
                                            <FormLabel htmlFor="username">Username</FormLabel>
                                            <Input {...field} id="username" />
                                            <ErrorMessage name="username" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="password">
                                    {({ field, form }: FieldProps) => (
                                        <FormControl isInvalid={!!(form.errors.password && form.touched.password)}>
                                            <FormLabel htmlFor="password">Password</FormLabel>
                                            <InputGroup size="md">
                                                <Input {...field} id="password" type={showPassword ? "text" : "password"} />
                                                <InputRightElement>
                                                    <Button onClick={() => setShowPassword(!showPassword)}>
                                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            <ErrorMessage name="password" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="confirmPassword">
                                    {({ field, form }: FieldProps) => (
                                        <FormControl isInvalid={!!(form.errors.confirmPassword && form.touched.confirmPassword)}>
                                            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                            <InputGroup size="md">
                                                <Input {...field} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} />
                                                <InputRightElement>
                                                    <Button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                                    </Button>
                                                </InputRightElement>
                                            </InputGroup>
                                            <ErrorMessage name="confirmPassword" />
                                        </FormControl>
                                    )}
                                </Field>
                                <Flex mt={4} direction="row" justify="space-between" align="center">
                                    <Button colorScheme="red" onClick={onOpen}>
                                        Delete Account
                                    </Button>
                                    <Button colorScheme="yellow" type="submit" isLoading={isSubmitting}>
                                        Submit
                                    </Button>
                                </Flex>

                                <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                                    <AlertDialogOverlay>
                                        <AlertDialogContent>
                                            <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                                Delete Account
                                            </AlertDialogHeader>
                                            <AlertDialogBody>
                                                Are you sure? This action cannot be undone.
                                            </AlertDialogBody>
                                            <AlertDialogFooter>
                                                <Button ref={cancelRef} onClick={onClose}>
                                                    Cancel
                                                </Button>
                                                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                                    Delete
                                                </Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialogOverlay>
                                </AlertDialog>
                                </VStack>
                            </Form>
                        )}
                    </Formik>
            </CardBody>
        </Card>
    );
};

export default Profile;