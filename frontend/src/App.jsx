import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';

/**
 * App — root component.
 * Delegates all rendering to the router; Navbar lives inside RootLayout
 * where it has access to the router context (useLocation).
 */
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
