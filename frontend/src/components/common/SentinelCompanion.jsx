import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, AlertTriangle, Zap, Terminal, Heart, Navigation, Move, Compass, CheckCircle2, WifiOff, Wifi } from 'lucide-react';
import { db } from '@/lib/dataProvider';
import { useTheme } from '@/context/ThemeContext';

/**
 * Global helper to trigger short Warden speech from any component / click handler
 */
export const speakWarden = (text, emo = 'curious', durationMs = 3800) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('warden-speak', { detail: { text, emo, durationMs } }));
  }
};

/**
 * SentinelCompanion — "Warden"
 * ─────────────────────────────────────────────────────────────
 * Autonomous cybernetic bodyguard companion bot:
 * 1. Immediate wholesome introduction when opening the app.
 * 2. Reacts to clicks on tabs, presets, sessions, and trap cards with short witty commentary.
 * 3. Glides down along with page scroll on homepage and explains the live telemetry stream.
 * 4. Enters from the LEFT side when navigating to the Runs tab.
 * 5. Enters from the RIGHT side when navigating to the Traps tab.
 * 6. Slower, ultra-graceful roaming algorithm across the entire screen (7.5s smooth bezier glides).
 * 7. Dynamic theme-aware palette (Ceramic Bone Porcelain in Light Mode, Obsidian & Amber in Dark Mode).
 * 8. Actively monitors runtime errors, unhandled rejections, and network connectivity.
 * 9. Instant 1-to-1 effortless pointer dragging across the entire viewport.
 */
const SentinelCompanion = () => {
  const { theme, isDark } = useTheme();
  const location = useLocation();
  const pathname = location.pathname;
  const prevPathnameRef = useRef(pathname);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFreeRoaming, setIsFreeRoaming] = useState(true);
  const [hasDepartedLogo, setHasDepartedLogo] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Viewport position in pixels (prominently visible floating sentry)
  const [pos, setPos] = useState(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      return {
        x: isMobile ? Math.max(16, window.innerWidth - 180) : Math.max(100, window.innerWidth - 340),
        y: 84
      };
    }
    return { x: 80, y: 84 };
  });
  const [tilt, setTilt] = useState(0);
  
  // Guaranteed initial introduction speech
  const [speech, setSpeech] = useState(
    "👋 Hi! I'm Warden, your AI bodyguard! ✨ I'm on patrol watching your back — click anything or scroll down to explore!"
  );
  const [emotion, setEmotion] = useState('happy'); // 'idle' | 'curious' | 'scared' | 'happy' | 'alert'
  const [pokeCount, setPokeCount] = useState(0);
  const [flipDegree, setFlipDegree] = useState(0);
  const [recentErrors, setRecentErrors] = useState([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const speechTimerRef = useRef(null);
  const roamTimerRef = useRef(null);
  const dragStartOffsetRef = useRef({ x: 0, y: 0 });
  const isInteractingRef = useRef(false);

  // Web Audio Robotic Sound Synthesis
  const playRoboChirp = useCallback((type = 'chirp') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + 0.1);
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.23);
      } else if (type === 'happy' || type === 'flip' || type === 'intro') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1180, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.17);
      } else if (type === 'roam') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(640, ctx.currentTime);
        osc.frequency.setValueAtTime(860, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {}
  }, []);

  const showSpeechBubble = useCallback((text, emo = 'curious', durationMs = 4500) => {
    setSpeech(text);
    setEmotion(emo);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => {
      setSpeech(null);
      setEmotion('idle');
    }, durationMs);
  }, []);

  // Initial intro sound and persistent greeting on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      playRoboChirp('intro');
    }, 400);

    speechTimerRef.current = setTimeout(() => {
      setSpeech(null);
      setEmotion('idle');
    }, 12000);

    return () => {
      clearTimeout(timer);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, [playRoboChirp]);

  // Listen to Global 'warden-speak' custom events from any UI click
  useEffect(() => {
    const handleWardenSpeakEvent = (e) => {
      const { text, emo = 'curious', durationMs = 3800 } = e.detail || {};
      if (text) {
        playRoboChirp(emo === 'alert' ? 'alarm' : emo === 'happy' ? 'happy' : 'chirp');
        showSpeechBubble(text, emo, durationMs);
      }
    };

    window.addEventListener('warden-speak', handleWardenSpeakEvent);
    return () => window.removeEventListener('warden-speak', handleWardenSpeakEvent);
  }, [playRoboChirp, showSpeechBubble]);

  // Track window scroll for logo detachment / descent on homepage
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      if (pathname === '/') {
        if (currentScroll > 60 && !hasDepartedLogo) {
          setHasDepartedLogo(true);
          const targetX = Math.round(window.innerWidth > 768 ? window.innerWidth * 0.70 : window.innerWidth * 0.45);
          const targetY = Math.round(Math.min(window.innerHeight * 0.52, 300));
          setPos({ x: targetX, y: targetY });
          playRoboChirp('happy');
          showSpeechBubble(
            "⚡ Down into the telemetry matrix! I'm scanning live agent runs and inspecting DOM traps in real time.",
            'curious',
            5000
          );
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, hasDepartedLogo, playRoboChirp, showSpeechBubble]);

  // Autonomous Roaming Logic
  const glideToNewWaypoint = useCallback(() => {
    if (isDragging || isInteractingRef.current || typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    const minX = isMobile ? 16 : 80;
    const maxX = isMobile ? width - 80 : width - 140;
    const minY = 75;
    const maxY = Math.min(height - 100, 720);

    const nextX = Math.floor(minX + Math.random() * (maxX - minX));
    const nextY = Math.floor(minY + Math.random() * (maxY - minY));

    setPos((current) => {
      const deltaX = nextX - current.x;
      const calculatedTilt = Math.max(-14, Math.min(14, deltaX * 0.035));
      setTilt(calculatedTilt);
      return { x: nextX, y: nextY };
    });

    const resetTiltTimer = setTimeout(() => {
      setTilt(0);
    }, 4000);

    return () => clearTimeout(resetTiltTimer);
  }, [isDragging]);

  // Route Navigation Reactions: Swoop in from different directions per tab!
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      setHasDepartedLogo(true);
      const isMobile = window.innerWidth < 768;

      if (pathname === '/runs') {
        setPos({ x: isMobile ? 24 : 90, y: Math.min(window.innerHeight * 0.4, 260) });
        setTilt(-12);
        playRoboChirp('chirp');
        showSpeechBubble(
          '📂 Welcome to the Runs Vault! Here we log autonomous agent execution sessions and intercept anomalies.',
          'happy',
          4500
        );
      } else if (pathname === '/traps') {
        const targetX = Math.round(isMobile ? window.innerWidth - 100 : window.innerWidth - 280);
        setPos({ x: targetX, y: Math.min(window.innerHeight * 0.38, 240) });
        setTilt(12);
        playRoboChirp('alarm');
        showSpeechBubble(
          '🚨 Maximum Security Detention Ward! Deceptive trap fixtures are contained behind high-voltage security bars.',
          'alert',
          4800
        );
      } else if (pathname === '/') {
        setPos({ x: isMobile ? window.innerWidth - 140 : window.innerWidth - 300, y: 110 });
        setTilt(0);
        playRoboChirp('happy');
        showSpeechBubble(
          '🛡️ Mission Control Dashboard: Toggle between Shielded & Unshielded modes to see live protection.',
          'happy',
          4500
        );
      }

      const t = setTimeout(() => setTilt(0), 1200);
      prevPathnameRef.current = pathname;
      return () => clearTimeout(t);
    }
  }, [pathname, playRoboChirp, showSpeechBubble]);

  // Periodic Free Roaming
  useEffect(() => {
    if (!isFreeRoaming) return;

    const interval = setInterval(() => {
      if (!isDragging && !isHovered && !isInteractingRef.current) {
        glideToNewWaypoint();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isFreeRoaming, isDragging, isHovered, glideToNewWaypoint]);

  // Pointer Drag-and-Drop Handling
  const handlePointerDown = (e) => {
    e.stopPropagation();
    isInteractingRef.current = true;
    setIsDragging(true);
    setHasDepartedLogo(true);

    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);

    dragStartOffsetRef.current = {
      x: clientX - pos.x,
      y: clientY - pos.y,
    };

    const handlePointerMove = (moveEvent) => {
      const curX = moveEvent.clientX ?? (moveEvent.touches && moveEvent.touches[0]?.clientX);
      const curY = moveEvent.clientY ?? (moveEvent.touches && moveEvent.touches[0]?.clientY);
      if (curX === undefined || curY === undefined) return;

      const nextX = Math.max(10, Math.min(window.innerWidth - 70, curX - dragStartOffsetRef.current.x));
      const nextY = Math.max(10, Math.min(window.innerHeight - 70, curY - dragStartOffsetRef.current.y));

      setPos((prev) => {
        const delta = nextX - prev.x;
        setTilt(Math.max(-25, Math.min(25, delta * 0.6)));
        return { x: nextX, y: nextY };
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setTilt(0);
      playRoboChirp('chirp');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 1000);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Track theme changes for contextual Warden commentary
  const prevThemeRef = useRef(theme);
  useEffect(() => {
    if (prevThemeRef.current && prevThemeRef.current !== theme) {
      if (isDark) {
        showSpeechBubble("🌙 Nocturne mode active! Smoked obsidian chassis & kintsugi gold armor engaged.", "happy", 3500);
      } else {
        showSpeechBubble("☀️ Travertine Linen mode active! Bone porcelain & gilded bronze armor engaged.", "happy", 3500);
      }
    }
    prevThemeRef.current = theme;
  }, [theme, isDark, showSpeechBubble]);

  const isNearRight = typeof window !== 'undefined' ? pos.x > window.innerWidth - 280 : false;
  const isNearTop = pos.y < 120;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* ── Main 2D Flying Sentry Container ── */}
      <motion.div
        animate={{
          x: pos.x,
          y: pos.y,
          rotate: tilt,
        }}
        transition={
          isDragging
            ? { duration: 0 }
            : {
                type: 'tween',
                ease: [0.22, 1, 0.36, 1],
                duration: isFreeRoaming && hasDepartedLogo ? 7.5 : 1.2,
              }
        }
        style={{ position: 'absolute', top: 0, left: 0 }}
        className="pointer-events-auto select-none touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
      >
        <div className="relative flex flex-col items-center">
          {/* ── Thought / Speech Balloon ── */}
          <AnimatePresence>
            {speech && (
              <motion.div
                initial={{ opacity: 0, y: isNearTop ? -8 : 8, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: isNearTop ? -8 : 8, scale: 0.85 }}
                transition={{ type: 'spring', damping: 24, stiffness: 360 }}
                className={`absolute ${
                  isNearTop ? 'top-full mt-3.5' : 'bottom-full mb-3.5'
                } ${
                  isNearRight ? 'right-0' : 'left-0'
                } w-[240px] sm:w-[280px] p-2.5 sm:p-3 rounded-2xl backdrop-blur-3xl border text-xs font-mono font-medium z-[9999] pointer-events-none transition-colors duration-300 ${
                  isDark
                    ? 'bg-warden-surface/98 shadow-[0_16px_45px_rgba(0,0,0,0.95)]'
                    : 'bg-[#ffffff]/98 shadow-[0_14px_38px_rgba(120,53,15,0.14)]'
                } ${
                  emotion === 'scared'
                    ? 'border-status-blocked text-status-blocked shadow-[0_0_20px_hsl(var(--status-blocked)/0.3)]'
                    : emotion === 'alert'
                    ? isDark ? 'border-warden-amber text-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.2)]' : 'border-amber-600 text-amber-700'
                    : isDark ? 'border-warden-amber/40 text-warden-text' : 'border-amber-600/40 text-stone-900'
                }`}
              >
                <div className={`flex items-center justify-between gap-1.5 mb-1 pb-1 border-b text-[9px] font-bold uppercase tracking-wider ${
                  isDark ? 'border-warden-border/40' : 'border-stone-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    {emotion === 'scared' ? (
                      <AlertTriangle className="h-3 w-3 text-status-blocked animate-bounce" />
                    ) : emotion === 'happy' ? (
                      <Heart className="h-3 w-3 text-warden-emerald fill-current" />
                    ) : emotion === 'alert' ? (
                      <Shield className={`h-3 w-3 ${isDark ? 'text-warden-amber' : 'text-amber-600'}`} />
                    ) : (
                      <Sparkles className={`h-3 w-3 ${isDark ? 'text-warden-amber' : 'text-amber-600'}`} />
                    )}
                    <span className={isDark ? 'text-warden-text' : 'text-stone-900'}>Warden Bot</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!isOnline ? (
                      <span className="text-status-blocked flex items-center gap-0.5 text-[8px]">
                        <WifiOff className="h-2.5 w-2.5" /> OFFLINE
                      </span>
                    ) : (
                      <span className="text-warden-emerald flex items-center gap-0.5 text-[8px]">
                        <CheckCircle2 className="h-2.5 w-2.5" /> HEALTHY
                      </span>
                    )}
                    <span className={`text-[8px] font-mono ${isDark ? 'text-warden-amber/80' : 'text-amber-700'}`}>
                      {!hasDepartedLogo ? 'PERCHED' : isFreeRoaming ? 'ROAM' : 'HOVER'}
                    </span>
                  </div>
                </div>
                <p className="leading-relaxed break-words text-[11px]">{speech}</p>

                {/* Arrow Tip */}
                <div
                  className={`absolute ${
                    isNearTop ? '-top-1.5 border-l border-t' : '-bottom-1.5 border-r border-b'
                  } w-3 h-3 rotate-45 ${
                    isDark ? 'bg-warden-surface' : 'bg-[#ffffff]'
                  } ${
                    emotion === 'scared' ? 'border-status-blocked' : isDark ? 'border-warden-amber/40' : 'border-amber-600/40'
                  } ${isNearRight ? 'right-6' : 'left-6'}`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Bot Miniature Body with Continuous Sinusoidal Breathing ── */}
          <motion.div
            animate={{
              y: isDragging ? 0 : [-4, 4, -4],
              x: isDragging ? 0 : [-2, 2, -2],
              rotate: flipDegree + (emotion === 'scared' ? -5 : emotion === 'curious' ? 5 : 0),
            }}
            transition={{
              y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
              rotate: { type: 'spring', damping: 14, stiffness: 160 },
            }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.94 }}
            onClick={(e) => {
              e.stopPropagation();
              if (isDragging) return;
              playRoboChirp('flip');
              setFlipDegree((prev) => prev + 360);
              const next = pokeCount + 1;
              setPokeCount(next);
              showSpeechBubble("🛡️ Warden bodyguard reporting: All systems fully nominal and patrolling!", "happy", 3500);
            }}
            onDoubleClick={(e) => {
              if (e) e.stopPropagation();
              playRoboChirp('roam');
              const next = !isFreeRoaming;
              setIsFreeRoaming(next);
              if (!next) {
                showSpeechBubble('Hover Mode: Holding coordinates in place.', 'idle', 2800);
              } else {
                setHasDepartedLogo(true);
                showSpeechBubble('✦ Free Roam ACTIVE! Exploring viewport...', 'happy', 3200);
                glideToNewWaypoint();
              }
            }}
            onMouseEnter={() => {
              setIsHovered(true);
              isInteractingRef.current = true;
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              if (!isDragging) {
                setTimeout(() => {
                  isInteractingRef.current = false;
                }, 1200);
              }
            }}
            className="relative group"
            title="Warden (Drag me around! Click for Health Report | Double-click to toggle Free Roam)"
          >
            {/* Ambient Kinetic Plasma Aura */}
            <div
              className={`absolute -inset-2.5 rounded-full blur-md transition-colors duration-500 ${
                emotion === 'scared'
                  ? 'bg-status-blocked opacity-70 animate-pulse'
                  : recentErrors.length > 0
                  ? 'bg-status-blocked/50 opacity-70 animate-pulse'
                  : isDark
                  ? 'bg-warden-amber/35 group-hover:bg-warden-amber/65 opacity-60'
                  : 'bg-amber-500/30 group-hover:bg-amber-500/60 opacity-70'
              }`}
            />

            {/* Top Antenna with Pulsing Beacon Light */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <span
                className={`w-2 h-2 rounded-full border shadow-sm animate-pulse ${
                  emotion === 'scared' || recentErrors.length > 0 || !isOnline
                    ? 'bg-status-blocked shadow-[0_0_10px_hsl(var(--status-blocked))]'
                    : 'bg-warden-emerald shadow-[0_0_8px_hsl(var(--warden-emerald))]'
                } ${isDark ? 'border-black' : 'border-stone-800'}`}
              />
              <span className={`w-0.5 h-2 ${isDark ? 'bg-warden-amber/80' : 'bg-amber-600'}`} />
            </div>

            {/* Main Robot Chassis */}
            <div
              className={`relative w-12 h-12 rounded-2xl border-2 flex flex-col items-center justify-center p-1 overflow-hidden transition-all duration-500 ${
                isDark
                  ? 'bg-gradient-to-br from-[#1c1a17] via-[#141311] to-[#0c0b0a] border-warden-amber/60 shadow-[0_12px_32px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.15)]'
                  : 'bg-gradient-to-br from-[#ffffff] via-[#f7f4ee] to-[#ebe4d8] border-amber-600/80 shadow-[0_10px_30px_rgba(180,83,9,0.22),inset_0_1px_2px_rgba(255,255,255,0.9)]'
              }`}
            >
              {/* Glossy Reflection Highlight */}
              <div className={`absolute top-0 left-0 right-0 h-3 rounded-t-xl ${isDark ? 'bg-white/10' : 'bg-white/55'}`} />

              {/* Visor / Face Screen */}
              <div
                className={`w-9 h-5 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  emotion === 'scared' || recentErrors.length > 0 || !isOnline
                    ? 'bg-status-blocked/25 border border-status-blocked/60'
                    : isDark
                    ? 'bg-[#0a0a08] border border-warden-amber/40 shadow-inner'
                    : 'bg-[#1c1815] border border-amber-600/60 shadow-inner'
                }`}
              >
                {/* Animated Visor Eyes */}
                {emotion === 'scared' || recentErrors.length > 0 ? (
                  <div className="flex items-center gap-1.5 text-status-blocked font-mono font-black text-xs animate-ping">
                    <span>!</span>
                    <span>!</span>
                  </div>
                ) : emotion === 'happy' ? (
                  <div className="flex items-center gap-1.5 text-warden-emerald font-mono font-black text-xs">
                    <span>^</span>
                    <span>^</span>
                  </div>
                ) : emotion === 'curious' ? (
                  <div className={`flex items-center gap-1.5 font-mono font-black text-xs ${isDark ? 'text-warden-amber' : 'text-amber-400'}`}>
                    <span className="animate-pulse">o</span>
                    <span>_</span>
                    <span className="animate-pulse">O</span>
                  </div>
                ) : (
                  <div className={`flex items-center gap-1.5 font-mono font-black text-[11px] ${isDark ? 'text-warden-amber' : 'text-amber-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-warden-amber' : 'bg-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.9)]'}`} />
                    <span className={`w-1 h-0.5 ${isDark ? 'bg-warden-amber/60' : 'bg-amber-400/60'}`} />
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-warden-amber' : 'bg-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.9)]'}`} />
                  </div>
                )}
              </div>

              {/* Mini Chest Core Emblem */}
              <div className="mt-1 flex items-center gap-1">
                <span
                  className={`w-1 h-1 rounded-full animate-ping ${
                    recentErrors.length > 0 ? 'bg-status-blocked' : 'bg-warden-emerald'
                  }`}
                />
                <span className={`text-[7px] font-mono font-bold tracking-tighter ${isDark ? 'text-warden-text/70' : 'text-stone-800 font-extrabold'}`}>
                  WARDEN
                </span>
              </div>
            </div>

            {/* Left and Right Thruster Stabilizer Fins */}
            <motion.div
              animate={{ rotate: isDragging ? [-18, 18] : [-6, 6, -6] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-full border pointer-events-none transition-colors duration-300 ${
                isDark ? 'bg-warden-amber border-black/80' : 'bg-amber-600 border-amber-900/60'
              }`}
            />
            <motion.div
              animate={{ rotate: isDragging ? [18, -18] : [6, -6, 6] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-full border pointer-events-none transition-colors duration-300 ${
                isDark ? 'bg-warden-amber border-black/80' : 'bg-amber-600 border-amber-900/60'
              }`}
            />

            {/* Bottom Dual Thruster Plasma Jet */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
              <span
                className={`rounded-full blur-[2px] animate-pulse transition-all ${
                  isDragging
                    ? isDark ? 'w-2 h-4 bg-warden-amber shadow-[0_0_16px_hsl(var(--warden-amber))]' : 'w-2 h-4 bg-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.85)]'
                    : isDark ? 'w-1.5 h-2 bg-warden-amber/90' : 'w-1.5 h-2 bg-amber-500/90'
                }`}
              />
              <span
                className={`rounded-full blur-[2px] animate-pulse transition-all ${
                  isDragging
                    ? isDark ? 'w-2 h-4 bg-warden-amber shadow-[0_0_16px_hsl(var(--warden-amber))]' : 'w-2 h-4 bg-amber-500 shadow-[0_0_14px_rgba(245,158,11,0.85)]'
                    : isDark ? 'w-1.5 h-2 bg-warden-amber/90' : 'w-1.5 h-2 bg-amber-500/90'
                }`}
              />
            </div>
          </motion.div>

          {/* Quick Roam/Hover Mode Badge */}
          <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                onClick={(e) => {
                  if (e) e.stopPropagation();
                  playRoboChirp('roam');
                  const next = !isFreeRoaming;
                  setIsFreeRoaming(next);
                  if (!next) {
                    showSpeechBubble('Hover Mode: Holding coordinates in place.', 'idle', 2800);
                  } else {
                    setHasDepartedLogo(true);
                    showSpeechBubble('✦ Free Roam ACTIVE! Exploring viewport...', 'happy', 3200);
                    glideToNewWaypoint();
                  }
                }}
                className={`mt-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold transition-colors shadow-lg flex items-center gap-1 cursor-pointer pointer-events-auto ${
                  isDark
                    ? 'bg-warden-surface/90 hover:bg-warden-amber hover:text-black border border-warden-amber/40 text-warden-amber'
                    : 'bg-white/95 hover:bg-amber-600 hover:text-white border border-amber-600/50 text-amber-800'
                }`}
                title="Toggle Autonomous Free Roam"
              >
                <Compass className="h-2.5 w-2.5" />
                <span>{isFreeRoaming ? 'ROAMING: ON' : 'HOVER MODE'}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SentinelCompanion;
