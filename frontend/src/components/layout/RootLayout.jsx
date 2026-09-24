import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

/**
 * RootLayout — top-level shell wrapping all routed pages.
 * Provides the Sonner toast container, the main layout grid,
 * and the <Outlet /> where page content renders.
 */
const RootLayout = () => {
  return (
    <div className="relative min-h-dvh flex flex-col bg-warden-bg">
      {/* Global toast container — top-right, dark themed */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass',
          style: {
            background: 'hsl(var(--warden-surface))',
            color: 'hsl(var(--warden-text))',
            border: '1px solid hsl(var(--warden-border) / 0.4)',
          },
        }}
      />

      {/* Main content area */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
