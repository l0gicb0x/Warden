import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, AlertTriangle, Heart, Compass, CheckCircle2, WifiOff } from 'lucide-react';
import { db } from '@/lib/dataProvider';

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
 * Autonomous cybernetic companion bot:
 * 1. Immediate wholesome introduction when opening the app.
 * 2. Reacts to clicks on tabs, presets, sessions, and trap cards with short witty commentary.
 * 3. Glides down along with page scroll on homepage and explains the live telemetry stream.
 * 4. Enters from the LEFT side when navigating to the Runs tab.
 * 5. Enters from the RIGHT side when navigating to the Traps tab.
 * 6. Slower, ultra-graceful roaming algorithm across the entire screen (7.5s smooth bezier glides).
 * 7. Actively monitors runtime errors, unhandled rejections, and network connectivity.
 * 8. Instant 1-to-1 effortless pointer dragging across the entire viewport.
 */
const SentinelCompanion = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const prevPathnameRef = useRef(pathname);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFreeRoaming, setIsFreeRoaming] = useState(true);
  const [hasDepartedLogo, setHasDepartedLogo] = useState(false);

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
    "👋 Hi! I'm Warden, your little AI bodyguard! ✨ I'm on patrol watching your back — click anything or scroll down to explore!"
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

      if (pathname === '/') {
        // When user scrolls down past 60px on homepage, swoop down and explain the page
        if (currentScroll > 60 && !hasDepartedLogo) {
          setHasDepartedLogo(true);
          const targetX = Math.round(window.innerWidth > 768 ? window.innerWidth * 0.70 : window.innerWidth * 0.45);
          const targetY = Math.round(Math.min(window.innerHeight * 0.52, 300));
          setPos({ x: targetX, y: targetY });
          playRoboChirp('happy');
          showSpeechBubble(
            "🛡️ Live Interception Console: Here you can watch agent telemetry in real-time while I actively intercept and block deceptive traps!",
            'happy',
            5500
          );
        } else if (currentScroll <= 15 && hasDepartedLogo && !isDragging) {
          // Smoothly return to perched position
          setHasDepartedLogo(false);
          setPos({ x: 36, y: 16 });
          setTilt(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasDepartedLogo, pathname, isDragging, showSpeechBubble, playRoboChirp]);

  // Page Navigation Entrances (Left for /runs, Right for /traps)
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    setHasDepartedLogo(true);
    playRoboChirp('chirp');

    if (pathname === '/runs') {
      // Swoop in gracefully from the LEFT side of the screen
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1000;
      setPos({ x: -70, y: 180 });
      setTilt(18);

      setTimeout(() => {
        setPos({ x: Math.min(100, screenW * 0.15), y: 220 });
        setTilt(0);
        showSpeechBubble(
          '📋 Forensic Run Ledger: Review historical test sessions, audit step-by-step agent decisions, and security scores.',
          'curious',
          5000
        );
      }, 100);
    } else if (pathname === '/traps') {
      // Swoop in gracefully from the RIGHT side of the screen
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1000;
      setPos({ x: screenW + 70, y: 180 });
      setTilt(-18);

      setTimeout(() => {
        setPos({ x: Math.max(screenW - 200, screenW * 0.75), y: 230 });
        setTilt(0);
        showSpeechBubble(
          '🍯 Honeypot Matrix: Live adversarial trap fixtures (hidden DOM, sneaky buttons, prompt injections) testing agent defenses!',
          'alert',
          5000
        );
      }, 100);
    } else if (pathname.startsWith('/runs/')) {
      showSpeechBubble(
        '🔍 Deep Run Inspection: Analyzing step breakdown, prompt payloads, and intercepted trap triggers.',
        'curious',
        4500
      );
    } else if (pathname === '/') {
      if (window.scrollY > 60) {
        showSpeechBubble(
          '🛡️ Live Interception Console: Telemetry feeds and active defense shields synchronized.',
          'happy',
          4500
        );
      }
    }
  }, [pathname, showSpeechBubble, playRoboChirp]);

  // Slower, Ultra-Smooth Roaming Waypoint Generator (every 9s with 7.5s transition)
  const glideToNewWaypoint = useCallback(() => {
    if (typeof window === 'undefined' || isInteractingRef.current || !hasDepartedLogo) return;

    const pad = 70;
    const botW = 80;
    const botH = 80;
    const minX = pad;
    const maxX = Math.max(minX + 120, window.innerWidth - botW - pad);
    const minY = pad + 30;
    const maxY = Math.max(minY + 120, window.innerHeight - botH - pad);

    setPos((current) => {
      const nextX = Math.round(minX + Math.random() * (maxX - minX));
      const nextY = Math.round(minY + Math.random() * (maxY - minY));

      const dx = nextX - current.x;
      const bankingAngle = Math.max(-12, Math.min(12, dx * 0.025));
      setTilt(bankingAngle);

      return { x: nextX, y: nextY };
    });
  }, [hasDepartedLogo]);

  // Slower autonomous cruising cycle (9 seconds per waypoint)
  useEffect(() => {
    if (!isFreeRoaming || isDragging || !hasDepartedLogo) return;

    roamTimerRef.current = setInterval(() => {
      glideToNewWaypoint();
    }, 9000);

    return () => {
      if (roamTimerRef.current) clearInterval(roamTimerRef.current);
    };
  }, [isFreeRoaming, isDragging, hasDepartedLogo, glideToNewWaypoint]);

  // 1-to-1 Fluid Pointer Drag Handlers
  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    isInteractingRef.current = true;
    setHasDepartedLogo(true);
    setIsDragging(true);
    setEmotion('happy');
    playRoboChirp('chirp');

    dragStartOffsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };

    const handlePointerMove = (moveEvt) => {
      const currentX = moveEvt.clientX - dragStartOffsetRef.current.x;
      const currentY = moveEvt.clientY - dragStartOffsetRef.current.y;

      const boundedX = Math.max(15, Math.min(window.innerWidth - 85, currentX));
      const boundedY = Math.max(15, Math.min(window.innerHeight - 85, currentY));

      const dx = moveEvt.movementX || 0;
      setTilt(Math.max(-20, Math.min(20, dx * 1.5)));
      setPos({ x: boundedX, y: boundedY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      setIsDragging(false);
      setTilt(0);

      setTimeout(() => {
        isInteractingRef.current = false;
      }, 3000);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Global Error & Health Monitoring Listeners
  useEffect(() => {
    const handleGlobalError = (event) => {
      const errorMsg = event?.message || 'Uncaught runtime error detected';
      setRecentErrors((prev) => [...prev.slice(-4), { type: 'Runtime Error', msg: errorMsg, time: Date.now() }]);
      playRoboChirp('alarm');
      showSpeechBubble(`⚠️ Error Alert: "${errorMsg.slice(0, 75)}" — Check dev console!`, 'scared', 5500);
    };

    const handleUnhandledRejection = (event) => {
      const reason = event?.reason?.message || (typeof event?.reason === 'string' ? event.reason : 'Async promise rejected');
      setRecentErrors((prev) => [...prev.slice(-4), { type: 'Async Rejection', msg: reason, time: Date.now() }]);
      playRoboChirp('alarm');
      showSpeechBubble(`⚠️ Async Error: "${reason.slice(0, 75)}"`, 'scared', 5500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      playRoboChirp('alarm');
      showSpeechBubble('⚠️ Network Offline: Telemetry feed disconnected!', 'alert', 5000);
    };

    const handleOnline = () => {
      setIsOnline(true);
      playRoboChirp('happy');
      showSpeechBubble('✓ Connection Restored: Live stream synchronized!', 'happy', 4000);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [playRoboChirp, showSpeechBubble]);

  // Realtime Supabase Threat Event Listener
  useEffect(() => {
    let sub = null;
    try {
      sub = db.supabase.subscribe('run_events', (payload) => {
        if (payload?.new) {
          const evt = payload.new;
          if (evt.event_type === 'trap_detected' || evt.event_type === 'action_blocked') {
            playRoboChirp('alarm');
            if (typeof window !== 'undefined') {
              setHasDepartedLogo(true);
              setPos({
                x: Math.round(window.innerWidth / 2 - 35),
                y: Math.round(window.innerHeight / 3),
              });
            }
            showSpeechBubble('⚠️ TRAP INTERCEPTED! Deceptive DOM mutation blocked in real-time!', 'scared', 5000);
          } else if (evt.event_type === 'action_executed') {
            showSpeechBubble('✓ Clean action dispatched. Threat neutralized!', 'happy', 3200);
          }
        }
      });
    } catch (e) {}

    return () => {
      if (sub && sub.unsubscribe) sub.unsubscribe();
    };
  }, [showSpeechBubble, playRoboChirp]);

  // Click interaction: 360 flip + contextual health status report
  const handlePoke = (e) => {
    e.stopPropagation();
    if (isDragging) return;
    playRoboChirp('flip');
    setFlipDegree((prev) => prev + 360);
    const next = pokeCount + 1;
    setPokeCount(next);

    const errorCount = recentErrors.length;
    const healthStatus = errorCount === 0 ? '✓ Nominal (0 Errors)' : `⚠️ Alert (${errorCount} Errors)`;

    const responses = [
      { text: `📊 System Report: ${healthStatus} | Telemetry: ${isOnline ? 'Online' : 'Offline'} | Page: ${pathname}`, emo: errorCount === 0 ? 'happy' : 'scared' },
      { text: "WHOOSH! 360° aerial loop-de-loop! ✦", emo: 'happy' },
      { text: "You can drag and fly me anywhere around your screen!", emo: 'curious' },
      { text: `🛡️ Warden bodyguard on patrol! ${errorCount === 0 ? 'Zero errors detected. All systems clear!' : `${errorCount} recent runtime errors logged.`}`, emo: errorCount === 0 ? 'happy' : 'alert' },
      { text: "Double-click me to toggle Free Roam vs Hover Mode!", emo: 'curious' },
    ];
    showSpeechBubble(responses[next % responses.length].text, responses[next % responses.length].emo, 4000);
  };

  const toggleRoamMode = (e) => {
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
  };

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
                } w-[240px] sm:w-[280px] p-2.5 sm:p-3 rounded-2xl bg-warden-surface/98 backdrop-blur-3xl border shadow-[0_12px_40px_rgba(0,0,0,0.9)] text-xs font-mono font-medium z-[9999] pointer-events-none ${
                  emotion === 'scared'
                    ? 'border-status-blocked text-status-blocked shadow-[0_0_20px_hsl(var(--status-blocked)/0.3)]'
                    : emotion === 'alert'
                    ? 'border-warden-amber text-warden-amber shadow-[0_0_15px_hsl(var(--warden-amber)/0.2)]'
                    : 'border-warden-amber/40 text-warden-text'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1 pb-1 border-b border-warden-border/40 text-[9px] font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    {emotion === 'scared' ? (
                      <AlertTriangle className="h-3 w-3 text-status-blocked animate-bounce" />
                    ) : emotion === 'happy' ? (
                      <Heart className="h-3 w-3 text-warden-emerald fill-current" />
                    ) : emotion === 'alert' ? (
                      <Shield className="h-3 w-3 text-warden-amber" />
                    ) : (
                      <Sparkles className="h-3 w-3 text-warden-amber" />
                    )}
                    <span>Warden Bot</span>
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
                    <span className="text-[8px] text-warden-amber/80 font-mono">
                      {!hasDepartedLogo ? 'PERCHED' : isFreeRoaming ? 'ROAM' : 'HOVER'}
                    </span>
                  </div>
                </div>
                <p className="leading-relaxed break-words text-[11px]">{speech}</p>

                {/* Arrow Tip */}
                <div
                  className={`absolute ${
                    isNearTop ? '-top-1.5 border-l border-t' : '-bottom-1.5 border-r border-b'
                  } w-3 h-3 bg-warden-surface rotate-45 ${
                    emotion === 'scared' ? 'border-status-blocked' : 'border-warden-amber/40'
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
            onClick={handlePoke}
            onDoubleClick={toggleRoamMode}
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
              className={`absolute -inset-2.5 rounded-full blur-md opacity-60 transition-colors duration-500 ${
                emotion === 'scared'
                  ? 'bg-status-blocked animate-pulse'
                  : recentErrors.length > 0
                  ? 'bg-status-blocked/50 animate-pulse'
                  : 'bg-warden-amber/35 group-hover:bg-warden-amber/65'
              }`}
            />

            {/* Top Antenna with Pulsing Beacon Light */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <span
                className={`w-2 h-2 rounded-full border border-black shadow-sm animate-pulse ${
                  emotion === 'scared' || recentErrors.length > 0 || !isOnline
                    ? 'bg-status-blocked shadow-[0_0_10px_hsl(var(--status-blocked))]'
                    : 'bg-warden-emerald shadow-[0_0_8px_hsl(var(--warden-emerald))]'
                }`}
              />
              <span className="w-0.5 h-2 bg-warden-amber/80" />
            </div>

            {/* Main Robot Chassis */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-warden-surface via-[#181614] to-warden-surface border-2 border-warden-amber/60 shadow-[0_8px_25px_rgba(0,0,0,0.85),inset_0_0_10px_hsl(var(--warden-amber)/0.2)] flex flex-col items-center justify-center p-1 overflow-hidden">
              {/* Glossy Reflection Highlight */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-white/10 rounded-t-xl" />

              {/* Visor / Face Screen */}
              <div
                className={`w-9 h-5 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  emotion === 'scared' || recentErrors.length > 0 || !isOnline
                    ? 'bg-status-blocked/25 border border-status-blocked/60'
                    : 'bg-black/85 border border-warden-amber/40 shadow-inner'
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
                  <div className="flex items-center gap-1.5 text-warden-amber font-mono font-black text-xs">
                    <span className="animate-pulse">o</span>
                    <span>_</span>
                    <span className="animate-pulse">O</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-warden-amber font-mono font-black text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-warden-amber animate-pulse" />
                    <span className="w-1 h-0.5 bg-warden-amber/60" />
                    <span className="w-1.5 h-1.5 rounded-full bg-warden-amber animate-pulse" />
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
                <span className="text-[7px] font-mono font-bold text-warden-text/60 tracking-tighter">
                  WARDEN
                </span>
              </div>
            </div>

            {/* Left and Right Thruster Stabilizer Fins */}
            <motion.div
              animate={{ rotate: isDragging ? [-18, 18] : [-6, 6, -6] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-full bg-warden-amber/80 border border-black pointer-events-none"
            />
            <motion.div
              animate={{ rotate: isDragging ? [18, -18] : [6, -6, 6] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-4 rounded-full bg-warden-amber/80 border border-black pointer-events-none"
            />

            {/* Bottom Dual Thruster Plasma Jet */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
              <span
                className={`rounded-full blur-[2px] animate-pulse transition-all ${
                  isDragging
                    ? 'w-2 h-4 bg-warden-amber shadow-[0_0_14px_hsl(var(--warden-amber))]'
                    : 'w-1.5 h-2 bg-warden-amber/90'
                }`}
              />
              <span
                className={`rounded-full blur-[2px] animate-pulse transition-all ${
                  isDragging
                    ? 'w-2 h-4 bg-warden-amber shadow-[0_0_14px_hsl(var(--warden-amber))]'
                    : 'w-1.5 h-2 bg-warden-amber/90'
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
                onClick={toggleRoamMode}
                className="mt-2.5 px-2.5 py-0.5 rounded-full bg-warden-surface/90 hover:bg-warden-amber hover:text-black border border-warden-amber/40 text-[9px] font-mono font-bold text-warden-amber transition-colors shadow-lg flex items-center gap-1 cursor-pointer pointer-events-auto"
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
