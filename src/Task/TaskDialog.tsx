import React, { RefObject, useEffect, useRef, useState } from 'react';
import { FormLabel, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogContent, AlertDialogOverlay, Button, Input, Select, FormControl, List, ListItem, Flex, IconButton } from "@chakra-ui/react";
import { Formik, Form, ErrorMessage, Field, FieldProps, FormikHelpers } from 'formik';
import { JobData, TaskData, UserData } from '../interfaces';
import { taskValidationSchema } from '../helpers/formValidationSchema';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { searchUser } from '../services/userService';
import { showToast } from '../services/toastService';
import JobsSearch from '../components/JobsSearch';

interface TaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    cancelRef: RefObject<HTMLButtonElement>;
    initialValues: TaskData;
    validationSchema: typeof taskValidationSchema;
    onSubmit: (values: TaskData, actions: FormikHelpers<TaskData>) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ isOpen, onClose, cancelRef, initialValues, validationSchema, onSubmit }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [usernames, setUsernames] = useState([]);
    const [searchValueUser, setSearchValueUser] = useState('');
    const [searchValueJobs, setSearchValueJobs] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [jobFiltered, setJobFiltered] = useState<JobData[]>([]);
    const [selectedJob, setSelectedJob] = useState<JobData[]>([]);

    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    useEffect(() => {
        if (searchValueJobs === '') {
            setJobFiltered([]);
        }
    }, [searchValueJobs]);

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                        onSubmit(values, actions);
                        actions.setSubmitting(false);
                        // Reset the state after form submission
                        setShowSearch(false);
                        setUsernames([]);
                        setSearchValueUser('');
                        setJobFiltered([]);
                        setSelectedJob([]);
                    }}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <AlertDialogContent>
                                <AlertDialogBody>
                                    <Flex
                                        direction="column"
                                        alignItems="flex-start"
                                        gap={4}
                                    >
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

                                        <Flex
                                            w='100%'
                                            justifyContent="space-between"
                                            alignItems="center"
                                            gap={4}
                                        >
                                            <JobsSearch setJobFiltered={setJobFiltered} searchValue={searchValueJobs} setSearchValue={setSearchValueJobs} />
                                            <IconButton
                                                aria-label="Clear jobs search"
                                                icon={<FontAwesomeIcon icon={faTimes} color='red' />}
                                                onClick={() => {
                                                    setSearchValueJobs('');
                                                }}
                                            />
                                        </Flex>

                                        {jobFiltered.length > 0 && (
                                            <List spacing={3}>
                                                {jobFiltered.map((job: JobData) => (
                                                    <ListItem
                                                        key={job.id}
                                                        onClick={() => {
                                                            if (values.jobId && job.id && !values.jobId.includes(job.id)) {
                                                                setFieldValue('jobId', [...values.jobId, job.id]);
                                                                setSelectedJob([...selectedJob, job]);
                                                                setSearchValueJobs('');
                                                            } else {
                                                                setSearchValueJobs('');
                                                                showToast({ type: 'error', message: 'This job has already been added.' });
                                                            }
                                                        }}
                                                        cursor="pointer"
                                                    >
                                                        {job.name} ({job.company})
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}

                                        {selectedJob.length > 0 && (
                                            <List spacing={3}>
                                                {selectedJob.map((job: JobData) => (
                                                    <ListItem key={job.id}>
                                                        {job.name} ({job.company})
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}

                                        <Button onClick={() => setShowSearch(!showSearch)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                            &nbsp;Add User
                                        </Button>

                                        {showSearch && (
                                            <Flex
                                                w='100%'
                                                justifyContent="space-between"
                                                alignItems="center"
                                                gap={4}
                                            >
                                                <Input
                                                    ref={searchInputRef}
                                                    placeholder="Search for user"
                                                    value={searchValueUser}
                                                    onChange={event => setSearchValueUser(event.target.value)}
                                                />
                                                <IconButton
                                                    aria-label="Validate update"
                                                    icon={<FontAwesomeIcon icon={faCheck} color='green' />}
                                                    onClick={async () => {
                                                        const response = await searchUser(searchValueUser);
                                                        if (response.length === 0) {
                                                            showToast({ type: 'error', message: 'No match found.' });
                                                        } else {
                                                            setUsernames(response);
                                                        }
                                                    }}
                                                />
                                                <IconButton
                                                    aria-label="Cancel update"
                                                    icon={<FontAwesomeIcon icon={faTimes} color='red' />}
                                                    onClick={() => {
                                                        setSearchValueUser('');
                                                        setShowSearch(false)
                                                    }}
                                                />
                                            </Flex>
                                        )}

                                        {usernames.length > 0 && (
                                            <List spacing={3}>
                                                {usernames.map((user: UserData) => (
                                                    <ListItem
                                                        key={user.id}
                                                        onClick={() => {
                                                            if (values.userIds && user.id && !values.userIds.includes(user.id)) {
                                                                setFieldValue('userIds', [...values.userIds, user.id]);
                                                                setSearchValueUser('');
                                                                setShowSearch(false);
                                                            } else {
                                                                showToast({ type: 'error', message: 'This user has already been added.' });
                                                            }
                                                        }}
                                                        cursor="pointer"
                                                    >
                                                        {user.username}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}

                                        <Field name="userIds" style={{ display: 'none' }} />
                                    </Flex>
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={() => {
                                        onClose();
                                        setShowSearch(false);
                                        setUsernames([]);
                                        setSearchValueUser('');
                                        setSearchValueJobs('');
                                        setJobFiltered([]);
                                        setSelectedJob([]);
                                    }}>
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