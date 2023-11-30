import React, { useEffect, useRef, useState } from 'react';
import { Button, useDisclosure, Flex } from "@chakra-ui/react";
import { getTasks, createTask } from '../services/taskService';
import { TaskData } from '../interfaces';
import TaskList from './TaskList';
import { taskValidationSchema } from '../helpers/formValidationSchema';
import TaskDialog from './TaskDialog';

const Task: React.FC = () => {
    const [tasks, setTasks] = useState<TaskData[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            const tasks = await getTasks();
            tasks.forEach((task: TaskData) => {
                if (task.userUpdates) {
                    task.userIds = task.userUpdates.map(update => update.userId);
                }
            });
            setTasks(tasks);
        };
    
        fetchTasks();
    }, []);

    const handleCreateTask = async (task: TaskData) => {
        const newTask = await createTask(task);
        setTasks([...tasks, newTask]);
        onClose();
    };

    return (
        <Flex flexDirection='column' justifyContent='space-between' alignItems='flex-start' gap='4'>
            <Button colorScheme="yellow" onClick={onOpen}>Create Task</Button>

            <TaskDialog
                isOpen={isOpen}
                onClose={onClose}
                cancelRef={cancelRef}
                initialValues={{
                    description: '',
                    status: 'Backlog',
                    priority: 'Low',
                    dueDate: '',
                    jobId: [],
                    userIds: [],
                }}
                validationSchema={taskValidationSchema}
                onSubmit={(values, actions) => {
                    handleCreateTask(values);
                    actions.setSubmitting(false);
                }}
            />

            <TaskList tasks={tasks} setTasks={setTasks} />
        </Flex>
    );
};

export default Task;