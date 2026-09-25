import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  FlaskConical,
  LayoutDashboard,
  Shield,
  ChevronUp,
} from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';

const navLinks = [
  { to: '/', label: 'Console', icon: LayoutDashboard, tag: 'LIVE' },
  { to: '/runs', label: 'Runs', icon: Activity, tag: 'LOGS' },
  { to: '/traps', label: 'Traps', icon: FlaskConical, tag: 'MATRIX' },
];

/**
 * Navbar — Fixed Top Header with Glassmorphism & Status Telemetry
 * ──────────────────────────────────────────────────────────────
 * Always cleanly visible across all routes (Dashboard, Runs, Traps).
 * Highlights active routes, houses the Sun/Moon ThemeToggle, and provides
 * a smooth "Restore Top" floater when scrolling through telemetry.
 */
const Navbar = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [scrolledDeep, setScrolledDeep] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setScrolledDeep(y > 450);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. PERMANENT TOP FIXED NAVBAR
      ───────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-warden-bg/85 backdrop-blur-xl border-b border-warden-border/80 shadow-lg py-0'
            : 'bg-warden-bg/60 backdrop-blur-md border-b border-warden-border/40 py-1'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Left slot — Brand */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center gap-2.5 group select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-warden-primary/25 via-warden-primary/10 to-transparent border border-warden-primary/40 flex items-center justify-center shadow-[0_0_15px_hsl(var(--warden-primary)/0.2)] group-hover:scale-105 transition-transform duration-300">
                <Shield className="h-4 w-4 text-warden-primary transition-colors" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-cinzel text-base font-bold tracking-wider text-warden-text group-hover:text-warden-primary transition-colors">
                    WARDEN
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded border border-warden-primary/40 bg-warden-primary/10 text-warden-primary font-mono font-semibold">
                    SHIELD
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-warden-text/40 -mt-0.5 uppercase hidden sm:inline-block">
                  Autonomous Agent Shield
                </span>
              </div>
            </Link>
          </div>

          {/* Center slot — Primary Navigation Tabs */}
          <ul className="flex items-center gap-1 sm:gap-2">
            {navLinks.map(({ to, label, icon: Icon, tag }) => {
              const isActive =
                to === '/' ? pathname === '/' : pathname.startsWith(to);

              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-warden-primary font-semibold shadow-sm'
                        : 'text-warden-text/60 hover:text-warden-text hover:bg-warden-surface/60'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeTabPill"
                        className="absolute inset-0 rounded-xl bg-warden-surface border border-warden-primary/40 shadow-[0_0_20px_hsl(var(--warden-primary)/0.15)]"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <Icon
                      className={`h-4 w-4 relative z-10 ${
                        isActive ? 'text-warden-primary' : 'text-warden-text/50'
                      }`}
                    />
                    <span className="relative z-10">{label}</span>
                    <span className="hidden md:inline-block relative z-10 text-[9px] px-1.5 py-0.2 rounded border border-warden-border/60 bg-warden-bg/50 text-warden-text/40">
                      {tag}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right slot — Live Telemetry & Theme Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-warden-border/70 bg-warden-surface/50 text-[10px] font-mono text-warden-text/70">
              <span className="w-2 h-2 rounded-full bg-warden-emerald animate-pulse" />
              <span className="text-warden-text/40 uppercase">AI SHIELD:</span>
              <span className="text-warden-emerald font-bold tracking-wide">ACTIVE</span>
            </div>

            <ThemeToggle />
          </div>
        </nav>
      </header>

      {/* Spacer to prevent content from jumping under fixed navbar on subpages */}
      <div className="h-14 sm:h-16" />

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING "RESTORE TOP" BUTTON (Bottom Center on Deep Scroll)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {scrolledDeep && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
          >
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-warden-surface/90 backdrop-blur-xl border border-warden-primary/40 text-warden-primary hover:bg-warden-primary/20 hover:border-warden-primary text-xs font-mono font-medium shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_hsl(var(--warden-primary)/0.15)] hover:scale-105 transition-all duration-300 group cursor-pointer"
              title="Scroll to Top"
            >
              <ChevronUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Restore Top</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
