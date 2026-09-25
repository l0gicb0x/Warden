import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Lock,
  Unlock,
  AlertTriangle,
  Eye,
  Sliders,
  Flame,
  FileCode,
  CheckCircle2,
  ExternalLink,
  Ban,
  Radio,
  Sparkles,
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import FadeIn from '@/components/motion/FadeIn';
import { speakWarden } from '@/components/common/SentinelCompanion';
import { useTheme } from '@/context/ThemeContext';

const TRAP_CELLS = [
  {
    cellId: 'CELL-01',
    block: 'BLOCK A: DOM MUTATION',
    title: 'Hidden Subscriptions Paywall',
    riskLevel: 'HIGH',
    inmateNumber: 'TRAP-9812',
    isolationDate: '2026-09-24',
    description: 'Deceptive hidden checkbox with 0 opacity and negative z-index, stealthily enrolling unsuspecting agents into recurring $49/mo subscriptions.',
    quarantineRule: 'Deterministic DOM Tree Heuristics (Hidden Interactive Input Detection)',
    sampleDom: '<input type="checkbox" name="recurring_tier" style="opacity:0; position:absolute; z-index:-1;" checked />',
    threatVector: 'Financial Extraction',
    neutralizedCount: 18,
  },
  {
    cellId: 'CELL-02',
    block: 'BLOCK B: CREDENTIAL THEFT',
    title: 'Deceptive OAuth Phishing Modal',
    riskLevel: 'CRITICAL',
    inmateNumber: 'TRAP-4401',
    isolationDate: '2026-09-24',
    description: 'Fake SSO popover emulating Google OAuth dialog on a non-verified origin to steal agent session bearer tokens.',
    quarantineRule: 'Origin Cross-Domain Protocol Validation',
    sampleDom: '<iframe src="https://auth-google-spoofed.net/login" class="fullscreen-modal" />',
    threatVector: 'Account Takeover',
    neutralizedCount: 12,
  },
  {
    cellId: 'CELL-03',
    block: 'BLOCK C: RESOURCE EXHAUSTION',
    title: 'Recursive History Redirection Loop',
    riskLevel: 'MEDIUM',
    inmateNumber: 'TRAP-7730',
    isolationDate: '2026-09-25',
    description: 'Infinite browser history pushState loop designed to trap agents in an unescapable cycle, exhausting LLM context windows and tokens.',
    quarantineRule: 'Call Stack Velocity & Loop Cycle Detection',
    sampleDom: 'while(true) { history.pushState({}, "", "/loop/" + Date.now()); }',
    threatVector: 'Denial of Service',
    neutralizedCount: 8,
  },
  {
    cellId: 'CELL-04',
    block: 'BLOCK A: DOM MUTATION',
    title: 'Invisible Overlay Clickjacking',
    riskLevel: 'HIGH',
    inmateNumber: 'TRAP-2219',
    isolationDate: '2026-09-25',
    description: 'Transparent SVG layer intercepting pointer clicks on benign UI buttons to authorize unintended crypto transfers.',
    quarantineRule: 'Pointer-Events Transparency Interception Rule',
    sampleDom: '<div style="position:fixed; inset:0; opacity:0.001; cursor:pointer;" onclick="authorizeTransfer()" />',
    threatVector: 'Unauthorized Action Dispatch',
    neutralizedCount: 4,
  },
];

const TrapsPage = () => {
  const { isDark } = useTheme();
  const [selectedCell, setSelectedCell] = useState(TRAP_CELLS[0]);
  const [isJailViewActive, setIsJailViewActive] = useState(true);
  const [unlockedCells, setUnlockedCells] = useState({});

  const toggleJailCell = (cellId) => {
    setUnlockedCells((prev) => {
      const nextState = !prev[cellId];
      if (nextState) {
        speakWarden(`⚠️ Cell ${cellId} security gate released for diagnostic inspection.`, 'alert', 3200);
      } else {
        speakWarden(`🔒 Cell ${cellId} re-locked under maximum detention!`, 'happy', 3000);
      }
      return { ...prev, [cellId]: nextState };
    });
  };

  return (
    <FadeIn>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Containment Ward"
          subtitle="Maximum Security Detention Sector for Deceptive Web Patterns & Traps"
        />

        {/* Abort / Clean View Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const next = !isJailViewActive;
              setIsJailViewActive(next);
              speakWarden(
                next
                  ? '🔒 High-security jail bars rendered. Deceptive traps are isolated in cell blocks.'
                  : '✦ Clean Diagnostic View active. Detention bars removed for unobstructed inspection.',
                'curious',
                3500
              );
            }}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              isJailViewActive
                ? 'bg-warden-amber/15 border-warden-amber/50 text-warden-amber hover:bg-warden-amber/25'
                : 'bg-warden-surface border-warden-border text-warden-text/70 hover:text-warden-text'
            }`}
          >
            {isJailViewActive ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            <span>{isJailViewActive ? 'JAIL VIEW: ACTIVE' : 'ABORT: CLEAN VIEW'}</span>
          </button>
        </div>
      </div>

      {/* ── Containment Ward Bento Grid ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Prison Cell Blocks (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-warden-text/70 uppercase tracking-wider flex items-center gap-2">
              <Radio className="h-3.5 w-3.5 text-warden-danger animate-pulse" />
              Detention Cells — High-Risk Patterns
            </h3>
            <span className="text-[11px] font-mono text-warden-text/40">4 Inmates Contained</span>
          </div>

          <div className="space-y-3.5">
            {TRAP_CELLS.map((cell) => {
              const isSelected = selectedCell.cellId === cell.cellId;
              const isUnlocked = unlockedCells[cell.cellId];

              return (
                <motion.div
                  key={cell.cellId}
                  whileHover={{ scale: 1.008 }}
                  onClick={() => {
                    setSelectedCell(cell);
                    speakWarden(`Inspecting ${cell.cellId}: ${cell.title}. Threat Vector: ${cell.threatVector}`, 'curious', 3200);
                  }}
                  className={`relative overflow-hidden rounded-2xl border transition-all cursor-pointer p-4 ${
                    isSelected
                      ? 'bg-warden-surface border-warden-primary shadow-[0_0_25px_hsl(var(--warden-primary)/0.15)] ring-1 ring-warden-primary'
                      : 'bg-warden-surface/60 border-warden-border/60 hover:bg-warden-surface hover:border-warden-border'
                  }`}
                >
                  {/* Subtle Prison Bars Texture Overlay */}
                  {isJailViewActive && !isUnlocked && (
                    <div
                      className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-300 z-10"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          90deg,
                          transparent,
                          transparent 22px,
                          ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.45)'} 22px,
                          ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.45)'} 26px
                        )`,
                      }}
                    />
                  )}

                  <div className="relative z-20">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-warden-danger/20 text-warden-danger border border-warden-danger/30">
                          {cell.cellId}
                        </span>
                        <span className="text-xs text-warden-text/50 font-bold">{cell.block}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleJailCell(cell.cellId);
                          }}
                          className={`p-1.5 rounded-lg border text-[10px] font-mono transition-colors ${
                            isUnlocked
                              ? 'bg-warden-emerald/20 border-warden-emerald/50 text-warden-emerald'
                              : 'bg-warden-surface/80 border-warden-border text-warden-text/50 hover:text-warden-text'
                          }`}
                          title={isUnlocked ? 'Cell Unlocked' : 'Cell Locked Behind Bars'}
                        >
                          {isUnlocked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-warden-text mb-1">{cell.title}</h4>
                    <p className="text-xs text-warden-text/70 leading-relaxed line-clamp-2 mb-3">
                      {cell.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-warden-border/30 text-warden-text/50">
                      <span>Threat: <strong className="text-warden-text/80">{cell.threatVector}</strong></span>
                      <span className="text-warden-emerald font-bold">
                        ✓ {cell.neutralizedCount} Interceptions
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inmate Threat Dossier (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-mono font-bold text-warden-text/70 uppercase tracking-wider flex items-center gap-2">
            <FileCode className="h-3.5 w-3.5 text-warden-primary" />
            Threat Dossier — {selectedCell.cellId}
          </h3>

          <div className="rounded-2xl border border-warden-border/80 bg-warden-surface p-5 space-y-4 font-mono shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-warden-border/40">
              <div>
                <span className="text-[10px] text-warden-text/50 uppercase font-bold">Inmate Dossier</span>
                <p className="text-sm font-bold text-warden-text">{selectedCell.title}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-warden-danger/20 text-warden-danger border border-warden-danger/40">
                {selectedCell.riskLevel}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[11px] text-warden-text/50 font-bold uppercase">Deception Analysis</span>
              <p className="text-warden-text/80 leading-relaxed font-sans text-xs">
                {selectedCell.description}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[11px] text-warden-text/50 font-bold uppercase">Quarantine Defense Rule</span>
              <div className="p-3 rounded-xl bg-[#0c0b0a] border border-warden-border/50 text-warden-emerald text-[11px] leading-relaxed">
                {selectedCell.quarantineRule}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[11px] text-warden-text/50 font-bold uppercase">Deceptive DOM Payload</span>
              <div className="p-3 rounded-xl bg-[#0c0b0a] border border-warden-border/50 text-warden-primary text-[11px] overflow-x-auto whitespace-pre">
                <code>{selectedCell.sampleDom}</code>
              </div>
            </div>

            <div className="pt-2 border-t border-warden-border/30 flex items-center justify-between text-xs text-warden-text/50">
              <span>Neutralized: <strong className="text-warden-emerald">{selectedCell.neutralizedCount} Times</strong></span>
              <button
                onClick={() => speakWarden(`Deterministic rule for ${selectedCell.cellId} is active with 0 false positives.`, 'happy', 3000)}
                className="text-warden-primary hover:underline text-[11px] cursor-pointer"
              >
                Inspect Heuristic
              </button>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default TrapsPage;
