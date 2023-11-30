import { Button, Tab, Tabs, Stack, Box, TabList, TabPanel, TabPanels, VStack, Flex } from "@chakra-ui/react";
import ListTable from "./ListTable";
import ExportData from "./Export";

const List = () => {
    function handleRefresh() {
        localStorage.removeItem("jobs");
        window.location.reload();
    }

    return (
        <VStack spacing={4} align="strech">
            <Box className="home-tabs">
                <Tabs
                    defaultIndex={0}
                    variant="enclosed"
                    isFitted
                    p={4}
                >
                    <TabList mb="1em">
                        <Tab>Refresh</Tab>
                        <Tab>Color code</Tab>
                        <Tab>Export</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel>
                            <Flex
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Button
                                    variant="outline"
                                    colorScheme="blue"
                                    onClick={handleRefresh}
                                >
                                    Refresh
                                </Button>
                            </Flex>
                        </TabPanel>

                        <TabPanel>
                            <Stack spacing={3}>
                                <Box className="p-2 bg-negative">
                                    Red: you received a "negative" answer to your application
                                </Box>
                                <Box className="p-2 bg-positive">
                                    Green: you received a "positive" answer to your application
                                </Box>
                                <Box className="p-2 bg-in-progress">
                                    Blue: your application is "in progress" (you got an interview)
                                </Box>
                                <Box className="p-2 bg-expired">
                                    Grey: the job offer is no longer available but you did not receive any answer
                                </Box>
                                <Box className="p-2">
                                    White: the status of the job application is unknown at the moment
                                </Box>
                            </Stack>
                        </TabPanel>

                        <TabPanel>
                            <ExportData />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

            <ListTable />
        </VStack>
    );
};

export default List;