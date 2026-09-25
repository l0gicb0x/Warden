import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  FlaskConical,
  LayoutDashboard,
  Shield,
  ChevronUp,
  X,
  Minimize2,
  Sparkles,
} from 'lucide-react';
import ThemeToggle from '@/components/common/ThemeToggle';

const navLinks = [
  { to: '/?view=console', label: 'Console', icon: LayoutDashboard, tag: 'LIVE' },
  { to: '/runs', label: 'Runs', icon: Activity, tag: 'LOGS' },
  { to: '/traps', label: 'Traps', icon: FlaskConical, tag: 'MATRIX' },
];

/**
 * Navbar — Adaptive 3-Stage Navigation with Morphing Kinetic Blob
 * ──────────────────────────────────────────────────────────────────────────────────
 * 1. Hidden Stage: On homepage top/logo reveal, navbar is hidden so the reveal is unobstructed.
 * 2. Standard Top Navbar: Appears smoothly as user scrolls past the logo reveal (or on subpages).
 * 3. Floating Dropdown Dock: On deep scroll into the console/feed, rolls up into bottom-right capsule.
 * 4. Interactive Blob: Dock can retract into a kinetic morphing guardian orb and expand on click.
 */
const Navbar = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const isHomePage = pathname === '/';

  // Navigation mode: 'hidden' | 'top' (full navbar) | 'dock' (dropdown capsule at bottom-right)
  const [navMode, setNavMode] = useState(() => (isHomePage ? 'hidden' : 'top'));
  const [activePopover, setActivePopover] = useState(null);
  const [isRetracted, setIsRetracted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (isHomePage) {
        if (y < 220) {
          setNavMode('hidden');
          setActivePopover(null);
        } else if (y <= 850) {
          setNavMode('top');
          setActivePopover(null);
        } else {
          setNavMode('dock');
        }
      } else {
        if (y > 250) {
          setNavMode('dock');
        } else {
          setNavMode('top');
          setActivePopover(null);
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActivePopover(null);
  };

  const handleDockClick = (type, path) => {
    if (path) {
      navigate(path);
      setActivePopover(null);
    } else {
      setActivePopover((prev) => (prev === type ? null : type));
    }
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FULL TOP HEADER (Visible when at top of page)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {navMode === 'top' && (
          <motion.header
            key="top-header"
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 350 }}
            className="fixed top-0 inset-x-0 z-40 bg-warden-bg/85 backdrop-blur-xl border-b border-warden-border/80 shadow-md transition-colors duration-500"
          >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              {/* Left slot — Brand */}
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="flex items-center gap-2.5 group select-none"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-warden-amber/30 via-warden-amber/10 to-transparent border border-warden-amber/40 flex items-center justify-center shadow-[0_0_15px_hsl(var(--warden-amber)/0.2)] group-hover:scale-105 transition-transform duration-300">
                    <Shield className="h-4 w-4 text-warden-amber transition-colors" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-cinzel text-base font-bold tracking-wider text-warden-text group-hover:text-warden-amber transition-colors">
                        WARDEN
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded border border-warden-amber/40 bg-warden-amber/10 text-warden-amber font-mono font-semibold">
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
                    to === '/?view=console' ? pathname === '/' : pathname.startsWith(to);

                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 ${
                          isActive
                            ? 'text-warden-amber font-semibold shadow-sm'
                            : 'text-warden-text/60 hover:text-warden-text hover:bg-warden-surface/60'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="activeTabPill"
                            className="absolute inset-0 rounded-xl bg-warden-surface border border-warden-amber/40 shadow-[0_0_20px_hsl(var(--warden-amber)/0.15)]"
                            transition={{
                              type: 'spring',
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                        <Icon
                          className={`h-4 w-4 relative z-10 ${
                            isActive ? 'text-warden-amber' : 'text-warden-text/50'
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
          </motion.header>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING DROPDOWN CAPSULE DOCK OR MORPHING KINETIC BLOB
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {navMode === 'dock' && (
          <div className="fixed right-4 sm:right-6 bottom-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
            {/* Popover Card above the dock */}
            <AnimatePresence>
              {activePopover === 'status' && !isRetracted && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="w-72 p-4 rounded-2xl bg-warden-surface/95 backdrop-blur-3xl border border-warden-amber/40 shadow-2xl text-xs font-mono select-none pointer-events-auto"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-warden-border/60 mb-2.5">
                    <div className="flex items-center gap-2 font-bold text-warden-text font-cinzel tracking-wider">
                      <Shield className="h-4 w-4 text-warden-amber" />
                      <span>SENTRY TELEMETRY</span>
                    </div>
                    <button
                      onClick={() => setActivePopover(null)}
                      className="text-warden-text/40 hover:text-warden-text cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-[11px] text-warden-text/80 font-mono">
                    <div className="flex justify-between items-center py-1 border-b border-warden-border/30">
                      <span className="text-warden-text/50">PROTECTION:</span>
                      <span className="text-warden-emerald font-bold">ARMED (100%)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-warden-border/30">
                      <span className="text-warden-text/50">HONEYPOT TRAPS:</span>
                      <span className="text-warden-amber font-bold">10 ARMED</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-warden-text/50">INTERCEPTOR:</span>
                      <span className="text-warden-text font-semibold">DETERMINISTIC</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RETRACTED STATE: Interactive Kinetic Morphing Blob */}
            {isRetracted ? (
              <motion.div
                key="retracted-blob"
                initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotate: 20 }}
                transition={{ type: 'spring', damping: 18, stiffness: 320 }}
                className="relative group pointer-events-auto select-none"
              >
                {/* Outer Breathing Glow Halo */}
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.35, 0.7, 0.35],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-warden-amber/25 blur-xl pointer-events-none"
                />

                {/* Kinetic Morphing Orb Button */}
                <motion.button
                  onClick={() => setIsRetracted(false)}
                  animate={{
                    borderRadius: [
                      '60% 40% 30% 70% / 60% 30% 70% 40%',
                      '30% 60% 70% 40% / 50% 60% 30% 60%',
                      '60% 40% 30% 70% / 60% 30% 70% 40%',
                    ],
                    rotate: [0, 6, -6, 0],
                  }}
                  transition={{
                    borderRadius: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-14 h-14 bg-gradient-to-br from-warden-amber via-amber-500 to-yellow-600 text-black border-2 border-white/40 shadow-[0_10px_30px_hsl(var(--warden-amber)/0.5),0_0_20px_hsl(var(--warden-amber))] flex items-center justify-center cursor-pointer overflow-hidden transition-shadow duration-300"
                  title="Click to Expand Navigation Menu"
                >
                  <Shield className="h-6 w-6 text-black fill-black/15 transition-transform duration-300 group-hover:scale-110" />
                  
                  {/* Active Sentinel Ping */}
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-warden-emerald shadow-[0_0_8px_hsl(var(--warden-emerald))]" />
                  
                  {/* Sparkle Gleam */}
                  <Sparkles className="absolute bottom-1.5 left-2 h-3 w-3 text-black/60 animate-pulse" />
                </motion.button>

                {/* Tooltip on Hover */}
                <div className="absolute bottom-full mb-3 right-0 px-3 py-1.5 rounded-xl bg-warden-surface/95 border border-warden-amber/40 text-[11px] font-mono font-bold text-warden-amber whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 shadow-xl flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  <span>Expand Warden Navigator</span>
                </div>
              </motion.div>
            ) : (
              /* EXPANDED STATE: Full Horizontal Capsule Menu Dock */
              <motion.div
                key="expanded-dock"
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 350 }}
                className="flex items-center gap-1.5 sm:gap-2 p-2 rounded-2xl bg-warden-surface/90 backdrop-blur-2xl border border-warden-amber/35 shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_30px_hsl(var(--warden-amber)/0.15)] select-none pointer-events-auto"
              >
                {/* Item 1: Status Popover Trigger */}
                <div className="relative group">
                  <button
                    onClick={() => handleDockClick('status')}
                    className={`p-2 rounded-xl transition-all duration-300 relative flex items-center justify-center cursor-pointer ${
                      activePopover === 'status'
                        ? 'bg-warden-amber text-black shadow-[0_0_20px_hsl(var(--warden-amber))]'
                        : 'bg-warden-bg/80 text-warden-amber hover:bg-warden-amber/20 border border-warden-amber/40 hover:scale-105'
                    }`}
                    title="Warden Sentinel Status"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warden-emerald animate-ping" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warden-emerald" />
                  </button>
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                    System Status
                  </div>
                </div>

                <div className="w-[1px] h-6 bg-warden-border/60 mx-0.5" />

                {/* Item 2: Console Tab */}
                <div className="relative group">
                  <button
                    onClick={() => handleDockClick('console', '/?view=console')}
                    className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 relative cursor-pointer ${
                      pathname === '/'
                        ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.3)]'
                        : 'bg-warden-bg/60 text-warden-text/70 hover:text-warden-text hover:bg-warden-surface border border-warden-border/60 hover:scale-105'
                    }`}
                    title="Live Console"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="text-xs font-mono font-medium hidden sm:inline-block">Console</span>
                    {pathname === '/' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-warden-amber animate-pulse" />
                    )}
                  </button>
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                    Live Console (/)
                  </div>
                </div>

                {/* Item 3: Runs Tab */}
                <div className="relative group">
                  <button
                    onClick={() => handleDockClick('runs', '/runs')}
                    className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 relative cursor-pointer ${
                      pathname.startsWith('/runs')
                        ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.3)]'
                        : 'bg-warden-bg/60 text-warden-text/70 hover:text-warden-text hover:bg-warden-surface border border-warden-border/60 hover:scale-105'
                    }`}
                    title="Runs & Interceptions"
                  >
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-mono font-medium hidden sm:inline-block">Runs</span>
                    {pathname.startsWith('/runs') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-warden-amber animate-pulse" />
                    )}
                  </button>
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                    Agent Runs (/runs)
                  </div>
                </div>

                {/* Item 4: Traps Tab */}
                <div className="relative group">
                  <button
                    onClick={() => handleDockClick('traps', '/traps')}
                    className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 relative cursor-pointer ${
                      pathname.startsWith('/traps')
                        ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.3)]'
                        : 'bg-warden-bg/60 text-warden-text/70 hover:text-warden-text hover:bg-warden-surface border border-warden-border/60 hover:scale-105'
                    }`}
                    title="Honeypot Traps Matrix"
                  >
                    <FlaskConical className="h-4 w-4" />
                    <span className="text-xs font-mono font-medium hidden sm:inline-block">Traps</span>
                    {pathname.startsWith('/traps') && (
                      <span className="w-1.5 h-1.5 rounded-full bg-warden-amber animate-pulse" />
                    )}
                  </button>
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                    Trap Matrix (/traps)
                  </div>
                </div>

                <div className="w-[1px] h-6 bg-warden-border/60 mx-0.5" />

                {/* Item 5: Theme Toggle */}
                <ThemeToggle />

                {/* Item 6: Retract to Morphing Kinetic Blob */}
                <div className="relative group">
                  <button
                    onClick={() => setIsRetracted(true)}
                    className="p-2 rounded-xl bg-warden-bg/80 hover:bg-warden-amber/20 text-warden-amber border border-warden-amber/30 transition-all duration-300 flex items-center justify-center hover:scale-105 cursor-pointer"
                    title="Retract into Interactive Sentinel Blob"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-amber whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                    Retract to Orb Blob
                  </div>
                </div>

                {/* Item 7: Restore Full Top Navbar */}
                <div className="relative group">
                  <button
                    onClick={scrollToTop}
                    className="p-2 rounded-xl bg-warden-amber/15 hover:bg-warden-amber hover:text-black text-warden-amber border border-warden-amber/40 transition-all duration-300 flex items-center justify-center hover:scale-105 cursor-pointer"
                    title="Restore Full Top Navbar"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                    Restore Top Navbar
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
