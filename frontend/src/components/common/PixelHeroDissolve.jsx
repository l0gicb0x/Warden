import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Terminal, Radio } from 'lucide-react';

/**
 * PixelHeroDissolve — Stealth Bat-Shield Monogram & Cinematic Unveil
 * ────────────────────────────────────────────────────────────────────────
 * 1. Full-Screen Immersion: Covers 100% of the viewport on initial arrival.
 * 2. Unified Emblem & Typography: A unified Stealth Bat-Shield crest with crisp
 *    titanium lettering (no overlapping clashes).
 * 3. Fluid Scroll Transmutation: The stealth wings sweep open, dissolving into
 *    luminous titanium & gold stardust to reveal the live console.
 * 4. Refresh Persistent: Automatically replays cleanly whenever the user refreshes.
 */
const PixelHeroDissolve = () => {
  const runwayRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end start'],
  });

  // Hero stage opacity and scale — perfectly smoothed across the runway
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.9, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroPointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.92 ? 'none' : 'auto'));

  // Stealth Wings Expansion & Elevation — continuous through 1.0
  const crestScale = useTransform(scrollYProgress, [0, 0.95], [1, 3.2]);
  const crestY = useTransform(scrollYProgress, [0, 0.95], ['0px', '-90px']);
  const crestRotate = useTransform(scrollYProgress, [0, 0.95], [0, -10]);
  const crestBlur = useTransform(scrollYProgress, [0, 0.8, 1], ['blur(0px)', 'blur(6px)', 'blur(20px)']);

  // Typography Transmutation — elongated so brand remains legible until arrival
  const titleY = useTransform(scrollYProgress, [0, 0.9], ['0px', '60px']);
  const titleLetterSpacing = useTransform(scrollYProgress, [0, 0.9], ['0.15em', '0.45em']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.75, 0.95], [1, 0.8, 0]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.75, 0.95], ['blur(0px)', 'blur(4px)', 'blur(14px)']);

  // Laser Particle Dispersal
  const shardLeft = useTransform(scrollYProgress, [0, 0.95], ['0px', '-380px']);
  const shardRight = useTransform(scrollYProgress, [0, 0.95], ['0px', '380px']);
  const shardOpacity = useTransform(scrollYProgress, [0, 0.3, 0.9], [0, 1, 0]);

  // Metadata fadeout
  const metaOpacity = useTransform(scrollYProgress, [0, 0.5, 0.85], [1, 0.7, 0]);

  const scrollToConsole = () => {
    // Scroll directly to the top boundary of the dashboard
    window.scrollTo({
      top: window.innerHeight * 0.95,
      behavior: 'smooth',
    });
  };

  return (
    <div ref={runwayRef} className="relative h-[120vh] -mt-3 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Full-Screen 100% Opaque Sticky Viewport Stage (Conceals everything beneath until scrolled) */}
      <motion.div
        style={{
          opacity: heroOpacity,
          scale: heroScale,
          pointerEvents: heroPointerEvents,
        }}
        className="sticky top-0 h-screen w-full flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none bg-warden-bg z-40 border-b border-warden-amber/30"
      >
        {/* ── Top Swiss Architectural Header ───────────────────── */}
        <motion.div
          style={{ opacity: metaOpacity }}
          className="flex items-center justify-between text-xs font-mono tracking-widest text-warden-text/60 uppercase z-20"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-warden-amber shadow-[0_0_8px_hsl(var(--warden-amber))]" />
            <span className="font-bold text-warden-text tracking-wider">WARDEN // NOCTURNE</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-warden-text/40">
            <span>[ SYSTEM: DETERMINISTIC SHIELD ]</span>
            <span>STATUS: SENTRY ACTIVE</span>
          </div>
          <div className="flex items-center gap-1.5 text-warden-amber font-semibold">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>ONLINE</span>
          </div>
        </motion.div>

        {/* ── Unified Center Stage: Stealth Bat-Shield Monogram + Brand ── */}
        <div className="relative flex-1 flex flex-col items-center justify-center my-auto z-10">
          {/* Stealth Wings & Laser Shard Particles */}
          <motion.div
            style={{ x: shardLeft, y: shardLeft, opacity: shardOpacity }}
            className="absolute w-4 h-4 bg-warden-amber shadow-[0_0_20px_hsl(var(--warden-amber))]"
          />
          <motion.div
            style={{ x: shardRight, y: shardLeft, opacity: shardOpacity }}
            className="absolute w-3.5 h-3.5 bg-yellow-200 shadow-[0_0_20px_white]"
          />
          <motion.div
            style={{ x: shardLeft, y: shardRight, opacity: shardOpacity }}
            className="absolute w-4 h-4 bg-amber-600 shadow-[0_0_15px_hsl(var(--warden-amber))]"
          />

          {/* Central Monolithic Stealth Batman "W" Shield Emblem — MASSIVE SCREEN PRESENCE */}
          <motion.div
            style={{
              scale: crestScale,
              y: crestY,
              rotate: crestRotate,
              filter: crestBlur,
            }}
            className="relative w-[90vw] max-w-4xl h-[40vh] sm:h-[48vh] flex items-center justify-center mb-6 sm:mb-8"
          >
            {/* Ambient Radial Laser Super-Glow */}
            <div className="absolute inset-0 rounded-full bg-warden-amber/15 blur-3xl scale-125 pointer-events-none" />
            <div className="absolute inset-8 rounded-full bg-amber-500/10 blur-2xl animate-pulse pointer-events-none" />

            {/* Concentric Holographic Radar HUD Rings */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[32rem] md:h-[32rem] rounded-full border border-warden-amber/20 animate-spin pointer-events-none" style={{ animationDuration: '35s' }} />
            <div className="absolute w-60 h-60 sm:w-80 sm:h-80 md:w-[26rem] md:h-[26rem] rounded-full border border-dashed border-warden-amber/30 animate-spin pointer-events-none" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />

            <svg
              viewBox="0 0 280 150"
              className="w-full h-full text-warden-amber drop-shadow-[0_0_50px_hsl(var(--warden-amber)/0.6)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="batWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--warden-amber))" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="hsl(var(--warden-amber))" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="hsl(var(--warden-amber))" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="laserBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="hsl(var(--warden-amber))" />
                  <stop offset="100%" stopColor="hsl(var(--warden-amber))" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Massive Outer Stealth Facet Wings (Batman + W Monogram Architecture) */}
              <path
                d="M 15 25 
                   L 75 25 
                   L 105 70 
                   L 140 12 
                   L 175 70 
                   L 205 25 
                   L 265 25 
                   L 230 92 
                   L 140 142 
                   L 50 92 
                   Z"
                fill="url(#batWingGrad)"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Mid-Tier Stealth Armor Plates */}
              <path
                d="M 38 40 L 82 40 L 112 82 L 140 32 L 168 82 L 198 40 L 242 40 L 214 88 L 140 128 L 66 88 Z"
                stroke="hsl(var(--warden-amber))"
                strokeWidth="1.6"
                strokeOpacity="0.85"
                strokeLinejoin="round"
              />

              {/* Inner Facet Kintsugi Laser Seams */}
              <path
                d="M 58 52 L 90 52 L 118 92 L 140 50 L 162 92 L 190 52 L 222 52 L 198 84 L 140 114 L 82 84 Z"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeOpacity="0.75"
                strokeLinejoin="round"
              />

              {/* Central Guardian Sentry Core Spine */}
              <line x1="140" y1="12" x2="140" y2="142" stroke="url(#laserBeam)" strokeWidth="2.4" />
              
              {/* Pulsing Energy Core Node */}
              <circle cx="140" cy="74" r="5.5" fill="#ffffff" className="shadow-[0_0_20px_white]" />
              <circle cx="140" cy="74" r="10" stroke="hsl(var(--warden-amber))" strokeWidth="1.5" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: '8s' }} />
              <circle cx="140" cy="74" r="16" stroke="hsl(var(--warden-amber))" strokeWidth="1" strokeOpacity="0.4" />
            </svg>
          </motion.div>

          {/* Unified Brand Typography (Clean, Non-Overlapping & Monumental) */}
          <motion.div
            style={{
              y: titleY,
              opacity: titleOpacity,
              filter: titleBlur,
              letterSpacing: titleLetterSpacing,
            }}
            className="flex flex-col items-center text-center -mt-2 sm:-mt-4"
          >
            <h1 className="text-4xl sm:text-7xl md:text-8xl font-display font-black tracking-widest text-zinc-100 uppercase drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center gap-4">
              <span className="tracking-tight">WARDEN</span>
              <span className="text-warden-amber font-mono font-light text-2xl sm:text-4xl">/</span>
              <span className="text-warden-amber">SHIELD</span>
            </h1>

            <div className="flex items-center gap-4 mt-3 sm:mt-5 text-xs sm:text-base font-mono text-zinc-400 uppercase tracking-[0.35em] font-semibold">
              <span className="w-8 sm:w-12 h-[1px] bg-warden-amber/80" />
              <span>Autonomous Browser Agent Bodyguard</span>
              <span className="w-8 sm:w-12 h-[1px] bg-warden-amber/80" />
            </div>
          </motion.div>
        </div>

        {/* ── Swiss Bottom Navigation Prompter ─────────────────── */}
        <motion.div
          style={{ opacity: metaOpacity }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-warden-text/70 z-20 border-t border-warden-border/40 pt-4"
        >
          <div className="flex items-center gap-2 text-warden-text/50">
            <Terminal className="h-3.5 w-3.5 text-warden-amber" />
            <span>DISINTEGRATE TO UNVEIL CONSOLE</span>
          </div>

          <button
            onClick={scrollToConsole}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-warden-amber/50 bg-warden-amber/15 text-warden-amber font-mono font-bold uppercase tracking-widest hover:bg-warden-amber hover:text-black transition-all duration-300 shadow-[0_0_20px_hsl(var(--warden-amber)/0.25)] animate-bounce"
          >
            <span>Scroll Down to Enter</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          <div className="hidden sm:block text-warden-text/40">
            <span>VERSION 3.0.4 // REALTIME</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PixelHeroDissolve;
