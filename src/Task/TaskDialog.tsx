import React, { RefObject } from 'react';
import { FormLabel, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogContent, AlertDialogOverlay, Button, Input, Select, FormControl } from "@chakra-ui/react";
import { Formik, Form, ErrorMessage, Field, FieldProps, FormikHelpers } from 'formik';
import { TaskData } from '../interfaces';
import { taskValidationSchema } from '../helpers/formValidationSchema';

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    cancelRef: RefObject<HTMLButtonElement>;
    initialValues: TaskData;
    validationSchema: typeof taskValidationSchema;
    onSubmit: (values: TaskData, actions: FormikHelpers<TaskData>) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ isOpen, onClose, cancelRef, initialValues, validationSchema, onSubmit }) => {
    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <AlertDialogContent>
                                {/* <AlertDialogHeader>Create Task</AlertDialogHeader> */}
                                <AlertDialogBody>
                                    <Field name="description">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.description && form.touched.description)}>
                                                <FormLabel>Description</FormLabel>
                                                <Input {...field} id="description" placeholder="Description" />
                                                <ErrorMessage name="description" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="status">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.status && form.touched.status)}>
                                                <FormLabel>Status</FormLabel>
                                                <Select {...field} placeholder="Status">
                                                    <option value="Backlog">Backlog</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Done">Done</option>
                                                </Select>
                                                <ErrorMessage name="status" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="priority">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.priority && form.touched.priority)}>
                                                <FormLabel>Priority</FormLabel>
                                                <Select {...field} placeholder="Priority">
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </Select>
                                                <ErrorMessage name="priority" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="dueDate">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.dueDate && form.touched.dueDate)}>
                                                <FormLabel>Due Date</FormLabel>
                                                <Input {...field} type="date" placeholder="Due Date" />
                                                <ErrorMessage name="dueDate" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="jobId">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.jobId && form.touched.jobId)}>
                                                <FormLabel>Job IDs (comma-separated)</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder="Job IDs (comma-separated)"
                                                    onChange={event => {
                                                        const jobIdsArray = event.target.value.split(',').map(id => id.trim());
                                                        form.setFieldValue('jobId', jobIdsArray);
                                                    }}
                                                />
                                                <ErrorMessage name="jobId" />
                                            </FormControl>
                                        )}
                                    </Field>

                                    <Field name="userIds">
                                        {({ field, form }: FieldProps) => (
                                            <FormControl isInvalid={!!(form.errors.userIds && form.touched.userIds)}>
                                                <FormLabel>User IDs (comma-separated)</FormLabel>
                                                <Input
                                                    {...field}
                                                    placeholder="User IDs (comma-separated)"
                                                    onChange={event => {
                                                        const userIdsArray = event.target.value.split(',').map(id => id.trim());
                                                        form.setFieldValue('userIds', userIdsArray);
                                                    }}
                                                />
                                                <ErrorMessage name="userIds" />
                                            </FormControl>
                                        )}
                                    </Field>
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme="blue" isLoading={isSubmitting} type="submit" ml={3}>
                                        Save
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>

                        </Form>
                    )}
                </Formik>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default TaskDialog;