import { Heading, Text, Card, CardHeader, VStack, CardBody, CardFooter, StackDivider, Box } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTachographDigital, faHandshake, faList } from '@fortawesome/free-solid-svg-icons';

function HowToUse() {
    return (
        <Card>
            <CardHeader>
                <VStack spacing={2} align="stretch">
                    <Heading as="h1">How to Use the App</Heading>
                    <Text>Welcome to the app! Here's a step-by-step guide on how to make the most of its features:</Text>
                </VStack>
            </CardHeader>

            <CardBody>
                <VStack divider={<StackDivider />} spacing="4">
                    <Box>
                        <Heading display="flex" justifyContent="center" gap="4">
                            <FontAwesomeIcon icon={faTachographDigital} />
                            Dashboard: Monitor Your Progress
                        </Heading>

                        <Text>The dashboard serves as your command center. Here's what you can find:</Text>
                        <Text>Job Search Statistics: Keep track of your total applications, interviews, and offers.</Text>
                        <Text>To-Do List: Stay organized by adding tasks that need attention. Tick them off as you go!</Text>
                        <Text>Ongoing Interviews: See a list of applications that have interviews in progress.</Text>
                    </Box>

                    <Box>
                        <Heading display="flex" justifyContent="center" gap="4">
                            <FontAwesomeIcon icon={faList} />
                            List of Job Applications: Manage Your Applications
                        </Heading>
                        <Text>Your applications are neatly organized in a table:</Text>
                        <Text>Use the filter options to sort by status, date, or other criteria.</Text>
                        <Text>Search for specific applications using the search input.</Text>
                        <Text>Click on an application to view or edit its details.</Text>
                        <Text>Update the status as your application progresses through the pipeline.</Text>
                    </Box>

                    <Box>
                        <Heading display="flex" justifyContent="center" gap="4">
                            <FontAwesomeIcon icon={faCirclePlus} />
                            Create Job Application: Add New Opportunities
                        </Heading>
                        <Text>Ready to apply for a new job? Here's how:</Text>
                        <Text>Click on "Create" and fill in the necessary details.</Text>
                        <Text>Include the job title, company, application status, and more.</Text>
                        <Text>Hit "Save" to add the application to your list.</Text>
                    </Box>

                    <Box>
                        <Heading display="flex" justifyContent="center" gap="4">
                            <FontAwesomeIcon icon={faHandshake} />
                            Job Boards: Explore Available Opportunities
                        </Heading>
                        <Text>Discover new opportunities from various job boards:</Text>
                        <Text>Browse a list of job boards to find openings that match your interests.</Text>
                        <Text>Click on a board to view its current listings.</Text>
                        <Text>Apply for positions directly through the linked listings.</Text>
                    </Box>
                </VStack>
            </CardBody>

            <CardFooter>
                <Text>
                    Now that you have a better understanding of the app's features, you're ready to take control of your job search journey!
                </Text>
            </CardFooter>
        </Card >
    );
}

export default HowToUse;