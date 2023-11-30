import { useState } from "react";
import { TableHeadProps } from "../interfaces";

/* FontAwesome import */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown, faSort } from "@fortawesome/free-solid-svg-icons";

import './List.css';
import { Th, Thead, Tr } from "@chakra-ui/react";

const TableHead: React.FC<TableHeadProps> = ({ columns, handleSorting }) => {
    const [sortField, setSortField] = useState<string>("");
    const [order, setOrder] = useState<string>("asc");

    const handleSortingChange = (accessor: string) => {
        const sortOrder: 'asc' | 'desc' =
            accessor === sortField && order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder);
        handleSorting(accessor, sortOrder);
    };

    return (
        <Thead>
            <Tr>
                {columns.map(({ label, accessor, sortable }) => {
                    const cl = sortable
                        ? sortField === accessor && order === "asc"
                            ? "up" : sortField === accessor && order === "desc"
                                ? "down" : "default"
                        : "none";
                    return (
                        <Th
                            key={accessor}
                            id={'th-' + accessor}
                            onClick={sortable ? () => handleSortingChange(accessor) : undefined}

                        >
                            <div className="th-content">
                                {label}

                                <div className="sort-icon">
                                    <FontAwesomeIcon icon={faSortUp} id="sortUp" className={cl} />
                                    <FontAwesomeIcon icon={faSortDown} id="sortDown" className={cl} />
                                    <FontAwesomeIcon icon={faSort} id="sortDefault" className={cl} />
                                </div>
                            </div>
                        </Th>
                    )
                })}
            </Tr>
        </Thead>
    );
};

export default TableHead;