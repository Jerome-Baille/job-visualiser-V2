import { Box, Heading, Text, Button, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Page404 = () => {
    return (
        <Box w="100%" h="100vh" bg="gray.200">
            <Center h="100%">
                <Box textAlign="center">
                    <Heading as="h1" size="2xl" fontWeight="bold" mb="2">
                        404
                    </Heading>
                    <Text fontSize="xl" color="red.500" mb="2">
                        Oops!&nbsp;Page not found.
                    </Text>
                    <Text fontSize="lg" mb="4">
                        The page you are looking for does not exist.
                    </Text>
                    <Button as={Link} to="/" colorScheme="blue">
                        Go Home
                    </Button>
                </Box>
            </Center>
        </Box>
    );
}

export default Page404;