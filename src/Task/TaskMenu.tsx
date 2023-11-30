import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerOverlay, Link, VStack, useDisclosure } from "@chakra-ui/react";
import { TaskData, TaskMenuProps } from "../interfaces";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { createTask } from "../services/taskService";

const TaskMenu: React.FC<TaskMenuProps> = ({ task, setSelectedTask, onOpen, onOpenDuplicate, onOpenEdit, tasks, setTasks }) => {
    const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure();
    const btnRef = useRef<HTMLButtonElement>(null);
    
    const handleDeleteClick = (task: TaskData) => {
        setSelectedTask(task);
        onOpen();
    }

    const openModal = (task: TaskData) => {
        setSelectedTask(task);
        onOpenDuplicate();
    }

    const onDuplicate = async (task: TaskData) => {
        const { description, status, priority, dueDate, jobId, userIds } = task;
        const newTask: TaskData = {
            description,
            status,
            priority,
            dueDate,
            jobId,
            userIds
        };
        const responseTask = await createTask(newTask);
        setTasks([...tasks, responseTask]);
    }
    
    return (
        <>
            <Button
                ref={btnRef}
                onClick={onOpenDrawer}
                aria-label='Task option'
            >
                <FontAwesomeIcon icon={faEllipsis} />
            </Button>
            <Drawer
                isOpen={isOpenDrawer}
                placement='top'
                onClose={onCloseDrawer}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <VStack spacing={4} p={6}>
                            <Link
                                onClick={() => {
                                    openModal(task);
                                    onCloseDrawer();
                                }}
                            >
                                See Update(s)
                            </Link>
                            <Link
                                onClick={() => {
                                    setSelectedTask(task);
                                    onCloseDrawer();
                                    onOpenEdit();
                                }}
                            >
                                Edit
                            </Link>
                            <Link
                                onClick={() => {
                                    onCloseDrawer();
                                    onDuplicate(task)
                                }}
                            >
                                Duplicate
                            </Link>
                            <Link
                                onClick={() => {
                                    onCloseDrawer();
                                    handleDeleteClick(task)
                                }}
                            >
                                Delete
                            </Link>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
};

export default TaskMenu;