import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  FlaskConical,
  LayoutDashboard,
  Sparkles,
  Shield,
  Radio,
  Volume2,
  VolumeX,
  Palette,
  ChevronUp,
  X,
  Flame,
  ArrowRight,
} from 'lucide-react';
import ZenShieldDial from '@/components/common/ZenShieldDial';
import { useTheme } from '@/context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Console', icon: LayoutDashboard, tag: 'LIVE INTERCEPT' },
  { to: '/runs', label: 'Runs', icon: Activity, tag: 'AGENT LOGS' },
  { to: '/traps', label: 'Traps', icon: FlaskConical, tag: 'HONEYPOT MATRIX' },
];

/**
 * Navbar — Top Sticky Header & Right Floating Bubble Dock
 * ─────────────────────────────────────────────────────────────
 * 1. Hidden during initial full-screen logo reveal on homepage.
 * 2. Unveils as Full Top Navbar immediately once logo reveal finishes.
 * 3. Shrinks & slides down to a Floating Right Bubble Dock as user scrolls deep into content.
 * 4. Interactive popover cards on clicking bubbles with live telemetry and controls.
 * 5. One-click "Restore Navbar" precision scroll-up trigger.
 */
const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  const isHomePage = pathname === '/';

  // Navigation State: 'hidden' | 'top' | 'dock'
  const [navMode, setNavMode] = useState(!isHomePage ? 'top' : 'hidden');
  const [activeBubble, setActiveBubble] = useState(null);
  const [audioFeedback, setAudioFeedback] = useState(true);

  useEffect(() => {
    if (!isHomePage) {
      const handleOtherScroll = () => {
        if (window.scrollY > 160) {
          setNavMode('dock');
        } else {
          setNavMode('top');
        }
      };
      handleOtherScroll();
      window.addEventListener('scroll', handleOtherScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleOtherScroll);
    }

    const handleHomeScroll = () => {
      const y = window.scrollY;
      // 0 to 420px: Hero logo reveal runway
      if (y < 420) {
        setNavMode('hidden');
        setActiveBubble(null);
      }
      // 420px to 580px: Brief top navbar header presence
      else if (y >= 420 && y < 580) {
        setNavMode('top');
        setActiveBubble(null);
      }
      // 580px+: Quickly morphs into right bubble dock as workflow begins
      else {
        setNavMode('dock');
      }
    };

    handleHomeScroll();
    window.addEventListener('scroll', handleHomeScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleHomeScroll);
  }, [isHomePage]);

  const scrollToTopHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveBubble(null);
  };

  const scrollToDashboardTop = () => {
    // For homepage, scrolls to where dashboard begins (~120vh) so full top navbar is restored immediately
    if (isHomePage) {
      window.scrollTo({
        top: window.innerHeight * 0.95,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    setActiveBubble(null);
  };

  const handleBubbleClick = (bubbleKey, destination) => {
    if (destination && pathname !== destination) {
      navigate(destination);
      setActiveBubble(null);
      return;
    }
    setActiveBubble((prev) => (prev === bubbleKey ? null : bubbleKey));
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FULL TOP NAVBAR (Revealed when logo animation finishes)
      ───────────────────────────────────────────────────────────── */}
      <motion.header
        initial={false}
        animate={{
          y: navMode === 'top' ? 0 : -100,
          opacity: navMode === 'top' ? 1 : 0,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          navMode === 'top'
            ? 'bg-warden-bg/90 backdrop-blur-2xl border-b border-warden-amber/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)] py-1.5 pointer-events-auto'
            : 'pointer-events-none'
        }`}
      >
        <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Brand with Stealth Bat-Shield Monogram */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="relative p-2 rounded-xl bg-warden-surface/90 border border-warden-amber/40 transition-all duration-500 group-hover:border-warden-amber group-hover:shadow-[0_0_20px_hsl(var(--warden-amber)/0.4)]">
                {/* Stealth Bat-Shield Monogram Icon */}
                <svg
                  viewBox="0 0 240 140"
                  className="h-6 w-9 text-warden-amber transition-transform duration-500 group-hover:scale-110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 15 25 L 65 25 L 90 65 L 120 15 L 150 65 L 175 25 L 225 25 L 195 85 L 120 130 L 45 85 Z"
                    fill="currentColor"
                    fillOpacity="0.15"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinejoin="round"
                  />
                  <line x1="120" y1="15" x2="120" y2="130" stroke="currentColor" strokeWidth="6" />
                  <circle cx="120" cy="68" r="16" fill="#ffffff" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warden-emerald animate-ping" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warden-emerald" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-display font-black tracking-wider text-warden-text">
                    Warden
                  </span>
                  <span className="text-[9px] px-2 py-0.5 bg-warden-amber/15 border border-warden-amber/40 text-warden-amber font-mono font-bold tracking-widest rounded-full shadow-sm">
                    v3.0
                  </span>
                </div>
                <span className="text-[10px] font-sans font-medium text-warden-text/60 tracking-wider hidden sm:inline-block">
                  Autonomous Agent Shield
                </span>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-2 p-1.5 rounded-full border border-warden-border/80 bg-warden-surface/60 backdrop-blur-md">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive =
                to === '/' ? pathname === '/' : pathname.startsWith(to);

              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`
                      flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-mono font-medium
                      transition-all duration-300
                      ${
                        isActive
                          ? 'bg-warden-amber/15 text-warden-amber border border-warden-amber/40 shadow-[0_0_12px_hsl(var(--warden-amber)/0.2)] font-semibold'
                          : 'text-warden-text/60 hover:text-warden-text hover:bg-warden-surface/80 border border-transparent'
                      }
                    `}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="tracking-wider">{label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-warden-amber animate-pulse" />}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right slot — ZenShieldDial & Live Telemetry */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-warden-border/70 bg-warden-surface/50 text-[10px] font-mono text-warden-text/70">
              <span className="w-2 h-2 rounded-full bg-warden-emerald animate-pulse" />
              <span className="text-warden-text/40 uppercase">AI SHIELD:</span>
              <span className="text-warden-emerald font-bold tracking-wide">ACTIVE</span>
            </div>

            {/* Interactive Luxury Wabi-Sabi Astrolabe Toggle */}
            <ZenShieldDial />
          </div>
        </nav>
      </motion.header>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING RIGHT BUBBLE DOCK (Clean, Without Arrow)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {navMode === 'dock' && (
          <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-3 pointer-events-none">
            {/* Main Floating Vertical Bubble Dock */}
            <motion.div
              initial={{ x: 80, opacity: 0, scale: 0.85 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 80, opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', damping: 18, stiffness: 340 }}
              className="flex flex-col items-center gap-2.5 p-2 rounded-3xl bg-warden-surface/90 backdrop-blur-2xl border border-warden-amber/35 shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_30px_hsl(var(--warden-amber)/0.15)] select-none pointer-events-auto"
            >
              {/* Bubble 1: Brand / Bat-Shield Status Bubble */}
              <div className="relative group">
                <button
                  onClick={() => handleBubbleClick('status')}
                  className={`p-2.5 rounded-2xl transition-all duration-300 relative flex items-center justify-center ${
                    activeBubble === 'status'
                      ? 'bg-warden-amber text-black shadow-[0_0_20px_hsl(var(--warden-amber))]'
                      : 'bg-warden-bg/80 text-warden-amber hover:bg-warden-amber/20 border border-warden-amber/40 hover:scale-110'
                  }`}
                  title="Warden Sentinel Status"
                >
                  <svg
                    viewBox="0 0 240 140"
                    className="h-4 w-6"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 15 25 L 65 25 L 90 65 L 120 15 L 150 65 L 175 25 L 225 25 L 195 85 L 120 130 L 45 85 Z"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinejoin="round"
                    />
                    <circle cx="120" cy="68" r="14" fill="#ffffff" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warden-emerald animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warden-emerald" />
                </button>

                {/* Hover Tooltip */}
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                  System Status
                </div>
              </div>

              {/* Bubble 2: Console */}
              <div className="relative group">
                <button
                  onClick={() => handleBubbleClick('console', '/')}
                  className={`p-2.5 rounded-2xl transition-all duration-300 relative flex items-center justify-center ${
                    pathname === '/'
                      ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.3)]'
                      : 'bg-warden-bg/60 text-warden-text/70 hover:text-warden-text hover:bg-warden-surface border border-warden-border/60 hover:scale-110'
                  }`}
                  title="Live Console"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {pathname === '/' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warden-amber animate-pulse" />
                  )}
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                  Live Console (/)
                </div>
              </div>

              {/* Bubble 3: Runs Archive */}
              <div className="relative group">
                <button
                  onClick={() => handleBubbleClick('runs', '/runs')}
                  className={`p-2.5 rounded-2xl transition-all duration-300 relative flex items-center justify-center ${
                    pathname.startsWith('/runs')
                      ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.3)]'
                      : 'bg-warden-bg/60 text-warden-text/70 hover:text-warden-text hover:bg-warden-surface border border-warden-border/60 hover:scale-110'
                  }`}
                  title="Runs & Interceptions"
                >
                  <Activity className="h-4 w-4" />
                  {pathname.startsWith('/runs') && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warden-amber animate-pulse" />
                  )}
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                  Agent Runs (/runs)
                </div>
              </div>

              {/* Bubble 4: Traps Matrix */}
              <div className="relative group">
                <button
                  onClick={() => handleBubbleClick('traps', '/traps')}
                  className={`p-2.5 rounded-2xl transition-all duration-300 relative flex items-center justify-center ${
                    pathname.startsWith('/traps')
                      ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.3)]'
                      : 'bg-warden-bg/60 text-warden-text/70 hover:text-warden-text hover:bg-warden-surface border border-warden-border/60 hover:scale-110'
                  }`}
                  title="Honeypot Traps Matrix"
                >
                  <FlaskConical className="h-4 w-4" />
                  {pathname.startsWith('/traps') && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-warden-amber animate-pulse" />
                  )}
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                  Trap Matrix (/traps)
                </div>
              </div>

              <div className="w-5 h-[1px] bg-warden-border/60 my-0.5" />

              {/* Bubble 5: Quick Control Popover */}
              <div className="relative group">
                <button
                  onClick={() => handleBubbleClick('zen')}
                  className={`p-2.5 rounded-2xl transition-all duration-300 relative flex items-center justify-center ${
                    activeBubble === 'zen'
                      ? 'bg-warden-amber text-black shadow-[0_0_20px_hsl(var(--warden-amber))]'
                      : 'bg-warden-bg/80 text-warden-amber hover:bg-warden-amber/20 border border-warden-amber/40 hover:scale-110'
                  }`}
                  title="Quick Control Dial"
                >
                  <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: '12s' }} />
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                  Controls & Zen Dial
                </div>
              </div>

              {/* Bubble 6: Restore Navbar Button */}
              <div className="relative group">
                <button
                  onClick={scrollToDashboardTop}
                  className="p-2.5 rounded-2xl bg-warden-surface/80 hover:bg-warden-amber/20 text-warden-amber border border-warden-amber/40 hover:border-warden-amber transition-all duration-300 flex items-center justify-center hover:scale-110"
                  title="Scroll to Top (Restore Navbar)"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                  Scroll Up
                </div>
              </div>
            </motion.div>

            {/* ── Interactive Flyout Popovers on Clicking Bubbles ── */}
            <AnimatePresence>
              {activeBubble === 'status' && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className="w-72 p-4 rounded-2xl bg-warden-surface/95 backdrop-blur-3xl border border-warden-amber/40 shadow-2xl text-xs font-mono select-none pointer-events-auto"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-warden-border/60 mb-2.5">
                    <div className="flex items-center gap-2 font-bold text-warden-text font-cinzel tracking-wider">
                      <Shield className="h-4 w-4 text-warden-amber" />
                      <span>SENTRY TELEMETRY</span>
                    </div>
                    <button
                      onClick={() => setActiveBubble(null)}
                      className="text-warden-text/40 hover:text-warden-text"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-[11px] text-warden-text/80 font-mono">
                    <div className="flex justify-between items-center py-1 border-b border-warden-border/30">
                      <span className="text-warden-text/50">PROTECTION ENGINE:</span>
                      <span className="text-warden-emerald font-bold">ARMED (100%)</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-warden-border/30">
                      <span className="text-warden-text/50">PROBE STATUS:</span>
                      <span className="text-warden-amber font-bold">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-warden-text/50">GUARDRAIL:</span>
                      <span className="text-warden-text font-semibold">DETERMINISTIC</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeBubble === 'zen' && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  className="w-72 p-4 rounded-2xl bg-warden-surface/95 backdrop-blur-3xl border border-warden-amber/40 shadow-2xl text-xs font-mono select-none pointer-events-auto"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-warden-border/60 mb-3">
                    <div className="flex items-center gap-2 font-bold text-warden-text font-cinzel tracking-wider">
                      <Sparkles className="h-4 w-4 text-warden-amber" />
                      <span>CONTROLS &amp; THEME</span>
                    </div>
                    <button
                      onClick={() => setActiveBubble(null)}
                      className="text-warden-text/40 hover:text-warden-text"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Theme Switcher */}
                  <div className="space-y-2">
                    <div className="text-[10px] text-warden-text/50 uppercase">Active Color Palette:</div>
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-warden-border hover:border-warden-amber/50 bg-warden-bg/60 text-xs font-mono text-warden-text hover:text-warden-amber transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Palette className="h-3.5 w-3.5 text-warden-amber" />
                        <span>{isDark ? 'Wabi-Sabi Nocturne' : 'Travertine Linen'}</span>
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-warden-amber/20 text-warden-amber border border-warden-amber/40 uppercase">
                        {isDark ? 'DARK' : 'LIGHT'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
