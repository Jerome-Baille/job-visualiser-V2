// React and related libraries
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";

// Third-party libraries
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, FormControl, FormLabel, Flex, IconButton, Input, InputGroup, Select, useDisclosure, Card, CardBody, VStack } from "@chakra-ui/react"
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Internal modules (services, components, helpers, interfaces)
import { AuthState, JobData } from '../interfaces';
import { deleteOpportunity, getOpportunity, putOpportunity } from "../services/jobService";
import NotLogged from "../components/NotLogged";
import { showToast } from '../services/toastService';
import { validationSchema } from '../helpers/formValidationSchema';

export default function Detail() {
    const isAuthenticated = useSelector((state: { auth: AuthState }) => state.auth.isAuthenticated);
    const navigate = useNavigate()
    const { id } = useParams()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const [job, setJob] = useState({
        name: '',
        company: '',
        location: '',
        type: 'Remote',
        link: '',
        applicationDate: new Date().toISOString().split('T')[0],
        applicationYear: new Date().getFullYear().toString(),
        interviewDate: '',
        decisionDate: '',
        decision: 'unknown'
    })

    useEffect(() => {
        if (!id) return

        getOpportunity(id)
            .then(data => {
                setJob(prevJob => ({
                    ...prevJob,
                    ...data,
                    interviewDate: data.interviewDate || '',
                    decisionDate: data.decisionDate || ''
                }))
            }).catch(() => {
                showToast({
                    type: 'error',
                    message: "An error occurred. Please try again."
                });
            })
    }, [id])

    const handleSetToday = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        setJob({
            ...job,
            decisionDate: `Refus le ${day}/${month}/${year}`,
            decision: "negative"
        });
    };

    const handleSubmit = (values: JobData) => {
        putOpportunity(values)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    showToast({
                        type: 'success',
                        message: "The job application has been successfully updated !"
                    });
                } else {
                    showToast({
                        type: 'error',
                        message: "Oh no, something went wrong ! Try again"
                    });
                }

            }).catch(() => {
                showToast({
                    type: 'error',
                    message: "An error occurred. Please try again."
                });
            })
    };

    const onDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!id) return

        deleteOpportunity(id)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    showToast({
                        type: 'success',
                        message: "The job application has been deleted from the database !"
                    });

                    onClose();

                    navigate('/list');
                } else {
                    showToast({
                        type: 'error',
                        message: "Oh no, something went wrong ! Try again"
                    });

                    onClose();
                }
            }).catch(() => {
                showToast({
                    type: 'error',
                    message: "An error occurred. Please try again."
                });

                onClose();
            })
    };

    return (
        <Card>
            <CardBody>
                {isAuthenticated ? (
                    <Formik
                        initialValues={job}
                        validationSchema={validationSchema}
                        onSubmit={(values, actions) => {
                            handleSubmit(values);
                            actions.setSubmitting(false);
                        }}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <VStack spacing={4} align="stretch">
                                    <Field name="name">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.name && form.touched.name)}>
                                                <FormLabel htmlFor="name">Name</FormLabel>
                                                <Input {...field} id="name" placeholder="name" />
                                                <ErrorMessage name="name" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="company">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.company && form.touched.company)}>
                                                <FormLabel htmlFor="company">Company</FormLabel>
                                                <Input {...field} id="company" placeholder="company" />
                                                <ErrorMessage name="company" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="location">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.location && form.touched.location)}>
                                                <FormLabel htmlFor="location">Location</FormLabel>
                                                <Input {...field} id="location" placeholder="location" />
                                                <ErrorMessage name="location" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="type">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.type && form.touched.type)}>
                                                <FormLabel htmlFor="type">Type</FormLabel>
                                                <Select {...field} id="type">
                                                    <option value="Remote">Remote</option>
                                                    <option value="Hybrid">Hybrid</option>
                                                    <option value="On site">On site</option>
                                                </Select>
                                                <ErrorMessage name="type" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="link">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.link && form.touched.link)}>
                                                <FormLabel htmlFor="link">Link</FormLabel>
                                                <InputGroup>
                                                    {field.value && (
                                                        <IconButton
                                                            aria-label="Open link"
                                                            icon={<FontAwesomeIcon icon={faLink} />}
                                                            onClick={() => window.open(field.value, "_blank")}
                                                        />
                                                    )}
                                                    <Input {...field} id="link" placeholder="link" />
                                                </InputGroup>
                                                <ErrorMessage name="link" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="applicationDate">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.applicationDate && form.touched.applicationDate)}>
                                                <FormLabel htmlFor="applicationDate">Application Date</FormLabel>
                                                <Input {...field} id="applicationDate" type="date" />
                                                <ErrorMessage name="applicationDate" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="interviewDate">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.interviewDate && form.touched.interviewDate)}>
                                                <FormLabel htmlFor="interviewDate">Interview Date</FormLabel>
                                                <Input {...field} id="interviewDate" placeholder="interviews date" />
                                                <ErrorMessage name="interviewDate" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="decisionDate">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.decisionDate && form.touched.decisionDate)}>
                                                <FormLabel htmlFor="decisionDate">Decision Date</FormLabel>
                                                <Input {...field} id="decisionDate" placeholder="decision date" />
                                                <ErrorMessage name="decisionDate" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Field name="decision">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.decision && form.touched.decision)}>
                                                <FormLabel htmlFor="decision">Decision</FormLabel>
                                                <Select {...field} id="decision">
                                                    <option value="positive">Positive</option>
                                                    <option value="negative">Negative</option>
                                                    <option value="in progress">In progress</option>
                                                    <option value="expired">Expired</option>
                                                    <option value="unknown">Unknown</option>
                                                </Select>
                                                <ErrorMessage name="decision" />
                                            </FormControl>
                                        )}
                                    </Field>
                                    <Flex direction="row" justify="space-between" align="center">
                                        <Button colorScheme="red" onClick={onOpen}>
                                            Delete
                                        </Button>

                                        <Button colorScheme="gray" onClick={handleSetToday}>
                                            Today
                                        </Button>

                                        <Button mt={4} colorScheme="yellow" isLoading={isSubmitting} type="submit">
                                            Submit
                                        </Button>
                                    </Flex>

                                    <AlertDialog
                                        isOpen={isOpen}
                                        leastDestructiveRef={cancelRef}
                                        onClose={onClose}
                                    >
                                        <AlertDialogOverlay>
                                            <AlertDialogContent>
                                                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                                    Delete Application
                                                </AlertDialogHeader>
                                                <AlertDialogBody>
                                                    Are you sure? You can't undo this action afterwards.
                                                </AlertDialogBody>
                                                <AlertDialogFooter>
                                                    <Button ref={cancelRef} onClick={onClose}>
                                                        Cancel
                                                    </Button>
                                                    <Button colorScheme="red" onClick={onDelete} ml={3}>
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
                ) : (
                    <NotLogged />
                )}
            </CardBody>
        </Card>
    );
}