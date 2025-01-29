import { useSelector } from 'react-redux';
import AuthView from '../Auth/Auth'
import Toaster from './Toaster';
import Loader from './Loader';
import Header from '../Header/Header';
import { Outlet } from 'react-router-dom';
import { Box, Flex, useBreakpointValue } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import { AuthState } from '../interfaces';

interface AppState {
  auth: AuthState;
  loading: boolean;
}

function Layout() {
  const isAuthenticated = useSelector((state: { auth: AuthState }) => state.auth.isAuthenticated);
  const isLoading = useSelector((state: AppState) => state.loading);
  const isLargerThanMD = useBreakpointValue({ base: false, md: true });

  return (
    <>
      {isLoading && <Loader />}

      <Box className='app'>
        <Box className='page'>
          <Header />

          {isAuthenticated ? (
            <Flex
              maxW={'1280px'}
              margin={'auto'}
            >
              {isLargerThanMD && <Sidebar />}
              <Box className="background-container">
                <main className="main-container">
                  <Outlet />
                </main>
              </Box>
            </Flex>
          ) : (
            <Flex
              maxW={'1280px'}
              margin={'auto'}
            >
              <Box className="background-container">
                <main className="main-container">
                  <AuthView />
                </main>
              </Box>
            </Flex>
          )}

        </Box>
      </Box>


      <Toaster />
    </>
  )
}

export default Layout;