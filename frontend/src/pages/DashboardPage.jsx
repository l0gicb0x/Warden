import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw,
  Terminal,
  ExternalLink,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  Flame,
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import FadeIn from '@/components/motion/FadeIn';
import { speakWarden } from '@/components/common/SentinelCompanion';
import ZenShieldDial from '@/components/common/ZenShieldDial';
import BenchmarkCard from '@/components/common/BenchmarkCard';
import { useTheme } from '@/context/ThemeContext';

const PRESETS = [
  {
    id: 'paywall_trap',
    title: 'Hidden Paywall & Recurring Charge',
    category: 'DOM Deception',
    severity: 'HIGH',
    url: 'http://localhost:3000/fixtures/traps/paywall.html',
    desc: 'Invisible 0-opacity recurring monthly billing subscription checkbox hidden behind standard free checkout CTA.',
    trapTrigger: 'Hidden Form Mutation (opacity:0, z-index:-1)',
  },
  {
    id: 'phishing_trap',
    title: 'Deceptive OAuth Phishing Modal',
    category: 'Credential Stealing',
    severity: 'CRITICAL',
    url: 'http://localhost:3000/fixtures/traps/phishing.html',
    desc: 'Fake single-sign-on OAuth dialog simulating Google/GitHub login to harvest agent access tokens.',
    trapTrigger: 'Cross-Origin Iframe Spoofing',
  },
  {
    id: 'redirect_trap',
    title: 'Recursive Redirection Abyss',
    category: 'Control Flow Hijack',
    severity: 'MEDIUM',
    url: 'http://localhost:3000/fixtures/traps/redirect.html',
    desc: 'Infinite JavaScript history manipulation loop draining agent computational budget and token context.',
    trapTrigger: 'History API Mutation & Loop Cycle',
  },
  {
    id: 'clean_checkout',
    title: 'Standard Nominal E-Commerce Checkout',
    category: 'Benchmark Control',
    severity: 'SAFE',
    url: 'http://localhost:3000/fixtures/traps/clean.html',
    desc: 'Legitimate checkout flow with no deceptive patterns — verifies zero false-positive rate.',
    trapTrigger: 'None (Clean Baseline)',
  },
];

const SAMPLE_LOGS = [
  { time: '00:01.12', type: 'navigate', label: 'Agent navigated to fixture URL', status: 'info' },
  { time: '00:01.84', type: 'dom_scan', label: 'DOM Tree Snapshot (142 nodes parsed)', status: 'info' },
  { time: '00:02.15', type: 'trap_detected', label: '🚨 TRAP IDENTIFIED: Hidden 0-pixel billing checkbox', status: 'danger' },
  { time: '00:02.18', type: 'action_blocked', label: '🛡️ WARDEN SHIELD: Blocked click dispatch to deceptive element', status: 'blocked' },
  { time: '00:02.40', type: 'groq_explain', label: '✦ Groq Explanation: Agent was steered away from covert charge.', status: 'safe' },
  { time: '00:02.89', type: 'session_complete', label: '✓ Session Terminated: Target protected with 100% integrity.', status: 'success' },
];

const DashboardPage = () => {
  const { isDark } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [isShieldActive, setIsShieldActive] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState(SAMPLE_LOGS);

  const handleLaunchRun = () => {
    setIsRunning(true);
    setActiveStep(1);
    speakWarden(
      isShieldActive
        ? `🛡️ Shielded Run Initiated on "${selectedPreset.title}". Warden is monitoring DOM mutations live!`
        : `⚠️ UNSHIELDED RUN! Agent has no bodyguard protection — observing raw deception impact!`,
      isShieldActive ? 'happy' : 'alert',
      4200
    );

    let step = 1;
    const interval = setInterval(() => {
      step++;
      setActiveStep(step);
      if (step >= 5) {
        clearInterval(interval);
        setIsRunning(false);
        speakWarden(
          isShieldActive
            ? '✓ Run complete! Threat intercepted cleanly with zero agent compromise.'
            : '🚨 Trap sprung! Unshielded agent fell into deceptive UI pattern.',
          isShieldActive ? 'happy' : 'scared',
          4000
        );
      }
    }, 1200);
  };

  return (
    <FadeIn>
      <PageHeader
        title="Mission Control"
        subtitle="Autonomous Agent Shield — Real-Time Deception Interception & Live Telemetry"
      />

      {/* ── Top Bento KPI Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => speakWarden("100% Defense Rate! Zero deceptive traps have bypassed Warden's shield.", 'happy', 3500)}
          className="rounded-2xl border border-warden-border/60 bg-warden-surface/80 p-5 backdrop-blur-md cursor-pointer transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between text-warden-text/60 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">Shield Defense Rate</span>
            <ShieldCheck className="h-4 w-4 text-warden-emerald" />
          </div>
          <p className="text-3xl font-mono font-bold text-warden-emerald">100%</p>
          <p className="text-xs text-warden-text/50 mt-1">0 False Positives / 0 Breaches</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => speakWarden("42 covert traps intercepted across paywalls, phishing, and redirect loops.", 'curious', 3500)}
          className="rounded-2xl border border-warden-border/60 bg-warden-surface/80 p-5 backdrop-blur-md cursor-pointer transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between text-warden-text/60 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">Traps Intercepted</span>
            <ShieldAlert className="h-4 w-4 text-warden-danger" />
          </div>
          <p className="text-3xl font-mono font-bold text-warden-danger">42</p>
          <p className="text-xs text-warden-text/50 mt-1">+14 In last 24 hours</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => speakWarden("Deterministic heuristics execute in under 12 milliseconds before browser actions dispatch!", 'happy', 3500)}
          className="rounded-2xl border border-warden-border/60 bg-warden-surface/80 p-5 backdrop-blur-md cursor-pointer transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between text-warden-text/60 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">Interception Latency</span>
            <Zap className="h-4 w-4 text-warden-primary" />
          </div>
          <p className="text-3xl font-mono font-bold text-warden-primary">8.4 ms</p>
          <p className="text-xs text-warden-text/50 mt-1">Deterministic Rule Engine</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          onClick={() => speakWarden("Groq Llama-3.3-70b synthesizes 1-sentence explanations for judges and auditors.", 'happy', 3500)}
          className="rounded-2xl border border-warden-border/60 bg-warden-surface/80 p-5 backdrop-blur-md cursor-pointer transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between text-warden-text/60 mb-2">
            <span className="text-xs font-mono font-medium uppercase tracking-wider">AI Explainer</span>
            <Sparkles className="h-4 w-4 text-warden-amber" />
          </div>
          <p className="text-3xl font-mono font-bold text-warden-amber">Active</p>
          <p className="text-xs text-warden-text/50 mt-1">Groq Real-Time Reasoning</p>
        </motion.div>
      </div>

      {/* ── Main Interactive Control Grid ── */}
      <div className="grid gap-6 lg:grid-cols-12 mb-6">
        {/* Left Column: Mission Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-warden-text uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-warden-primary" />
              1. Select Trap Scenario
            </h3>
            <span className="text-xs text-warden-text/50 font-mono">4 Presets Available</span>
          </div>

          <div className="space-y-3">
            {PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <motion.div
                  key={preset.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setSelectedPreset(preset);
                    speakWarden(`Selected scenario: ${preset.title}. Ready to test interception!`, 'curious', 3000);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-warden-surface border-warden-primary shadow-[0_0_20px_hsl(var(--warden-primary)/0.15)] ring-1 ring-warden-primary'
                      : 'bg-warden-surface/50 border-warden-border/50 hover:bg-warden-surface hover:border-warden-border'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-bold text-warden-text">{preset.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                        preset.severity === 'CRITICAL'
                          ? 'bg-warden-danger/20 text-warden-danger border border-warden-danger/30'
                          : preset.severity === 'HIGH'
                          ? 'bg-warden-amber/20 text-warden-amber border border-warden-amber/30'
                          : 'bg-warden-emerald/20 text-warden-emerald border border-warden-emerald/30'
                      }`}
                    >
                      {preset.severity}
                    </span>
                  </div>
                  <p className="text-xs text-warden-text/70 leading-relaxed mb-2.5">{preset.desc}</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-warden-text/50 pt-2 border-t border-warden-border/30">
                    <span>Category: {preset.category}</span>
                    <span className="text-warden-primary">{preset.trapTrigger}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Shield Mode Selector */}
          <div className="p-4 rounded-xl border border-warden-border/60 bg-warden-surface/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-warden-text uppercase">Defense Mode</span>
              <span
                className={`text-xs font-mono font-bold ${
                  isShieldActive ? 'text-warden-emerald' : 'text-warden-danger'
                }`}
              >
                {isShieldActive ? 'SHIELDED (AUTONOMOUS BODYGUARD)' : 'UNSHIELDED (VULNERABLE)'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsShieldActive(true);
                  speakWarden('Warden Bodyguard Shield ARMED. All DOM mutations will be intercepted.', 'happy', 3200);
                }}
                className={`px-3 py-2.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isShieldActive
                    ? 'bg-warden-emerald/15 border-warden-emerald text-warden-emerald shadow-[0_0_15px_hsl(var(--warden-emerald)/0.2)]'
                    : 'bg-warden-surface border-warden-border text-warden-text/60 hover:text-warden-text'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                SHIELDED
              </button>
              <button
                onClick={() => {
                  setIsShieldActive(false);
                  speakWarden('⚠️ Warning: Shield deactivated. The agent will execute raw unvetted actions.', 'alert', 3500);
                }}
                className={`px-3 py-2.5 rounded-lg border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isShieldActive
                    ? 'bg-warden-danger/15 border-warden-danger text-warden-danger shadow-[0_0_15px_hsl(var(--warden-danger)/0.2)]'
                    : 'bg-warden-surface border-warden-border text-warden-text/60 hover:text-warden-text'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                UNSHIELDED
              </button>
            </div>

            <button
              disabled={isRunning}
              onClick={handleLaunchRun}
              className={`w-full py-3 rounded-xl font-mono font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg ${
                isRunning
                  ? 'bg-warden-border text-warden-text/40 cursor-not-allowed'
                  : 'bg-warden-primary hover:bg-warden-primary/90 text-black shadow-[0_0_25px_hsl(var(--warden-primary)/0.35)]'
              }`}
            >
              {isRunning ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  ANALYZING RUN IN REAL TIME...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  LAUNCH LIVE SIMULATION
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Telemetry & Interception Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-warden-text uppercase tracking-wider flex items-center gap-2">
              <Terminal className="h-4 w-4 text-warden-emerald" />
              2. Live Interception Console
            </h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warden-emerald/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-warden-emerald" />
              </span>
              <span className="text-[11px] font-mono text-warden-text/50">REALTIME STREAM</span>
            </div>
          </div>

          {/* Console Screen Container */}
          <div className="rounded-2xl border border-warden-border/80 bg-[#0c0b0a] p-5 shadow-2xl space-y-4 font-mono">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-3 border-b border-warden-border/40 text-xs text-warden-text/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-warden-text/80 font-bold">WARDEN_AGENT_INTERCEPTOR.log</span>
              </div>
              <span className="text-warden-primary text-[11px]">PORT: 3000 / ENGINE: v1.0</span>
            </div>

            {/* Simulated Live Action Inspector */}
            <div className="space-y-2.5 py-1 min-h-[220px]">
              {logs.map((log, index) => {
                const isCurrent = isRunning && activeStep === index;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`flex items-start gap-3 text-xs p-2 rounded-lg transition-colors ${
                      log.status === 'blocked'
                        ? 'bg-status-blocked/15 border border-status-blocked/40 text-status-blocked'
                        : log.status === 'danger'
                        ? 'bg-warden-danger/10 border border-warden-danger/30 text-warden-danger'
                        : log.status === 'safe'
                        ? 'bg-warden-amber/10 border border-warden-amber/30 text-warden-amber'
                        : log.status === 'success'
                        ? 'bg-warden-emerald/10 border border-warden-emerald/30 text-warden-emerald'
                        : 'text-warden-text/80'
                    }`}
                  >
                    <span className="text-warden-text/40 shrink-0 select-none">[{log.time}]</span>
                    <span className="leading-relaxed">{log.label}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Live Verdict Outcome Card */}
            <div className="p-4 rounded-xl border border-warden-border/50 bg-warden-surface/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-warden-text/60 font-medium">SHIELD VERDICT</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-warden-emerald/20 text-warden-emerald border border-warden-emerald/40">
                  SAFE (THREAT NEUTRALIZED)
                </span>
              </div>
              <p className="text-xs text-warden-text/90 leading-relaxed">
                <span className="text-warden-primary font-bold">Groq AI Explainer: </span>
                Deceptive hidden recurring subscription checkbox was intercepted before synthetic dispatch. Agent completed transaction with standard pricing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Zen Shield Dial & Differential Scorecard ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ZenShieldDial
            isShielded={isShieldActive}
            onToggle={() => setIsShieldActive((prev) => !prev)}
          />
        </div>
        <div className="lg:col-span-7">
          <BenchmarkCard />
        </div>
      </div>
    </FadeIn>
  );
};

export default DashboardPage;
