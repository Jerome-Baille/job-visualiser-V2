import { useState, useEffect } from 'react';
import { getOpportunities } from '../services/jobService';
import { useSelector } from 'react-redux';
import { AuthState, JobData } from '../interfaces';

import NotLogged from '../components/NotLogged';
import InProgressJobs from './InProgressJobs';
import { Box, Flex, Grid, Stack, Text, VStack } from "@chakra-ui/react";
import ChartContainer from './ChartContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleQuestion, faCircleXmark, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import Task from '../Task/Task';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface JobBoxProps {
    icon: IconProp;
    title: string;
    jobs: number;
    color: string;
}

const Dashboard = () => {
    const [jobs, setJobs] = useState<JobData[]>([]);
    const isAuthenticated = useSelector((state: { auth: AuthState }) => state.auth.isAuthenticated);

    useEffect(() => {
        getOpportunities()
            .then(data => {
                setJobs(data)
            })
    }, []);

    const positiveJobs = jobs.filter(job => job.decision === 'positive').length;
    const inProgressJobs = jobs.filter(job => job.decision === 'in progress').length;
    const unknownJobs = jobs.filter(job => job.decision === 'unknown' || job.decision === 'expired').length;
    const negativeJobs = jobs.filter(job => job.decision === 'negative').length;

    const JobBox: React.FC<JobBoxProps> = ({ icon, title, jobs, color }) => (
        <Box color={color} className='box-status'>
            <VStack gap={4}>
                <FontAwesomeIcon icon={icon} size="xl" />

                <Flex justify="center" align="center" gap="4">
                    <Text size="md">{title} <strong>{jobs}</strong></Text>
                </Flex>
            </VStack>
        </Box>
    );

    return (
        <Box>
            <Box>
                {isAuthenticated ? (
                    <Stack spacing={4}>
                        <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                            <JobBox icon={faCircleCheck} title="Positive" jobs={positiveJobs} color='green.500' />
                            <JobBox icon={faHourglassHalf} title="In Progress" jobs={inProgressJobs} color='blue.500' />
                            <JobBox icon={faCircleQuestion} title="Unknown" jobs={unknownJobs} color='gray.900' />
                            <JobBox icon={faCircleXmark} title="Negative" jobs={negativeJobs} color='red.700' />
                        </Grid>

                        <Task />

                        <ChartContainer jobs={jobs} />

                        <InProgressJobs jobs={jobs} />
                    </Stack>
                ) : (
                    <NotLogged />
                )}
            </Box>
        </Box>
    );
};

export default Dashboard;