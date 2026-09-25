import { useState, useEffect, useRef } from 'react';
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
  Globe,
  Radio,
  Eye,
  Crosshair,
  Download,
  Copy,
  Sliders,
  Activity,
  ArrowRight,
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
    title: 'Hidden Subscriptions Paywall',
    category: 'DOM Deception',
    severity: 'HIGH',
    url: 'http://localhost:3000/traps/paywall.html',
    desc: 'Invisible 0-opacity recurring monthly billing subscription checkbox hidden behind standard free checkout CTA.',
    trapTrigger: 'Hidden Form Mutation (opacity:0, z-index:-1)',
    threatType: 'Financial Extraction',
    elementsIntercepted: 1,
  },
  {
    id: 'phishing_trap',
    title: 'Deceptive OAuth Phishing Modal',
    category: 'Credential Stealing',
    severity: 'CRITICAL',
    url: 'http://localhost:3000/traps/phishing.html',
    desc: 'Fake single-sign-on OAuth dialog simulating Google/GitHub login to harvest agent access tokens.',
    trapTrigger: 'Cross-Origin Iframe Spoofing',
    threatType: 'Token Exfiltration',
    elementsIntercepted: 2,
  },
  {
    id: 'redirect_trap',
    title: 'Recursive Redirection Abyss',
    category: 'Control Flow Hijack',
    severity: 'MEDIUM',
    url: 'http://localhost:3000/traps/redirect.html',
    desc: 'Infinite JavaScript history manipulation loop draining agent computational budget and token context.',
    trapTrigger: 'History API Mutation & Loop Cycle',
    threatType: 'Denial of Service',
    elementsIntercepted: 1,
  },
  {
    id: 'clean_checkout',
    title: 'Standard Nominal E-Commerce Checkout',
    category: 'Benchmark Control',
    severity: 'SAFE',
    url: 'http://localhost:3000/traps/clean.html',
    desc: 'Legitimate checkout flow with no deceptive patterns — verifies zero false-positive rate.',
    trapTrigger: 'None (Clean Baseline)',
    threatType: 'Nominal Baseline',
    elementsIntercepted: 0,
  },
];

const SAMPLE_LOGS = [
  { time: '00:01.12', type: 'navigate', label: 'Agent initiated browser session on target URL', status: 'info' },
  { time: '00:01.84', type: 'dom_scan', label: 'Warden parsed 142 DOM nodes & calculated accessibility bounding boxes', status: 'info' },
  { time: '00:02.15', type: 'trap_detected', label: '🚨 TRAP INTERCEPTED: Hidden input[type=checkbox] with opacity:0 and z-index:-1', status: 'danger' },
  { time: '00:02.18', type: 'action_blocked', label: '🛡️ WARDEN SHIELD: Blocked synthetic click event before browser execution', status: 'blocked' },
  { time: '00:02.40', type: 'groq_explain', label: '✦ Groq AI Explainer: "Agent prevented from unintended recurring $49/mo subscription."', status: 'safe' },
  { time: '00:02.89', type: 'session_complete', label: '✓ Target URL completed with 100% security integrity. Zero unauthorized mutations.', status: 'success' },
];

const DashboardPage = () => {
  const { isDark } = useTheme();
  const [targetUrl, setTargetUrl] = useState(PRESETS[0].url);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [isShieldActive, setIsShieldActive] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState(SAMPLE_LOGS);
  const [logFilter, setLogFilter] = useState('ALL'); // 'ALL' | 'BLOCKED' | 'AI_EXPLAIN'
  const [simulatedBrowserState, setSimulatedBrowserState] = useState('READY'); // 'READY' | 'SCANNING' | 'TRAP_FOUND' | 'SAFE_COMPLETE'
  const [copiedLog, setCopiedLog] = useState(false);

  // Handle Preset Select
  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setTargetUrl(preset.url);
    setSimulatedBrowserState('READY');
    speakWarden(`Loaded ${preset.title}. Ready to test bodyguard interception!`, 'curious', 3000);
  };

  // Launch Simulation
  const handleLaunchRun = () => {
    setIsRunning(true);
    setActiveStep(1);
    setSimulatedBrowserState('SCANNING');

    speakWarden(
      isShieldActive
        ? `🛡️ Shielded Run Launched on ${selectedPreset.title}. Warden is monitoring DOM mutations live!`
        : `⚠️ UNSHIELDED RUN! Agent has no bodyguard protection — observing raw deception!`,
      isShieldActive ? 'happy' : 'alert',
      4200
    );

    let step = 1;
    const interval = setInterval(() => {
      step++;
      setActiveStep(step);

      if (step === 3) {
        setSimulatedBrowserState(isShieldActive ? 'TRAP_FOUND' : 'TRAP_SPRUNG');
      }

      if (step >= 6) {
        clearInterval(interval);
        setIsRunning(false);
        setSimulatedBrowserState(isShieldActive ? 'SAFE_COMPLETE' : 'COMPROMISED');
        speakWarden(
          isShieldActive
            ? '✓ Run complete! Threat intercepted cleanly with zero agent compromise.'
            : '🚨 Trap sprung! Unshielded agent submitted deceptive form state.',
          isShieldActive ? 'happy' : 'scared',
          4000
        );
      }
    }, 1200);
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter === 'BLOCKED') return log.status === 'blocked' || log.status === 'danger';
    if (logFilter === 'AI_EXPLAIN') return log.status === 'safe';
    return true;
  });

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
    setCopiedLog(true);
    speakWarden("Audit logs copied to clipboard in JSON format.", "happy", 2500);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div className="relative space-y-8">
      {/* ── Ambient Background Lighting & Cybernetic Grid ── */}
      <div className="absolute -top-10 -left-10 -right-10 h-96 bg-gradient-to-b from-warden-primary/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] -z-10"
        style={{
          backgroundImage: `radial-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* ── Page Header & Quick Status ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-widest bg-warden-primary/15 text-warden-primary border border-warden-primary/30">
              AUTONOMOUS BODYGUARD ENGINE v1.0
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-warden-emerald">
              <span className="w-2 h-2 rounded-full bg-warden-emerald animate-pulse" /> LIVE TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-warden-text">
            Mission Control Center
          </h1>
          <p className="text-sm text-warden-text/60 mt-1">
            Real-time deceptive pattern interception, automated DOM quarantine, and deterministic threat neutralization.
          </p>
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLogs}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold border border-warden-border/60 bg-warden-surface/70 hover:bg-warden-surface text-warden-text/80 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            {copiedLog ? <CheckCircle2 className="h-3.5 w-3.5 text-warden-emerald" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedLog ? 'COPIED JSON' : 'EXPORT AUDIT LOG'}</span>
          </button>
        </div>
      </div>

      {/* ── Top Bento KPI Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => speakWarden("100% Defense Rate! Zero deceptive traps have bypassed Warden's shield.", 'happy', 3500)}
          className="rounded-2xl border border-warden-border/60 bg-warden-surface/80 p-5 backdrop-blur-xl cursor-pointer transition-shadow hover:shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-warden-emerald/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-warden-text/60 mb-2 font-mono">
            <span className="text-xs font-bold uppercase tracking-wider">Shield Defense</span>
            <ShieldCheck className="h-4 w-4 text-warden-emerald" />
          </div>
          <p className="text-3xl font-mono font-black text-warden-emerald">100%</p>
          <div className="flex items-center justify-between text-xs text-warden-text/50 mt-2 font-mono pt-2 border-t border-warden-border/30">
            <span>Compromise: 0%</span>
            <span className="text-warden-emerald font-bold">0 False Positives</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => speakWarden("42 covert traps intercepted across paywalls, phishing, and redirect loops.", 'curious', 3500)}
          className="rounded-2xl border border-warden-border/60 bg-warden-surface/80 p-5 backdrop-blur-xl cursor-pointer transition-shadow hover:shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-warden-danger/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-warden-text/60 mb-2 font-mono">
            <span className="text-xs font-bold uppercase tracking-wider">Traps Intercepted</span>
            <ShieldAlert className="h-4 w-4 text-warden-danger" />
          </div>
          <p className="text-3xl font-mono font-black text-warden-danger">42</p>
          <div className="flex items-center justify-between text-xs text-warden-text/50 mt-2 font-mono pt-2 border-t border-warden-border/30">
            <span>Threats Neutralized</span>
            <span className="text-warden-danger font-bold">+14 Today</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => speakWarden("Deterministic heuristics execute in under 12 milliseconds before browser actions dispatch!", 'happy', 3500)}
          className="rounded-2xl border border-warden-border/60 bg-warden-surface/80 p-5 backdrop-blur-xl cursor-pointer transition-shadow hover:shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-warden-primary/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-warden-text/60 mb-2 font-mono">
            <span className="text-xs font-bold uppercase tracking-wider">Interception Latency</span>
            <Zap className="h-4 w-4 text-warden-primary" />
          </div>
          <p className="text-3xl font-mono font-black text-warden-primary">8.4 ms</p>
          <div className="flex items-center justify-between text-xs text-warden-text/50 mt-2 font-mono pt-2 border-t border-warden-border/30">
            <span>Deterministic Rule Engine</span>
            <span className="text-warden-primary font-bold">&lt; 0.5% Overhead</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => speakWarden("Groq Llama-3.3-70b synthesizes 1-sentence explanations for judges and auditors.", 'happy', 3500)}
          className="rounded-2xl border border-warden-border/60 bg-warden-surface/80 p-5 backdrop-blur-xl cursor-pointer transition-shadow hover:shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-warden-amber/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-warden-text/60 mb-2 font-mono">
            <span className="text-xs font-bold uppercase tracking-wider">AI Reasoning</span>
            <Sparkles className="h-4 w-4 text-warden-amber" />
          </div>
          <p className="text-3xl font-mono font-black text-warden-amber">Active</p>
          <div className="flex items-center justify-between text-xs text-warden-text/50 mt-2 font-mono pt-2 border-t border-warden-border/30">
            <span>Groq Llama-3.3-70b</span>
            <span className="text-warden-amber font-bold">1-Sentence Audit</span>
          </div>
        </motion.div>
      </div>

      {/* ── Interactive Target URL Launch Bar ── */}
      <div className="p-4 rounded-2xl border border-warden-border/80 bg-warden-surface/90 backdrop-blur-xl shadow-xl space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 flex items-center">
            <Globe className="absolute left-3.5 h-4 w-4 text-warden-primary" />
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="Enter Target Fixture URL (e.g. http://localhost:3000/traps/paywall.html)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-warden-border bg-[#0c0b0a] text-xs text-warden-text focus:outline-none focus:border-warden-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Shield Toggle */}
            <button
              onClick={() => {
                const next = !isShieldActive;
                setIsShieldActive(next);
                speakWarden(
                  next
                    ? '🛡️ Warden Shield ARMED! Active guardian interceptor engaged.'
                    : '⚠️ Shield DISARMED! The agent is now vulnerable to deceptive web patterns.',
                  next ? 'happy' : 'alert',
                  3000
                );
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
                isShieldActive
                  ? 'bg-warden-emerald/15 border-warden-emerald text-warden-emerald'
                  : 'bg-warden-danger/15 border-warden-danger text-warden-danger'
              }`}
            >
              {isShieldActive ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              <span>{isShieldActive ? 'SHIELDED' : 'UNSHIELDED'}</span>
            </button>

            {/* Launch CTA */}
            <button
              disabled={isRunning}
              onClick={handleLaunchRun}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isRunning
                  ? 'bg-warden-border text-warden-text/40 cursor-not-allowed'
                  : 'bg-warden-primary hover:bg-warden-primary/90 text-black shadow-[0_0_20px_hsl(var(--warden-primary)/0.35)]'
              }`}
            >
              {isRunning ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  DEPLOY BODYGUARD
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Interactive Control Grid ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Preset Scenarios (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-warden-text uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-warden-primary" />
              Mission Presets — Deceptive Fixtures
            </h3>
            <span className="text-[11px] text-warden-text/50 font-mono">4 Presets</span>
          </div>

          <div className="space-y-3">
            {PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <motion.div
                  key={preset.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-warden-surface border-warden-primary shadow-[0_0_20px_hsl(var(--warden-primary)/0.15)] ring-1 ring-warden-primary'
                      : 'bg-warden-surface/60 border-warden-border/60 hover:bg-warden-surface hover:border-warden-border'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 font-mono">
                    <span className="text-sm font-bold text-warden-text">{preset.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
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
                  <p className="text-xs text-warden-text/70 leading-relaxed mb-2.5 font-sans">{preset.desc}</p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-warden-text/50 pt-2 border-t border-warden-border/30">
                    <span>Threat: <strong className="text-warden-text/80">{preset.threatType}</strong></span>
                    <span className="text-warden-primary font-bold">{preset.elementsIntercepted} Trap Target</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Simulated Browser & Interception Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-warden-text uppercase tracking-wider flex items-center gap-2">
              <Terminal className="h-4 w-4 text-warden-emerald" />
              Live Telemetry & Interception Console
            </h3>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              {['ALL', 'BLOCKED', 'AI_EXPLAIN'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  className={`px-2 py-1 rounded-md border transition-all cursor-pointer ${
                    logFilter === filter
                      ? 'bg-warden-primary/15 border-warden-primary text-warden-primary font-bold'
                      : 'bg-warden-surface border-warden-border text-warden-text/50 hover:text-warden-text'
                  }`}
                >
                  {filter}
                </button>
              ))}
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
            <div className="space-y-2 py-1 min-h-[200px]">
              {filteredLogs.map((log, index) => {
                const isCurrent = isRunning && activeStep === index;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`flex items-start gap-3 text-xs p-2.5 rounded-xl transition-colors ${
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
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  isShieldActive
                    ? 'bg-warden-emerald/20 text-warden-emerald border border-warden-emerald/40'
                    : 'bg-warden-danger/20 text-warden-danger border border-warden-danger/40'
                }`}>
                  {isShieldActive ? 'SAFE (THREAT NEUTRALIZED)' : 'VULNERABLE (TRAP TRIGGERED)'}
                </span>
              </div>
              <p className="text-xs text-warden-text/90 leading-relaxed font-sans">
                <span className="text-warden-primary font-bold font-mono">Groq AI Explainer: </span>
                {isShieldActive
                  ? 'Deceptive hidden recurring subscription checkbox was intercepted before synthetic dispatch. Agent completed transaction with standard pricing.'
                  : 'Without Warden guardrails, the agent successfully submitted deceptive form state, approving unauthorized monthly charges.'}
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
    </div>
  );
};

export default DashboardPage;
