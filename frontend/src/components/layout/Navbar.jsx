import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  FlaskConical,
  LayoutDashboard,
  Sparkles,
  Shield,
  Volume2,
  VolumeX,
  Palette,
  ChevronUp,
  X,
  Minimize2,
} from 'lucide-react';
import ZenShieldDial from '@/components/common/ZenShieldDial';
import { useTheme } from '@/context/ThemeContext';

const navLinks = [
  { to: '/', label: 'Console', icon: LayoutDashboard, tag: 'LIVE INTERCEPT' },
  { to: '/runs', label: 'Runs', icon: Activity, tag: 'AGENT LOGS' },
  { to: '/traps', label: 'Traps', icon: FlaskConical, tag: 'HONEYPOT MATRIX' },
];

/**
 * Navbar — Top Sticky Header & Retractable Floating Horizontal Bubble Dock
 * ────────────────────────────────────────────────────────────────────────
 * 1. Hidden during initial full-screen logo reveal on homepage (y < 420px).
 * 2. Unveils as Full Top Navbar on scroll (y >= 420px on home, y >= 50px on others).
 * 3. Transforms into Floating Horizontal Bubble Dock at bottom-right when scrolled deep.
 * 4. Can retract into a single oddly shaped morphing kinetic blob and expand back.
 * 5. Standalone Floating "Restore Top" button centered at bottom.
 */
const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  const isHomePage = pathname === '/';

  // Navigation State: 'hidden' | 'top' | 'dock'
  const [navMode, setNavMode] = useState(!isHomePage ? 'top' : 'hidden');
  const [activeBubble, setActiveBubble] = useState(null);
  const [isRetracted, setIsRetracted] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);

  // Synthesize soft radar ping audio on interaction
  const playRadarPing = () => {
    if (!audioFeedback) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (!isHomePage) {
        if (y > 50) {
          setNavMode('dock');
        } else {
          setNavMode('top');
        }
        return;
      }

      // Homepage thresholds
      if (y < 420) {
        setNavMode('hidden');
        setActiveBubble(null);
      } else if (y >= 420 && y < 580) {
        setNavMode('top');
        setActiveBubble(null);
      } else {
        setNavMode('dock');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const scrollToTop = () => {
    playRadarPing();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveBubble(null);
  };

  const handleBubbleClick = (type, path) => {
    playRadarPing();
    if (path) {
      navigate(path);
      setActiveBubble(null);
    } else {
      setActiveBubble((prev) => (prev === type ? null : type));
    }
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. FULL TOP STICKY HEADER (Appears after logo reveal)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {navMode === 'top' && (
          <motion.header
            key="top-navbar"
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -70, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
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
                    <svg
                      viewBox="0 0 240 140"
                      className="h-4 w-6 text-warden-amber transition-colors duration-300"
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
                  </div>
                  <div className="flex flex-col">
                    <span className="font-cinzel text-base font-bold tracking-wider text-warden-text group-hover:text-warden-amber transition-colors">
                      WARDEN
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-warden-text/40 -mt-1 uppercase">
                      Autonomous Shield
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
                        onClick={playRadarPing}
                        className={`relative flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-mono font-medium transition-all duration-300 ${
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
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          2. FLOATING RIGHT HORIZONTAL BUBBLE DOCK & MORPHING BLOB
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {navMode === 'dock' && (
          <div className="fixed right-4 sm:right-8 bottom-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
            {/* Morphing Kinetic Blob OR Clean Horizontal Capsule Dock */}
            <AnimatePresence mode="wait">
              {isRetracted ? (
                /* ── Oddly Shaped Reactive Morphing Kinetic Blob ── */
                <motion.div
                  key="retracted-blob"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    borderRadius: [
                      '60% 40% 30% 70% / 60% 30% 70% 40%',
                      '30% 60% 70% 40% / 50% 60% 30% 60%',
                      '60% 40% 30% 70% / 60% 30% 70% 40%',
                    ],
                  }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{
                    borderRadius: {
                      duration: 6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    scale: { type: 'spring', damping: 20, stiffness: 350 },
                  }}
                  whileHover={{ scale: 1.15, rotate: 6 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playRadarPing();
                    setIsRetracted(false);
                  }}
                  className="relative w-14 h-14 bg-gradient-to-tr from-warden-amber/30 via-warden-surface/90 to-warden-amber/15 backdrop-blur-2xl border-2 border-warden-amber/70 shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_30px_hsl(var(--warden-amber)/0.25)] flex items-center justify-center cursor-pointer pointer-events-auto group select-none"
                  title="Expand Warden Navigation Dock"
                >
                  <svg
                    viewBox="0 0 240 140"
                    className="h-5 w-7 text-warden-amber group-hover:scale-110 transition-transform duration-300"
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
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-warden-emerald animate-ping" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-warden-emerald" />
                </motion.div>
              ) : (
                /* ── Expanded Horizontal Capsule Dock ── */
                <motion.div
                  key="expanded-dock"
                  initial={{ y: 40, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 40, opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 350 }}
                  className="flex items-center gap-2 p-2 rounded-2xl bg-warden-surface/90 backdrop-blur-2xl border border-warden-amber/35 shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_30px_hsl(var(--warden-amber)/0.15)] select-none pointer-events-auto"
                >
                  {/* Bubble 1: Status Icon */}
                  <div className="relative group">
                    <button
                      onClick={() => handleBubbleClick('status')}
                      className={`p-2 rounded-xl transition-all duration-300 relative flex items-center justify-center ${
                        activeBubble === 'status'
                          ? 'bg-warden-amber text-black shadow-[0_0_20px_hsl(var(--warden-amber))]'
                          : 'bg-warden-bg/80 text-warden-amber hover:bg-warden-amber/20 border border-warden-amber/40 hover:scale-105'
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
                    <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                      System Status
                    </div>
                  </div>

                  <div className="w-[1px] h-6 bg-warden-border/60 mx-0.5" />

                  {/* Bubble 2: Console */}
                  <div className="relative group">
                    <button
                      onClick={() => handleBubbleClick('console', '/')}
                      className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 relative ${
                        pathname === '/'
                          ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.3)]'
                          : 'bg-warden-bg/60 text-warden-text/70 hover:text-warden-text hover:bg-warden-surface border border-warden-border/60 hover:scale-105'
                      }`}
                      title="Live Console"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span className="text-xs font-mono font-medium hidden sm:inline-block">
                        Console
                      </span>
                      {pathname === '/' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-warden-amber animate-pulse" />
                      )}
                    </button>
                    <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                      Live Console (/)
                    </div>
                  </div>

                  {/* Bubble 3: Runs Archive */}
                  <div className="relative group">
                    <button
                      onClick={() => handleBubbleClick('runs', '/runs')}
                      className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 relative ${
                        pathname.startsWith('/runs')
                          ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.3)]'
                          : 'bg-warden-bg/60 text-warden-text/70 hover:text-warden-text hover:bg-warden-surface border border-warden-border/60 hover:scale-105'
                      }`}
                      title="Runs & Interceptions"
                    >
                      <Activity className="h-4 w-4" />
                      <span className="text-xs font-mono font-medium hidden sm:inline-block">
                        Runs
                      </span>
                      {pathname.startsWith('/runs') && (
                        <span className="w-1.5 h-1.5 rounded-full bg-warden-amber animate-pulse" />
                      )}
                    </button>
                    <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                      Agent Runs (/runs)
                    </div>
                  </div>

                  {/* Bubble 4: Traps Matrix */}
                  <div className="relative group">
                    <button
                      onClick={() => handleBubbleClick('traps', '/traps')}
                      className={`p-2 sm:px-3 sm:py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 relative ${
                        pathname.startsWith('/traps')
                          ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.3)]'
                          : 'bg-warden-bg/60 text-warden-text/70 hover:text-warden-text hover:bg-warden-surface border border-warden-border/60 hover:scale-105'
                      }`}
                      title="Honeypot Traps Matrix"
                    >
                      <FlaskConical className="h-4 w-4" />
                      <span className="text-xs font-mono font-medium hidden sm:inline-block">
                        Traps
                      </span>
                      {pathname.startsWith('/traps') && (
                        <span className="w-1.5 h-1.5 rounded-full bg-warden-amber animate-pulse" />
                      )}
                    </button>
                    <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                      Trap Matrix (/traps)
                    </div>
                  </div>

                  <div className="w-[1px] h-6 bg-warden-border/60 mx-0.5" />

                  {/* Bubble 5: Controls & Zen Dial */}
                  <div className="relative group">
                    <button
                      onClick={() => handleBubbleClick('zen')}
                      className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${
                        activeBubble === 'zen'
                          ? 'bg-warden-amber text-black shadow-[0_0_20px_hsl(var(--warden-amber))]'
                          : 'bg-warden-bg/80 text-warden-amber hover:bg-warden-amber/20 border border-warden-amber/40 hover:scale-105'
                      }`}
                      title="Controls & Quick Theme"
                    >
                      <Sparkles
                        className="h-4 w-4 animate-spin"
                        style={{ animationDuration: '12s' }}
                      />
                    </button>
                    <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                      Controls & Theme
                    </div>
                  </div>

                  {/* Retract into Single Blob Button */}
                  <div className="relative group">
                    <button
                      onClick={() => {
                        playRadarPing();
                        setIsRetracted(true);
                        setActiveBubble(null);
                      }}
                      className="p-2 rounded-xl bg-warden-surface/80 hover:bg-warden-amber/20 text-warden-text/60 hover:text-warden-amber border border-warden-border/60 hover:border-warden-amber/40 transition-all duration-300 flex items-center justify-center hover:scale-105"
                      title="Retract to Kinetic Blob"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-warden-bg border border-warden-border text-[10px] font-mono font-semibold text-warden-text whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                      Retract to Blob
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Interactive Flyout Popovers on Clicking Bubbles ── */}
            <AnimatePresence>
              {activeBubble === 'status' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
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
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
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
                  <div className="space-y-3">
                    <div className="text-[10px] text-warden-text/50 uppercase">
                      Active Color Palette:
                    </div>
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

                    {/* Audio Toggle */}
                    <div className="flex items-center justify-between pt-1 border-t border-warden-border/40 text-[11px]">
                      <span className="text-warden-text/70">Tactile Audio Feedback:</span>
                      <button
                        onClick={() => setAudioFeedback(!audioFeedback)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          audioFeedback
                            ? 'bg-warden-amber/20 text-warden-amber border-warden-amber/40'
                            : 'bg-warden-bg text-warden-text/40 border-warden-border'
                        }`}
                      >
                        {audioFeedback ? (
                          <Volume2 className="h-3.5 w-3.5" />
                        ) : (
                          <VolumeX className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          3. STANDALONE FLOATING "RESTORE TOP" BUTTON (Bottom Center)
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {navMode === 'dock' && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto"
          >
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-warden-surface/90 backdrop-blur-xl border border-warden-amber/40 text-warden-amber hover:bg-warden-amber/20 hover:border-warden-amber text-xs font-mono font-medium shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_hsl(var(--warden-amber)/0.15)] hover:scale-105 transition-all duration-300 group"
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
