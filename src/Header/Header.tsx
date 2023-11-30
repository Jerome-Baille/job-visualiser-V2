import { NavLink as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthState } from '../interfaces';
import logo from '../assets/img/job-visualizer-logo.png';

import { Box, Flex, IconButton, Link, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react";

/* FontAwesome imports */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCirclePlus, faList, faRightToBracket, faUser, faHandshake, faChartLine, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import AuthLogout from '../Auth/Logout';

export default function Header() {
    const { onOpen } = useDisclosure();
    const isAuthenticated = useSelector((state: { auth: AuthState }) => state.auth.isAuthenticated);

    return (
        <Box as="header" className='header'>
            <Flex bg="light" wrap="wrap" align="center" justify="space-between" p={4}>
                <Link as={RouterLink} to="/" p={'0 !important'} aria-label="Go to homepage">
                    <img src={logo} alt="Job Tracker logo" width={100} />
                </Link>

                <Box display={{ base: "block", md: "none" }} className='header-menu'>
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Open the menu"
                            icon={<FontAwesomeIcon icon={faBars} />}
                            variant='ghost'
                            onClick={onOpen}
                        />
                        <MenuList>
                            {isAuthenticated ?
                                <>
                                    <MenuItem
                                        icon={<FontAwesomeIcon icon={faChartLine} />}
                                        as={RouterLink}
                                        to="/dashboard"
                                        aria-label="Get all the statistics from your job applications through the dashboard."
                                    >
                                        Dashboard
                                    </MenuItem>

                                    <MenuItem
                                        icon={<FontAwesomeIcon icon={faList} />}
                                        as={RouterLink}
                                        to="/list"
                                        aria-label="Navigate to the home page. See all your job applications."
                                    >
                                        List of applications
                                    </MenuItem>

                                    <MenuItem
                                        icon={<FontAwesomeIcon icon={faCirclePlus} />}
                                        as={RouterLink}
                                        to="/create"
                                        aria-label="Manually add a job application."
                                    >
                                        Add a job application
                                    </MenuItem>

                                    <MenuItem
                                        icon={<FontAwesomeIcon icon={faHandshake} />}
                                        as={RouterLink}
                                        to="/job-boards"
                                        aria-label="See the list of all your job boards"
                                    >
                                        Job Boards
                                    </MenuItem>
                                </>
                                : null}

                            <MenuItem
                                icon={<FontAwesomeIcon icon={faCircleQuestion} />}
                                as={RouterLink}
                                to="/how-to-use"
                                aria-label="Learn how to use the app."
                            >
                                How does it work?
                            </MenuItem>

                            {isAuthenticated ?
                                <>
                                    <MenuItem
                                        icon={<FontAwesomeIcon icon={faUser} />}
                                        as={RouterLink}
                                        to="/profile"
                                        aria-label="See and update your profile."
                                    >
                                        Profile
                                    </MenuItem>
                                    <AuthLogout />
                                </> :
                                <MenuItem
                                    icon={<FontAwesomeIcon icon={faRightToBracket} />}
                                    as={RouterLink}
                                    to="/auth"
                                    aria-label="Log into your account"
                                >
                                    Login
                                </MenuItem>
                            }
                        </MenuList>
                    </Menu>
                </Box>

                <Box display={{ base: "none", md: "block" }}>
                    <Flex align="center">
                        <Link
                            as={RouterLink}
                            to="/how-to-use"
                            aria-label="Learn how to use the app."
                        >
                            <FontAwesomeIcon icon={faCircleQuestion} />
                            How does it work?
                        </Link>

                        {!isAuthenticated ?
                            <Link
                                as={RouterLink}
                                to="/auth"
                                aria-label="Log into your account"
                            >
                                <FontAwesomeIcon icon={faRightToBracket} />
                                <span>Login</span>
                            </Link>
                            :
                            <>
                                <Link
                                    as={RouterLink}
                                    to="/profile"
                                    aria-label="See the list of all your job boards"
                                >
                                    <FontAwesomeIcon icon={faUser} />
                                    Profile
                                </Link>
                                <AuthLogout />
                            </>
                        }
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
}