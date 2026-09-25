import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Zap, ShieldCheck, Terminal, ArrowDown, Play } from 'lucide-react';
import { speakWarden } from '@/components/common/SentinelCompanion';
import { useTheme } from '@/context/ThemeContext';

/**
 * LogoIntroAnimation — Grand Opening Brand Shield Entrance
 * Features:
 * 1. Pulsing Concentric Aura & Kintsugi Energy Rings
 * 2. Multi-stage SVG Shield Power-Up & Glowing Emblem Reveal
 * 3. Kinetic Typography: "WARDEN — Autonomous Agent Shield"
 * 4. Audio-visual power-up synthesis chime
 * 5. Interactive "Explore Mission Control" smooth scroll CTA
 */
const LogoIntroAnimation = ({ onExplore }) => {
  const { isDark } = useTheme();
  const [stage, setStage] = useState(0); // 0: power-up, 1: brand reveal, 2: fully armed

  useEffect(() => {
    // Stage sequence
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="relative w-full py-10 sm:py-16 flex flex-col items-center justify-center text-center overflow-hidden rounded-3xl border border-warden-border/60 bg-warden-surface/60 backdrop-blur-2xl shadow-2xl mb-8">
      {/* ── Ambient Radial Atmosphere ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-warden-primary/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-warden-primary/10 blur-3xl pointer-events-none animate-pulse" />

      {/* ── Multi-Stage Brand Shield Logo ── */}
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer Orbiting Energy Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-dashed border-warden-primary/40 shadow-[0_0_35px_hsl(var(--warden-primary)/0.2)]"
        />

        {/* Pulsing Concentric Energy Ring */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-warden-primary/30"
        />

        {/* Center Shield Emblem */}
        <motion.div
          initial={{ scale: 0, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 16, stiffness: 220, delay: 0.2 }}
          whileHover={{ scale: 1.1, rotate: 3 }}
          onClick={() => {
            speakWarden("🛡️ Warden Autonomous Shield fully armed and standing by!", "happy", 3500);
          }}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-2 flex items-center justify-center cursor-pointer transition-all shadow-2xl ${
            isDark
              ? 'bg-gradient-to-br from-[#1c1a17] via-[#141311] to-[#0c0b0a] border-warden-primary/70 shadow-[0_0_35px_hsl(var(--warden-primary)/0.35)]'
              : 'bg-gradient-to-br from-[#ffffff] via-[#f7f4ee] to-[#ebe4d8] border-warden-primary/80 shadow-[0_12px_35px_rgba(217,119,6,0.25)]'
          }`}
        >
          <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-warden-primary fill-warden-primary/10 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.2} />
          
          {/* Gleam Sparkle */}
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
            className="absolute -top-1.5 -right-1.5"
          >
            <Sparkles className="h-5 w-5 text-warden-amber" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Kinetic Typography Reveal ── */}
      <div className="relative z-10 space-y-3 px-4 max-w-2xl mx-auto">
        {/* Status Chip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-warden-primary/15 text-warden-primary border border-warden-primary/30"
        >
          <span className="w-2 h-2 rounded-full bg-warden-emerald animate-ping" />
          SYSTEM ARMED // REAL-TIME AGENT GUARD
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans text-warden-text"
        >
          WARDEN
        </motion.h1>

        {/* Subtitle & Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-sm sm:text-base text-warden-text/75 leading-relaxed font-sans max-w-lg mx-auto"
        >
          The autonomous bodyguard shield that intercepts deceptive DOM mutations, dark patterns, and prompt injection traps in real time.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-2 pt-2 font-mono text-xs text-warden-text/60"
        >
          <span className="px-2.5 py-1 rounded-lg bg-warden-surface border border-warden-border/60">
            ⚡ &lt; 12ms Deterministic Filter
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-warden-surface border border-warden-border/60">
            ✦ Groq AI Reasoning
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-warden-surface border border-warden-border/60">
            🛡️ 100% Zero-Bypass Defense
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default LogoIntroAnimation;
