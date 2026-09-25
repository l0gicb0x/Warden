import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ThemeToggle — Minimalist, high-tactile Dark / Light mode toggle
 * Replaces the heavy ZenShieldDial with a clean, responsive switch.
 */
const ThemeToggle = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl border border-warden-border/70 bg-warden-surface/60 hover:bg-warden-surface hover:border-warden-primary/50 text-warden-text/80 hover:text-warden-primary transition-all duration-300 flex items-center justify-center group cursor-pointer ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-warden-primary transition-colors" />
        ) : (
          <Sun className="h-4 w-4 text-amber-500 transition-colors" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
