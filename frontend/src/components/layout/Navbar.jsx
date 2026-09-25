import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, FlaskConical, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const navLinks = [
  { to: '/',         label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/runs',     label: 'Runs',       icon: Activity },
  { to: '/traps',    label: 'Traps',      icon: FlaskConical },
];

/**
 * Navbar — top navigation bar with glassmorphism styling.
 * Highlights the active route using warden-primary accent.
 */
const Navbar = () => {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 glass border-b border-warden-border/30 backdrop-blur-md">
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Shield
            className="h-7 w-7 text-warden-primary transition-transform duration-300 group-hover:scale-110"
            strokeWidth={2.2}
          />
          <span className="text-lg font-semibold tracking-tight text-warden-text">
            Warden
          </span>
        </Link>

        {/* Nav links */}
        <ul className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive =
              to === '/' ? pathname === '/' : pathname.startsWith(to);

            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-warden-primary/10 text-warden-primary'
                        : 'text-warden-text/60 hover:text-warden-text hover:bg-warden-surface'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right slot — status indicator & Theme Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-warden-border/50 bg-warden-surface/60 hover:bg-warden-surface text-warden-text/80 hover:text-warden-primary transition-colors cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="h-4 w-4 text-warden-primary" /> : <Moon className="h-4 w-4 text-warden-primary" />}
          </button>

          <div className="flex items-center gap-2 pl-1 border-l border-warden-border/40">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warden-emerald/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warden-emerald" />
            </span>
            <span className="text-xs text-warden-text/60 font-mono hidden sm:inline">
              online
            </span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
