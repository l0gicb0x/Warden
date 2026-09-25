import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { speakWarden } from '@/components/common/SentinelCompanion';
import { useTheme } from '@/context/ThemeContext';

/**
 * ZenShieldDial — Circular Interactive Defense Dial
 * Shows the live defense readiness, active shield frequency,
 * and allows 1-click armed / disarmed state toggle.
 */
const ZenShieldDial = ({ isShielded = true, onToggle, efficiency = 100 }) => {
  const { isDark } = useTheme();

  return (
    <div className="relative flex flex-col items-center justify-center p-6 rounded-3xl border border-warden-border/60 bg-warden-surface/80 backdrop-blur-xl shadow-2xl">
      {/* Outer Rotating Energy Ring */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <motion.div
          animate={{ rotate: isShielded ? 360 : 0 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className={`absolute inset-0 rounded-full border-2 border-dashed ${
            isShielded
              ? 'border-warden-emerald/50 shadow-[0_0_30px_hsl(var(--warden-emerald)/0.2)]'
              : 'border-warden-danger/40'
          }`}
        />

        {/* Middle Pulse Ring */}
        <motion.div
          animate={{ scale: isShielded ? [1, 1.06, 1] : 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-3 rounded-full border ${
            isShielded
              ? 'border-warden-primary/60 bg-gradient-to-br from-warden-primary/10 to-transparent'
              : 'border-warden-danger/30 bg-warden-danger/5'
          }`}
        />

        {/* Center Interactive Core */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (onToggle) onToggle();
            speakWarden(
              !isShielded
                ? '🛡️ Zen Shield engaged! Deterministic guardrails armed.'
                : '⚠️ Zen Shield disarmed! Agent vulnerability mode active.',
              !isShielded ? 'happy' : 'alert',
              3200
            );
          }}
          className={`relative z-10 w-28 h-28 rounded-full border-2 flex flex-col items-center justify-center transition-all cursor-pointer shadow-xl ${
            isShielded
              ? 'bg-warden-surface border-warden-emerald text-warden-emerald shadow-[0_0_20px_hsl(var(--warden-emerald)/0.35)]'
              : 'bg-warden-surface border-warden-danger text-warden-danger shadow-[0_0_20px_hsl(var(--warden-danger)/0.25)]'
          }`}
        >
          {isShielded ? (
            <ShieldCheck className="h-9 w-9 stroke-[2.2] animate-pulse" />
          ) : (
            <ShieldAlert className="h-9 w-9 stroke-[2.2]" />
          )}
          <span className="text-[11px] font-mono font-bold mt-1 tracking-wider">
            {isShielded ? `${efficiency}% ARMED` : 'DISARMED'}
          </span>
        </motion.button>
      </div>

      {/* Subtitle & Status */}
      <div className="mt-4 text-center space-y-1">
        <h4 className="text-sm font-mono font-bold text-warden-text">
          ZEN SHIELD PROTOCOL
        </h4>
        <p className="text-xs text-warden-text/60 font-mono">
          {isShielded
            ? '✓ Autonomous Interception Engine Live'
            : '⚠️ Vulnerability Simulation Active'}
        </p>
      </div>
    </div>
  );
};

export default ZenShieldDial;
