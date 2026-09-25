import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { ThemeProvider } from '@/context/ThemeContext';

/**
 * App — root component.
 * Delegates all rendering to the router; Navbar lives inside RootLayout
 * where it has access to the router context (useLocation).
 */
const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
