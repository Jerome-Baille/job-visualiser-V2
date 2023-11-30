import { useEffect, useMemo, useState } from "react";
import { JobData } from "../interfaces";

/* Components import */
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import { TableFilter } from "./TableFilter";
import useWindowSize from "../helpers/useWindowSize";

/* Services */
import { getOpportunities } from "../services/jobService";
import { Paginator } from "./Paginator";
import { Card, CardBody, Table, TableCaption, VStack } from "@chakra-ui/react";


const ListTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(20);
    const windowSize = useWindowSize();

    const [jobs, setJobs] = useState<JobData[]>([]);
    const [jobFiltered, setJobFiltered] = useState<JobData[]>([]);

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const slicedJobs = jobs.slice(indexOfFirstRecord, indexOfLastRecord);
    const slicedJobFiltered = jobFiltered.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = useMemo(() => {
        const pageCount = Math.ceil((jobFiltered ? jobFiltered.length : jobs.length) / recordsPerPage);
        return pageCount;
    }, [jobFiltered, jobs, recordsPerPage])

    useEffect(() => {
        getOpportunities()
            .then(data => {
                setJobs(data)
                setJobFiltered(data)
            })
    }, [])

    let columns = [];

    if (windowSize.width > 768) {
        columns = [
            { label: "Job position", accessor: "name", sortable: true },
            { label: "Company", accessor: "company", sortable: true },
            { label: "Type", accessor: "type", sortable: false },
            { label: "Date", accessor: "applicationDate", sortable: true },
            { label: "Decision", accessor: "decision", sortable: false },
        ];
    } else {
        columns = [
            { label: "Title", accessor: "name", sortable: true },
            { label: "Company", accessor: "company", sortable: true },
        ];
    }

    const handleSorting = (sortField: keyof JobData, sortOrder: 'asc' | 'desc') => {
        if (sortField) {
            const sorted = [...jobFiltered].sort((a, b) => {
                const aValue = a[sortField as keyof JobData];
                const bValue = b[sortField as keyof JobData];

                if (aValue === null) return 1;
                if (bValue === null) return -1;
                if (aValue === null && bValue === null) return 0;

                return (
                    (typeof aValue === 'string' ? aValue : '').localeCompare((typeof bValue === 'string' ? bValue : ''), "en", {
                        numeric: true,
                    }) * (sortOrder === "asc" ? 1 : -1)
                );
            });

            jobFiltered === jobs ? setJobs(sorted) : setJobFiltered(sorted);
        }
    };

    return (
        <VStack align='stretch' gap={4}>
            <TableFilter
                jobs={jobs}
                setJobFiltered={setJobFiltered}
            />

            <Card>
                <CardBody>
                    <Table variant='simple' className="table table-main">
                        {jobFiltered.length === 0 ? <tbody><tr><td className="no-data" colSpan={7}>There is no data available</td></tr></tbody> : null}
                        <TableHead columns={columns} handleSorting={handleSorting} />
                        <TableBody columns={columns} jobs={jobFiltered === jobs ? slicedJobs : slicedJobFiltered} />

                        <TableCaption>
                            {jobFiltered.length} results out of {jobs.length} job applications
                        </TableCaption>
                    </Table>
                </CardBody>
            </Card>

            <Paginator
                nPages={nPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </VStack>
    );
};

export default ListTable;