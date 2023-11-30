import { useEffect, FC, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthState, SidebarLinkProps } from '../interfaces';
import { useSelector } from 'react-redux';
import { Box, Link, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTachographDigital, faHandshake, faChevronLeft, faChevronRight, faList } from '@fortawesome/free-solid-svg-icons';
import { getToken, setToken } from '../helpers/cookieHelper';

const SidebarLink: FC<SidebarLinkProps> = ({ to, text, label, icon }) => (
    <Link as={NavLink} to={to} aria-label={label}>
        <FontAwesomeIcon icon={icon} />
        <Text className="sidebar-text">{text}</Text>
    </Link>
);

const Sidebar: FC = () => {
    const isAuthenticated = useSelector((state: { auth: AuthState }) => state.auth.isAuthenticated);
    const [isSidebarClosed, setIsSidebarClosed] = useState(false);

    const toggleSidebar = (state: boolean) => {
        setIsSidebarClosed(state);
    };

    useEffect(() => {
        const isSidebarClosedFromStorage = getToken('isSidebarClosed') === 'true';
        toggleSidebar(isSidebarClosedFromStorage);
    }, []);

    useEffect(() => {
        setToken('isSidebarClosed', String(isSidebarClosed));
    }, [isSidebarClosed]);

    return (
        <>
            {isAuthenticated ? (
                <Box display={{ base: "none", sm: "flex" }} flexDirection="column" className={`sidebar ${isSidebarClosed ? 'closed' : ''}`}>
                    <Link className="sidebar-toggler px-0" onClick={() => toggleSidebar(!isSidebarClosed)}>
                        {isSidebarClosed ? (
                            <FontAwesomeIcon icon={faChevronRight} />
                        ) : (
                            <FontAwesomeIcon icon={faChevronLeft} />
                        )}
                    </Link>

                    <SidebarLink to="/dashboard" text="Dashboard" label="Get all the statistics from your job applications through the dashboard." icon={faTachographDigital} />
                    <SidebarLink to="/list" text="List of applications" label="Navigate to the home page. See all your job applications." icon={faList} />
                    <SidebarLink to="/create" text="Add a job application" label="Manually add a job application." icon={faCirclePlus} />
                    <SidebarLink to="/job-boards" text="Job Boards" label="See the list of all your job boards" icon={faHandshake} />
                </Box>
            ) : null}
        </>
    );
}

export default Sidebar;