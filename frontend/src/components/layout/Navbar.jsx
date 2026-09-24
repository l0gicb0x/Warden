import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, FlaskConical, LayoutDashboard } from 'lucide-react';

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

  return (
    <header className="sticky top-0 z-50 glass">
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

        {/* Right slot — status indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warden-primary/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warden-primary" />
          </span>
          <span className="text-xs text-warden-text/50 font-mono hidden sm:inline">
            online
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
