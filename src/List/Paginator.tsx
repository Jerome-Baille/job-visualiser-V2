import { Box, Button } from '@chakra-ui/react';

interface PaginationProps {
    nPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export const Paginator: React.FC<PaginationProps> = ({ nPages, currentPage, setCurrentPage }) => {

    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)
    const middleArr = pageNumbers.slice(Math.max(currentPage -1, 1) -1, Math.min(currentPage + 1, nPages))

    const firstPage = () => {
        setCurrentPage(1)
    }

    const nextPage = () => {
        if(currentPage !== nPages) setCurrentPage(currentPage + 1)
    }
    const prevPage = () => {
        if(currentPage !== 1) setCurrentPage(currentPage - 1)
    }

    const lastPage = () => {
        setCurrentPage(nPages)
    }
    
    return (
        <Box display="flex" justifyContent="center" alignItems="center" gap="4">
            {currentPage > 1 && 
            <>
                <Button colorScheme='yellow' onClick={firstPage}>First</Button>
                <Button colorScheme='yellow' onClick={prevPage}>Prev</Button>
                {currentPage > 2 && <Button colorScheme='yellow' onClick={firstPage}>{1}</Button>}
                {currentPage > 3 && <Button colorScheme='yellow' isDisabled>...</Button>}
            </>
            }
            {middleArr.map(pgNumber => (
                <Button 
                    key={pgNumber} 
                    colorScheme='yellow'
                    onClick={() => setCurrentPage(pgNumber)}
                >
                    {pgNumber}
                </Button>
            ))}
            {currentPage < nPages && 
            <>
                <Button colorScheme='yellow' onClick={nextPage}>Next</Button>
                <Button colorScheme='yellow' onClick={lastPage}>Last</Button>
            </>
            }
        </Box>
    )
}