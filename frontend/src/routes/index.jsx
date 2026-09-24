import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';

/**
 * Placeholder pages — replace with real page components as features are built.
 */
import DashboardPage from '@/pages/DashboardPage';
import RunsPage from '@/pages/RunsPage';
import TrapsPage from '@/pages/TrapsPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'runs', element: <RunsPage /> },
      { path: 'traps', element: <TrapsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
