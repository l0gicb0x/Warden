import { Link } from 'react-router-dom';
import FadeIn from '@/components/motion/FadeIn';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <FadeIn>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-8xl font-bold text-warden-primary/20">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-warden-text">Page not found</h1>
        <p className="mt-2 text-sm text-warden-text/50">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-warden-primary/10 text-warden-primary text-sm font-medium
                     hover:bg-warden-primary/20 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </FadeIn>
  );
};

export default NotFoundPage;
