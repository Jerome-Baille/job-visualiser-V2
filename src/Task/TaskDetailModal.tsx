import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Box, Text, Flex, IconButton, Textarea } from "@chakra-ui/react"
import { TaskData } from "../interfaces";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import { addUpdate } from "../services/taskService";

interface TaskDetailsModalProps {
  task: TaskData;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, isOpen, onClose }) => {
  const [showInput, setShowInput] = useState(false);
  const [newUpdate, setNewUpdate] = useState('');

  const handleValidateUpdate = async () => {
    if (!task.id || !task.userUpdates) return;
    const taskId = task.id;
    const response = await addUpdate(taskId, newUpdate);
    setShowInput(false);

    const { userId, update } = response;

    // Find the index of the userUpdate that matches the userId
    const index = task.userUpdates.findIndex(userUpdate => userUpdate.userId === userId);

    // If a matching userUpdate is found, update it
    if (index !== -1) {
      task.userUpdates[index].update = update;
    } else {
      // If no matching userUpdate is found, add a new one
      task.userUpdates.push({ userId, update });
    }
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Update on the task
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex flexDirection={"column"} gap="1rem">
            <Flex justifyContent="space-between" alignItems="center">
              {showInput ? (
                <Flex justifyContent="space-between" gap="8px" w="100%">
                  <Textarea value={newUpdate} onChange={(e) => setNewUpdate(e.target.value)} />
                  <IconButton
                    aria-label="Validate update"
                    icon={<FontAwesomeIcon icon={faCheck} />}
                    onClick={handleValidateUpdate}
                  />
                  <IconButton
                    aria-label="Cancel update"
                    icon={<FontAwesomeIcon icon={faTimes} />}
                    onClick={() => setShowInput(false)}
                  />
                </Flex>
              ) : (
                <IconButton
                  aria-label="Add update"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  isRound
                  onClick={() => setShowInput(true)}
                />
              )}
            </Flex>

            {task.userUpdates && task.userUpdates.filter(update => update.update).length > 0 ? (
              task.userUpdates.filter(update => update.update).map((update, index) => (
                <Box key={index} p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md" mb={4}>
                  <Text fontWeight="bold">User ID: {update.userId}</Text>
                  <Text mt={2}>{update.update}</Text>
                </Box>
              ))
            ) : (
              <Text>No updates available.</Text>
            )}
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TaskDetailsModal