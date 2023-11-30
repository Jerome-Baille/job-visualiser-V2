import { Box, Text, Flex, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Input, useDisclosure, Tag, Card, CardBody } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { updateTask, deleteTask } from '../services/taskService';
import { TaskData, TaskDataProps } from '../interfaces';
import { useRef, useState } from "react";

import { DragDropContext, Droppable, DropResult, Draggable } from 'react-beautiful-dnd';
import TaskDetailsModal from "./TaskDetailModal";
import TaskDialog from "./TaskDialog";
import { taskValidationSchema } from "../helpers/formValidationSchema";
import TaskMenu from "./TaskMenu";

const TaskList = ({ tasks, setTasks }: TaskDataProps) => {
    const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
    const { isOpen: isOpenDuplicate, onOpen: onOpenDuplicate, onClose: onCloseDuplicate } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const handleDescriptionChange = async (id: number, description: string) => {
        const taskToUpdate = tasks.find(task => task.id === id);
        if (taskToUpdate) {
            const updatedTask = await updateTask(id, { description });
            setTasks(tasks.map(task => task.id === id ? updatedTask : task));
        }
    };

    const onDelete = async (id: number) => {
        await deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));

        onClose();
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const taskId = parseInt(result.draggableId, 10);
        const newStatus = result.destination.droppableId as "Backlog" | "In Progress" | "Done";
        const taskToUpdate = tasks.find(task => task.id === taskId);
        if (taskToUpdate) {
            updateTask(taskId, { status: newStatus });

            setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));
        }
    };

    const statuses = ['Backlog', 'In Progress', 'Done'];

    const statusColorScheme: { [key: string]: string } = {
        'Backlog': 'lightblue',
        'In Progress': 'bisque',
        'Done': 'lightgreen'
    };

    const priorityColorScheme: { [key: string]: string } = {
        'Low': 'green',
        'Medium': 'orange',
        'High': 'red'
    };

    const onUpdate = async (values: TaskData) => {
        if (!selectedTask || !selectedTask.id) return;

        const taskId = selectedTask.id;

        // Calculate the changes
        const changes = Object.keys(values).reduce((acc: Record<string, unknown>, key) => {
            if (values[key] !== selectedTask[key]) {
                acc[key] = values[key];
            }
            return acc;
        }, {});

        // Only send the changes to the updateTask function
        const updatedTask = await updateTask(taskId, changes);

        setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
        onCloseEdit();
    }

    return (
        <>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
                    gap={4}
                    w='100%'
                >
                    {statuses.map((status) => (
                        <Droppable droppableId={status} key={status}>
                            {(provided) => (
                                <Box
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    display='flex'
                                    flexDirection='column'
                                    gap={4}
                                >
                                    <Text fontSize="xl" backgroundColor={status ? statusColorScheme[status] : 'black'}>{status}</Text>
                                    {tasks.filter(task => task.status === status).map((task, index) => (
                                        <Draggable draggableId={task.id !== null && task.id !== undefined ? task.id.toString() : ''} index={index} key={task.id !== null && task.id !== undefined ? task.id.toString() : ''}>
                                            {(provided) => (
                                                <Box
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <Card key={task.id}>
                                                        <CardBody>
                                                            <Flex flexDirection='column' gap={4}>
                                                                <Flex justifyContent='space-between' alignItems='center'>
                                                                    <Tag colorScheme={task.priority ? priorityColorScheme[task.priority] : 'black'}>{task.priority}</Tag>

                                                                    <TaskMenu
                                                                        task={task}
                                                                        setSelectedTask={setSelectedTask}
                                                                        onOpen={onOpen}
                                                                        onOpenDuplicate={onOpenDuplicate}
                                                                        onOpenEdit={onOpenEdit}
                                                                        tasks={tasks}
                                                                        setTasks={setTasks}
                                                                    />
                                                                </Flex>
                                                                <Input
                                                                    value={task.description}
                                                                    onChange={(e) => task.id && handleDescriptionChange(task.id, e.target.value)}
                                                                />

                                                                <Flex justifyContent='flex-start' alignItems='center'>
                                                                    <Flex alignItems='center' gap='2'>
                                                                        <FontAwesomeIcon icon={faClock} />
                                                                        <Text>
                                                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'No due date'}
                                                                        </Text>
                                                                    </Flex>
                                                                </Flex>
                                                            </Flex>
                                                        </CardBody>
                                                    </Card>
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>

                    ))}
                </Box>
            </DragDropContext>

            <TaskDialog
                isOpen={isOpenEdit}
                onClose={onCloseEdit}
                cancelRef={cancelRef}
                initialValues={{
                    description: selectedTask ? selectedTask.description : '',
                    status: selectedTask ? selectedTask.status : 'Backlog',
                    priority: selectedTask ? selectedTask.priority : 'Low',
                    dueDate: selectedTask && selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : '',
                    jobId: selectedTask ? selectedTask.jobId : [],
                    userIds: selectedTask ? selectedTask.userIds : [],
                }}
                validationSchema={taskValidationSchema}
                onSubmit={(values, actions) => {
                    onUpdate(values);
                    actions.setSubmitting(false);
                }}
            />

            {selectedTask && (
                <TaskDetailsModal task={selectedTask} isOpen={isOpenDuplicate} onClose={onCloseDuplicate} />
            )}

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
                            <Button colorScheme="red" onClick={() => selectedTask && selectedTask.id !== undefined && onDelete(selectedTask.id)} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default TaskList;