import { Box, Text, Button, Center, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotLogged = () => {
    return (
        <Center h="100vh">
            <Box textAlign="center">
                <Text fontSize="3xl">
                    <Box as="span" color="red.500">
                        Oops!&nbsp;
                    </Box>
                    You are not authorised here.
                </Text>
                <Text fontSize="lg">
                    Please login to access this page.
                </Text>
                <ChakraLink as={Link} to='/auth'>
                    <Button colorScheme="blue">Login</Button>
                </ChakraLink>
            </Box>
        </Center>
    );
}

export default NotLogged;