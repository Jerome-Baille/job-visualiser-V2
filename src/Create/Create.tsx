import React from 'react';
import { Button, Card, CardBody, FormControl, FormLabel, Input, Select, VStack } from '@chakra-ui/react';
import { Formik, Field, FieldProps, Form, ErrorMessage } from 'formik';
import { validationSchema } from '../helpers/formValidationSchema';
import { FormValues, JobData } from '../interfaces';
import { postOpportunity } from '../services/jobService';

const Create: React.FC = () => {
    const initialValues: FormValues = {
        name: '',
        company: '',
        location: '',
        type: 'Remote',
        link: '',
        applicationDate: new Date().toISOString().split('T')[0],
        applicationYear: new Date().getFullYear().toString(),
        decision: 'unknown',
    };

    const handleSubmit = (values: JobData) => {
        postOpportunity(values)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }

    return (
        <Card>
            <CardBody>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        handleSubmit(values);
                        actions.setSubmitting(false);
                    }}
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
                                            <Input {...field} id="link" placeholder="link" />
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
                                <Button colorScheme="yellow" isLoading={isSubmitting} type="submit">
                                    Submit
                                </Button>
                            </VStack>
                        </Form>
                    )}
                </Formik>
            </CardBody>
        </Card>
    );
};

export default Create;