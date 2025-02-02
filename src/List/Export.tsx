import { useState } from 'react';
import { exportOpportunities } from '../services/jobService';
import { Button, Select, Flex } from "@chakra-ui/react";
import { showToast } from '../services/toastService';

type FormatType = 'excel' | 'pdf' | '';
type YearType = string;

function ExportData() {
    const [selectedFormat, setSelectedFormat] = useState<FormatType>('');
    const [selectedYear, setSelectedYear] = useState<YearType>('');

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 2022; year <= currentYear; year++) {
        years.push(year);
    }

    // Download the data as an excel file or a PDF file
    const handleExportClick = async () => {
        try {
            await exportOpportunities(selectedYear, selectedFormat)

            // Display success toast
            showToast({
                type: 'success',
                message: `Your data has been exported successfully!`,
            });
        } catch (error) {
            console.log(error);

            // Display success toast
            showToast({
                type: 'error',
                message: `An error occurred while exporting your data. Please try again later or contact the administrator if the problem persists. Thank you!`,
            });
        }
    };

    return (
        <Flex
            alignItems='center'
            justifyContent='space-evenly'
            flexDirection='column'
            gap={4}
        >
            <Select
                value={selectedYear}
                id='export-year'
                onChange={(e) => setSelectedYear(e.target.value as YearType)}
            >
                <option value="">Select a year</option>
                {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
                <option value="0000">All</option>
            </Select>
            <Select
                value={selectedFormat}
                id='export-format'
                onChange={(e) => setSelectedFormat(e.target.value as FormatType)}
            >
                <option value="">Select a format</option>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
            </Select>
            <Button
                variant="outline"
                colorScheme="blue"
                onClick={handleExportClick}
                isDisabled={!selectedFormat && !selectedYear}
            >
                Export
            </Button>
        </Flex>
    );
}

export default ExportData;