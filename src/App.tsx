// React related imports
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Component imports
import Dashboard from './Dashboard/Dashboard';
import Layout from './components/Layout';
import Loader from './components/Loader';
import Page404 from './components/Page404';

// Lazy imports
const Create = lazy(() => import('./Create/Create'));
const Detail = lazy(() => import('./List/Detail'));
const HowToUse = lazy(() => import('./HowToUse/HowToUse'));
const JobBoards = lazy(() => import('./JobBoards/JobBoards'));
const List = lazy(() => import('./List/List'));
const Profile = lazy(() => import('./Profile/Profile'));

import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />} path='/'>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="Create" element={<Suspense fallback={<Loader />}><Create /></Suspense>} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="List" element={<Suspense fallback={<Loader />}><List /></Suspense>} />
        <Route path="Job-boards" element={<Suspense fallback={<Loader />}><JobBoards /></Suspense>} />
        <Route path="Profile" element={<Suspense fallback={<Loader />}><Profile /></Suspense>} />
        <Route path="How-to-use" element={<Suspense fallback={<Loader />}><HowToUse /></Suspense>} />
        <Route path="/job/:id" element={<Suspense fallback={<Loader />}><Detail /></Suspense>} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export default App;