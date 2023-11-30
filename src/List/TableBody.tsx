import { useNavigate } from 'react-router-dom';
import { Tooltip, Button, Select, Box, Tbody, Tr, Td } from "@chakra-ui/react";

/* FontAwesome import */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from "@fortawesome/free-solid-svg-icons";

/* Services */
import { putOpportunity } from "../services/jobService";

import { JobData, TableBodyProps } from "../interfaces";


const TableBody: React.FC<TableBodyProps> = ({ jobs, columns }) => {
    const navigate = useNavigate();

    const status = [
        {
            "label": "positive",
            "value": "positive"
        },
        {
            "label": "negative",
            "value": "negative"
        },
        {
            "label": "expired",
            "value": "expired"
        },
        {
            "label": "in progress",
            "value": "in progress"
        },
        {
            "label": "——",
            "value": "unkwnown"
        }
    ];

    const mouseDownHandler = (accessor: string, tData: string, data: JobData, event: React.MouseEvent) => {
        if (event.button === 0 || event.button === 1) {
            if (accessor !== 'decision') {
                if (accessor === 'link') {
                    window.open(tData, '_blank')
                } else {
                    navigate(`/job/${data.id}`)
                }
            }
        }
    }

    const handleChange = (data: JobData, event: React.ChangeEvent<HTMLSelectElement>) => {
        const opportunity = { ...data, decision: event.target.value };

        if (!opportunity.id) return;

        putOpportunity(opportunity)
            .then((res) => {
                if (res.status === 200) {
                    const jobs = JSON.parse(localStorage.getItem('jobs')!);
                    const index = jobs.findIndex((job: JobData) => job.id === opportunity.id);
                    jobs[index].decision = event.target.value;
                    localStorage.setItem('jobs', JSON.stringify(jobs));

                    window.location.reload();
                } else {
                    console.log('Error updating the decision')
                }
            }).catch(err => {
                console.log(err)
            })
    }

    function tdFiller(accessor: string, tData: string, data: JobData) {
        if (accessor === 'link') {
            return (
                <Box>
                    <Tooltip label={tData} id={`tooltip-${data.id}`}>
                        <Button leftIcon={<FontAwesomeIcon icon={faLink} />} variant="link" />
                    </Tooltip>
                </Box>
            )
        }


        if (accessor === 'applicationDate') {
            return new Date(tData).toLocaleDateString();
        }

        if (accessor === 'decision') {
            // Add the unique identifier to the input element's "id" attribute
            const inputId = `decision-${data.id}`;

            return (
                <Select
                    aria-label="Final decision on the candidacy"
                    id={inputId}
                    name="decision"
                    size="sm"
                    textAlign={'center'}
                    onChange={(event) => handleChange(data, event)}
                    minW="120px"
                >
                    <option>{tData}</option>

                    {status.map((status) => {
                        return (tData === status.label ? null : <option key={status.value} value={status.value}>{status.label}</option>)
                    })}
                </Select>
            )
        }

        return tData;
    }

    if (jobs) {
        return (
            <Tbody>
                {jobs.map((data) => {
                    return (
                        <Tr
                            key={data.id}
                            className={data.decision === 'in progress' ? 'bg-in-progress' : `bg-${data.decision}`}
                        >
                            {columns.map(({ accessor }) => {
                                const tData = data[accessor];
                                if (typeof tData === 'string') {
                                    const displayData = tData !== "unknown" ? tData : "——";
                                    return (
                                        <Td
                                            key={accessor}
                                            onMouseDown={(event) => mouseDownHandler(accessor, displayData, data, event)}
                                        >
                                            {tdFiller(accessor, displayData, data)}
                                        </Td>
                                    )
                                }
                            })}
                        </Tr>
                    );
                })}
            </Tbody>
        );
    }
};

export default TableBody;