import { Table, Thead, Tbody, Tr, Th, Td, Card, CardHeader, CardBody } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { DashboardProps, JobData } from '../interfaces';

const InProgressJobs = ({ jobs }: DashboardProps) => {
    const navigate = useNavigate();

    return (
        <Card>
            <CardHeader>
                Job applications in progress ({jobs.filter((job: JobData) => job.decision === 'in progress').length})
            </CardHeader>
            <CardBody>
                <Table variant="striped" colorScheme="blue">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Company</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {jobs.filter((job: JobData) => job.decision === 'in progress').map((job: JobData) => (
                            <Tr key={`progress-${job._id}`} onClick={() => navigate(`/job/${job.id}`)}>
                                <Td>{job.name}</Td>
                                <Td>{job.company}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </CardBody>
        </Card>
    );
}

export default InProgressJobs;