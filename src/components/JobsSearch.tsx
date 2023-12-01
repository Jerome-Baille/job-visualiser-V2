import { useContext, ChangeEvent, FC } from "react";
import { JobsContext } from "../contexts/JobsContext";
import { Input } from "@chakra-ui/react";
import { JobData } from "../interfaces";

interface JobsSearchProps {
    setJobFiltered: (jobs: JobData[]) => void;
    searchValue: string;
    setSearchValue: (value: string) => void;
}

const JobsSearch: FC<JobsSearchProps> = ({ setJobFiltered, searchValue, setSearchValue }) => {
    const jobs = useContext(JobsContext);

    const filterJobs = (searchValue: string) => {
        return jobs.filter(job =>
            job.name?.toLowerCase().includes(searchValue) ||
            job.company?.toLowerCase().includes(searchValue)
        );
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchValue(searchValue);
        setJobFiltered(filterJobs(searchValue));
    };

    return (
        <Input
            type="text"
            placeholder="Enter job title or company name"
            value={searchValue}
            onChange={handleSearch}
        />
    )
};

export default JobsSearch;