import { useState, useEffect, useRef } from 'react';
import { LineChart, BarChart } from './ChartPresentation';
import { Box, Select, Card, CardHeader, CardBody, CardFooter, Grid } from "@chakra-ui/react";
import { DashboardProps, JobData } from '../interfaces';

const ChartContainer = ({ jobs }: DashboardProps) => {
    const [selectedWeek, setSelectedWeek] = useState(0); // Default: current week
    const lineChartCardBodyRef = useRef(null);
    const barChartCardBodyRef = useRef(null);
    const [lineChartDimension, setLineChartDimension] = useState({ height: 300, width: 400 });
    const [barChartDimension, setBarChartDimension] = useState({ height: 300, width: 400 });

    const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWeek(parseInt(event.target.value, 10));
    };

    // Define the month order array
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Data processing for line chart (applications per month)
    const today = new Date();
    const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(today);
        date.setMonth(today.getMonth() - 5 + i);
        return date;
    });

    const applicationsPerMonth: { [key: string]: number } = last6Months.reduce((result: { [key: string]: number }, currentDate) => {
        const month = monthOrder[currentDate.getMonth()];
        result[month] = 0; // Initialize count to 0 for each month
        return result;
    }, {});

    const monthsWithData = new Set(); // Keep track of months with data

    jobs.forEach((job: JobData) => {
        if (job.applicationDate) {
            const jobDate = new Date(job.applicationDate);
            if (jobDate >= last6Months[0] && jobDate <= last6Months[last6Months.length - 1]) {
                const month = monthOrder[jobDate.getMonth()];
                if (Object.prototype.hasOwnProperty.call(applicationsPerMonth, month)) {
                    applicationsPerMonth[month]++;
                    monthsWithData.add(month); // Mark month as having data
                }
            }
        }
    });

    const monthlyApplicationData = monthOrder
        .filter(month => monthsWithData.has(month)) // Filter out months without data
        .map(month => ({
            month,
            count: applicationsPerMonth[month] || 0,
        }));

    // Data processing for bar chart (applications per day over the selected week)
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const previousMonday = new Date(today);
    previousMonday.setDate(today.getDate() - today.getDay() + 1 - (today.getDay() === 0 ? 7 : 0));  // Go back to previous Monday
    const mondayOfSelectedWeek = new Date(previousMonday);
    mondayOfSelectedWeek.setDate(previousMonday.getDate() - selectedWeek * 7);
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(mondayOfSelectedWeek);
        date.setDate(mondayOfSelectedWeek.getDate() + i);
        return date;
    });

    const applicationsPerDay = dayNames.map((dayName, dayIndex) => ({
        day: dayName,
        count: jobs.filter((job: JobData) => {
            if (!job.applicationDate) {
                return false;
            }

            const applicationDate = new Date(job.applicationDate);
            return applicationDate.getDay() === (dayIndex + 1) % 7 && // Adjust the index
                lastSevenDays.some(day => day.toDateString() === applicationDate.toDateString());
        }).length,
    }));

    const weekLabels = [
        `From ${lastSevenDays[0].getDate().toString().padStart(2, '0')}-${(lastSevenDays[0].getMonth() + 1).toString().padStart(2, '0')} to ${lastSevenDays[6].getDate().toString().padStart(2, '0')}-${(lastSevenDays[6].getMonth() + 1).toString().padStart(2, '0')}`,
        `From ${new Date(lastSevenDays[0].setDate(lastSevenDays[0].getDate() - 7)).getDate().toString().padStart(2, '0')}-${(new Date(lastSevenDays[0].setDate(lastSevenDays[0].getDate() - 7)).getMonth() + 1).toString().padStart(2, '0')} to ${new Date(lastSevenDays[6].setDate(lastSevenDays[6].getDate() - 7)).getDate().toString().padStart(2, '0')}-${(new Date(lastSevenDays[6].setDate(lastSevenDays[6].getDate() - 7)).getMonth() + 1).toString().padStart(2, '0')}`,
        `From ${new Date(lastSevenDays[0].setDate(lastSevenDays[0].getDate() - 14)).getDate().toString().padStart(2, '0')}-${(new Date(lastSevenDays[0].setDate(lastSevenDays[0].getDate() - 14)).getMonth() + 1).toString().padStart(2, '0')} to ${new Date(lastSevenDays[6].setDate(lastSevenDays[6].getDate() - 14)).getDate().toString().padStart(2, '0')}-${(new Date(lastSevenDays[6].setDate(lastSevenDays[6].getDate() - 14)).getMonth() + 1).toString().padStart(2, '0')}`
    ];

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                if (entry.target === lineChartCardBodyRef.current) {
                    setLineChartDimension({
                        height: entry.contentRect.height,
                        width: entry.contentRect.width
                    });
                }
                if (entry.target === barChartCardBodyRef.current) {
                    setBarChartDimension({
                        height: entry.contentRect.height,
                        width: entry.contentRect.width
                    });
                }
            });
        });

        if (lineChartCardBodyRef.current) {
            resizeObserver.observe(lineChartCardBodyRef.current);
        }
        if (barChartCardBodyRef.current) {
            resizeObserver.observe(barChartCardBodyRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [lineChartCardBodyRef, barChartCardBodyRef]);

    return (
        <Box>
            <Grid templateColumns='repeat(auto-fit, minmax(190px, 1fr))' gap={4}>
                <Card maxH='500px'>
                    <CardHeader textAlign="center">
                        Applications per Month
                    </CardHeader>
                    <CardBody ref={lineChartCardBodyRef} id='line-chart-container'>
                        {lineChartDimension.width && lineChartDimension.height && (
                            <LineChart
                                data={monthlyApplicationData}
                                monthOrder={monthOrder}
                                width={lineChartDimension.width}
                                height={lineChartDimension.height}
                            />
                        )}
                    </CardBody>
                </Card>


                <Card maxH='500px'>
                    <CardHeader textAlign="center">
                        Applications per Day
                    </CardHeader>
                    <CardBody ref={barChartCardBodyRef} id="bar-chart-container">
                        {barChartDimension.width && barChartDimension.height && (
                            <BarChart
                                data={applicationsPerDay}
                                width={barChartDimension.width}
                                height={barChartDimension.height}
                            />
                        )}
                    </CardBody>
                    <CardFooter display="flex" flexDirection="column" justifyContent="flex-end">
                        <Select
                            aria-label="Select the week you want to display."
                            id="weekSelect"
                            value={selectedWeek}
                            onChange={handleWeekChange}
                            w="50%"
                            alignSelf="flex-end"
                        >
                            <option value={0}>{weekLabels[0]}</option>
                            <option value={1}>{weekLabels[1]}</option>
                            <option value={2}>{weekLabels[2]}</option>
                            {/* Add more options if needed */}
                        </Select>
                    </CardFooter>
                </Card>

            </Grid>
        </Box>
    );
};

export default ChartContainer;