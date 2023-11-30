import { useState } from "react";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Box, FormControl, FormLabel, Input, Select, Button, HStack, VStack } from "@chakra-ui/react";
import { JobState } from "../interfaces";

export const TableFilter = ({ jobs, setJobFiltered }: JobState) => {
    const [filterForm, setFilterForm] = useState({
        search: "",
        typeFilter: "",
        decisionFilter: ""
    });

    function filterJobs(filterForm: { typeFilter: string, decisionFilter: string }) {
        const { typeFilter, decisionFilter } = filterForm;
        const typeFilterLower = typeFilter.toLowerCase();
        const decisionFilterLower = decisionFilter.toLowerCase();

        return jobs.filter(job => {
            const jobTypeLower = job.type ? job.type.toLowerCase() : '';
            const jobDecisionLower = job.decision?.toLowerCase() || '';

            const typeMatch = typeFilter === 'all' || jobTypeLower.includes(typeFilterLower);
            const decisionMatch = decisionFilter === 'all' || jobDecisionLower.includes(decisionFilterLower);

            return typeMatch && decisionMatch;
        });
    }

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const newFilterForm = {
            ...filterForm,
            [event.target.name]: event.target.value
        };

        setFilterForm(newFilterForm);

        const filtered = filterJobs(newFilterForm);
        setJobFiltered(filtered);
    }

    function handleReset() {
        setFilterForm({
            search: "",
            typeFilter: "",
            decisionFilter: ""
        });
        setJobFiltered(jobs)
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value.toLowerCase();

        setFilterForm({
            ...filterForm,
            search: searchValue
        });

        const filteredJobs = jobs.filter(job =>
            (job.name ? job.name.toLowerCase() : '').includes(searchValue) ||
            (job.company ? job.company.toLowerCase() : '').includes(searchValue)
        );

        setJobFiltered(filteredJobs);
    };


    return (
        <Accordion allowToggle className="home-tabs">
            <AccordionItem p={4}>
                <h2>
                    <AccordionButton>Search & Filter</AccordionButton>
                </h2>
                <AccordionPanel>
                    <VStack gap={4} align="stretch">
                        <Box as="form" onSubmit={handleSearch}>
                            <FormControl id="formSearch">
                                <FormLabel>Search</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter job title or company name"
                                    name="search"
                                    value={filterForm.search}
                                    onChange={handleSearch}
                                />
                            </FormControl>
                        </Box>

                        <HStack gap={4}>
                            <Select value={filterForm.typeFilter} placeholder="Filter by type" id="typeFilter" name="typeFilter" onChange={handleChange}>
                                <option value="all">All</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="on Site">On site</option>
                            </Select>

                            <Select value={filterForm.decisionFilter} placeholder="Filter by status" id="decisionFilter" name="decisionFilter" onChange={handleChange}>
                                <option value="all">All</option>
                                <option value="negative">negative</option>
                                <option value="positive">positive</option>
                                <option value="expired">expired</option>
                                <option value="in progress">in progress</option>
                                <option value="unknown">unknown</option>
                            </Select>
                            <Button colorScheme='yellow' size="md" onClick={handleReset}>
                                Reset
                            </Button>
                        </HStack>
                    </VStack>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}