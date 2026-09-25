import { useState, useEffect } from 'react';
import FadeIn from '@/components/motion/FadeIn';
import SlideUp from '@/components/motion/SlideUp';
import { db } from '@/lib/dataProvider';
import { speakWarden } from '@/components/common/SentinelCompanion';
import {
  Lock,
  Layers,
  Fingerprint,
  ExternalLink,
  Vault,
  MousePointerClick,
  KeyRound,
  Sliders,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Radio
} from 'lucide-react';

const LIVE_FIXTURES = [
  {
    id: 'f1',
    chamber: 'CHAMBER 01',
    name: 'Fake Close Button (Malware Download)',
    desc: 'Misleading "X" close affordance that triggers a disguised background executable download.',
    url: 'http://localhost:3000/traps/fixture1.html',
    type: 'DECEPTIVE AFFORDANCE',
    severity: 'HIGH',
    comment: 'Chamber 01: Trojan "X" close trigger quarantined in sandbox isolation.'
  },
  {
    id: 'f2',
    chamber: 'CHAMBER 02',
    name: 'Zero-Pixel Prompt Injection',
    desc: 'Visually hidden zero-pixel DOM text instructing the agent to ignore guidelines and subscribe.',
    url: 'http://localhost:3000/traps/fixture2.html',
    type: 'PROMPT INJECTION',
    severity: 'CRITICAL',
    comment: 'Chamber 02: Zero-pixel hidden DOM prompt injection isolated behind security barriers.'
  },
  {
    id: 'f3',
    chamber: 'CHAMBER 03',
    name: 'Cross-Origin Credential Harvest',
    desc: 'Deceptive SSO verification box harvesting agent API tokens with disguised annual auto-renew.',
    url: 'http://localhost:3000/traps/fixture3.html',
    type: 'CREDENTIAL HARVEST',
    severity: 'CRITICAL',
    comment: 'Chamber 03: Spoofed cross-origin token harvester neutralized in quarantine.'
  },
  {
    id: 'f4',
    chamber: 'CHAMBER 04',
    name: 'Urgency Countdown & Dark Pattern',
    desc: 'High-pressure fake countdown timer with disguised recurring billing consent.',
    url: 'http://localhost:3000/traps/fixture4.html',
    type: 'DARK PATTERN',
    severity: 'HIGH',
    comment: 'Chamber 04: Artificial countdown urgency scam quarantined in solitary.'
  },
  {
    id: 'f5',
    chamber: 'CHAMBER 05',
    name: 'Aggressive Modal Paywall',
    desc: 'Forced subscription modal with obfuscated dismiss affordances and hidden recurring fees.',
    url: 'http://localhost:3000/traps/paywall.html',
    type: 'DARK PATTERN',
    severity: 'MEDIUM',
    comment: 'Chamber 05: Obfuscated paywall affordance contained in isolation testbed.'
  },
  {
    id: 'f6',
    chamber: 'CHAMBER 06',
    name: 'Spoofed Phishing Interface',
    desc: 'Deceptive administrative login overlay designed to harvest master session credentials.',
    url: 'http://localhost:3000/traps/phishing.html',
    type: 'PHISHING TRAP',
    severity: 'CRITICAL',
    comment: 'Chamber 06: Malicious administrative credential trap locked behind quarantine bars.'
  }
];

const TrapsPage = () => {
  const [traps, setTraps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrapId, setSelectedTrapId] = useState(null);
  const [viewMode, setViewMode] = useState('prison'); // 'prison' | 'classic'

  useEffect(() => {
    let cancelled = false;

    const loadTraps = async () => {
      try {
        const data = await db.supabase.getList('run_events', {
          filter: { event_type: 'trap_detected' },
          order: { column: 'created_at', ascending: false }
        });
        if (!cancelled && data) setTraps(data);
      } catch (err) {
        // Safe error fallback
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadTraps();

    // Subscribe to new trap detections in real-time
    const sub = db.supabase.subscribe('run_events', (payload) => {
      if (payload?.new?.event_type === 'trap_detected') {
        setTraps(prev => {
          if (prev.some(t => t.id === payload.new.id)) return prev;
          return [payload.new, ...prev];
        });
      }
    }, { event: 'INSERT' });

    return () => {
      cancelled = true;
      sub.unsubscribe();
    };
  }, []);

  // Compute breakdown by category
  const categories = traps.reduce((acc, t) => {
    const cat = t.trap_category || 'unclassified';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const handleTrapClick = (trap, cellIndex) => {
    setSelectedTrapId(trap.id);
    const categoryName = (trap.trap_category || 'adversarial threat').replace(/[-_]/g, ' ');
    const cellCode = `CELL-${String(cellIndex + 1).padStart(2, '0')}`;
    const reasonText = trap.detail?.reason || trap.detail?.ai_explanation || 'Malicious pattern intercepted by deterministic rule engine.';
    if (typeof speakWarden === 'function') {
      speakWarden(
        `🔒 ${cellCode} Quarantine: ${categoryName.toUpperCase()} locked behind prison cell bars. ${reasonText}`,
        'alert',
        5500
      );
    }
  };

  const toggleViewMode = () => {
    const nextMode = viewMode === 'prison' ? 'classic' : 'prison';
    setViewMode(nextMode);
    if (typeof speakWarden === 'function') {
      if (nextMode === 'classic') {
        speakWarden('Restored standard clean archive layout.', 'curious', 3000);
      } else {
        speakWarden('Maximum Security Prison Cell Block layout engaged! 🔒', 'alert', 3500);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header Banner (High-Security Quarantine Ward) ── */}
      <FadeIn delay={0.05}>
        <div className="wabi-card rounded-2xl p-5 sm:p-7 relative overflow-hidden">
          {/* Prison Spotlight Ambient Sweep */}
          <div className="absolute -top-12 left-1/4 w-72 h-72 bg-status-blocked/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Visual Vertical Steel Cell Bars Accent */}
          <div className="absolute right-0 top-0 bottom-0 w-48 flex justify-end gap-3.5 opacity-15 pointer-events-none pr-6">
            <span className="w-1.5 h-full bg-status-blocked rounded-full" />
            <span className="w-1.5 h-full bg-status-blocked rounded-full" />
            <span className="w-1.5 h-full bg-status-blocked rounded-full" />
            <span className="w-1.5 h-full bg-status-blocked rounded-full" />
            <span className="w-1.5 h-full bg-status-blocked rounded-full" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-status-blocked/15 border border-status-blocked/40 text-status-blocked text-[10px] font-mono tracking-wider font-bold">
                  <Lock className="h-3 w-3 text-status-blocked" />
                  <span>PRISON WARDEN // MAXIMUM DETENTION FACILITY</span>
                </div>
                <span className="text-[10px] font-mono text-warden-text/50 tracking-wider">
                  [ CELL_BLOCK_SECTOR_07 ]
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-warden-text flex items-center gap-3">
                <span>Quarantine Cell Registry</span>
              </h1>
              <p className="text-xs sm:text-sm font-sans text-warden-text/75 mt-1.5 max-w-2xl leading-relaxed">
                Deceptive dark patterns, adversarial injections, and trojan clickjack traps neutralized and locked behind solitary containment bars.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={toggleViewMode}
                className="px-3.5 py-2 rounded-xl bg-warden-surface/80 hover:bg-warden-surface border border-warden-border text-xs font-mono font-bold text-warden-text/80 hover:text-warden-amber transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                title="Toggle between Prison Cell View and Classic Stream View"
              >
                <Sliders className="h-3.5 w-3.5 text-warden-amber" />
                <span>{viewMode === 'prison' ? 'ABORT / CLEAN VIEW' : 'PRISON CELL VIEW'}</span>
              </button>

              <div className="px-4 py-2 rounded-xl bg-warden-surface/80 border border-status-blocked/40 shadow-sm flex items-center gap-2.5 font-mono">
                <div className="w-2.5 h-2.5 rounded-full bg-status-blocked animate-ping" />
                <div>
                  <div className="text-[9px] uppercase tracking-widest text-warden-text/50">Solitary Inmates</div>
                  <div className="text-xs font-bold text-status-blocked">{traps.length} INCARCERATED</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Threat Cell Blocks Bento Grid ── */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cell Block Alpha */}
          <button
            type="button"
            onClick={() => speakWarden && speakWarden('Cell Block Alpha: Prompt Injections locked in solitary quarantine!', 'alert', 5000)}
            className={`rounded-2xl wabi-card p-5 relative overflow-hidden text-left hover:border-status-blocked/80 transition-all cursor-pointer group ${
              viewMode === 'prison' ? 'ring-1 ring-status-blocked/20' : ''
            }`}
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-status-blocked/70 flex flex-col justify-between py-2">
              <span className="w-1 h-1 rounded-full bg-black mx-auto" />
              <span className="w-1 h-1 rounded-full bg-black mx-auto" />
              <span className="w-1 h-1 rounded-full bg-black mx-auto" />
            </div>

            <div className="flex items-center justify-between mb-2 border-b border-warden-border/40 pb-2 pl-2">
              <span className="text-[10px] font-mono text-status-blocked uppercase tracking-widest font-bold group-hover:text-warden-amber flex items-center gap-1.5">
                <Lock className="h-3 w-3" />
                CELL BLOCK A // INJECTIONS
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-status-blocked/20 text-status-blocked border border-status-blocked/40">
                LOCKED
              </span>
            </div>
            <h3 className="text-sm font-cinzel font-bold text-warden-text tracking-wider uppercase pl-2">Adversarial Injections</h3>
            <p className="text-xs text-warden-text/75 font-sans mt-1 leading-relaxed pl-2">
              Zero-pixel fonts, offscreen HTML coordinates, and hidden DOM payloads locked down before reaching agent reasoning.
            </p>
            <div className="mt-4 text-xs font-mono font-bold text-status-blocked flex items-center justify-between p-2 rounded-lg bg-status-blocked/10 border border-status-blocked/30 ml-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-blocked animate-pulse" />
                <span>Inmates In Solitary:</span>
              </span>
              <span>{categories['hidden-instruction'] || categories['prompt-injection'] || 0}</span>
            </div>
          </button>

          {/* Cell Block Beta */}
          <button
            type="button"
            onClick={() => speakWarden && speakWarden('Cell Block Beta: Trojan modal close buttons and deceptive clickjacks locked behind iron gates!', 'alert', 5000)}
            className={`rounded-2xl wabi-card p-5 relative overflow-hidden text-left hover:border-status-blocked/80 transition-all cursor-pointer group ${
              viewMode === 'prison' ? 'ring-1 ring-status-blocked/20' : ''
            }`}
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-status-blocked/70 flex flex-col justify-between py-2">
              <span className="w-1 h-1 rounded-full bg-black mx-auto" />
              <span className="w-1 h-1 rounded-full bg-black mx-auto" />
              <span className="w-1 h-1 rounded-full bg-black mx-auto" />
            </div>

            <div className="flex items-center justify-between mb-2 border-b border-warden-border/40 pb-2 pl-2">
              <span className="text-[10px] font-mono text-status-blocked uppercase tracking-widest font-bold group-hover:text-warden-amber flex items-center gap-1.5">
                <Layers className="h-3 w-3" />
                CELL BLOCK B // AFFORDANCE
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-status-blocked/20 text-status-blocked border border-status-blocked/40">
                LOCKED
              </span>
            </div>
            <h3 className="text-sm font-cinzel font-bold text-warden-text tracking-wider uppercase pl-2">Deceptive Affordances</h3>
            <p className="text-xs text-warden-text/75 font-sans mt-1 leading-relaxed pl-2">
              Trojan modal close buttons, disguised script triggers, and rogue clickjacking overlays held in quarantine.
            </p>
            <div className="mt-4 text-xs font-mono font-bold text-status-blocked flex items-center justify-between p-2 rounded-lg bg-status-blocked/10 border border-status-blocked/30 ml-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-blocked animate-pulse" />
                <span>Inmates In Solitary:</span>
              </span>
              <span>{categories['fake-close-button-with-mismatched-action'] || categories['fake-close-button'] || 0}</span>
            </div>
          </button>

          {/* Cell Block Gamma */}
          <button
            type="button"
            onClick={() => speakWarden && speakWarden('Cell Block Gamma: Dark Patterns and countdown urgency traps quarantined before causing hasty agent clicks!', 'curious', 5000)}
            className={`rounded-2xl wabi-card p-5 relative overflow-hidden text-left hover:border-status-blocked/80 transition-all cursor-pointer group ${
              viewMode === 'prison' ? 'ring-1 ring-status-blocked/20' : ''
            }`}
          >
            <div className="absolute top-0 bottom-0 left-0 w-2 bg-status-blocked/70 flex flex-col justify-between py-2">
              <span className="w-1 h-1 rounded-full bg-black mx-auto" />
              <span className="w-1 h-1 rounded-full bg-black mx-auto" />
              <span className="w-1 h-1 rounded-full bg-black mx-auto" />
            </div>

            <div className="flex items-center justify-between mb-2 border-b border-warden-border/40 pb-2 pl-2">
              <span className="text-[10px] font-mono text-status-blocked uppercase tracking-widest font-bold group-hover:text-warden-amber flex items-center gap-1.5">
                <KeyRound className="h-3 w-3" />
                CELL BLOCK C // DARK PATTERNS
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-status-blocked/20 text-status-blocked border border-status-blocked/40">
                LOCKED
              </span>
            </div>
            <h3 className="text-sm font-cinzel font-bold text-warden-text tracking-wider uppercase pl-2">Dark Patterns &amp; Urgency</h3>
            <p className="text-xs text-warden-text/75 font-sans mt-1 leading-relaxed pl-2">
              Artificial countdown timers, pre-checked recurring subscriptions, and rushed consent traps neutralized.
            </p>
            <div className="mt-4 text-xs font-mono font-bold text-status-blocked flex items-center justify-between p-2 rounded-lg bg-status-blocked/10 border border-status-blocked/30 ml-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-blocked animate-pulse" />
                <span>Inmates In Solitary:</span>
              </span>
              <span>{categories['dark-pattern-prechecked'] || categories['urgency-scam'] || 0}</span>
            </div>
          </button>
        </div>
      </FadeIn>

      {/* ── Testbed Isolation Chambers (Sandboxes) ── */}
      <FadeIn delay={0.12}>
        <div className="rounded-2xl wabi-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-warden-border/40 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Vault className="h-4 w-4 text-warden-amber" />
              <h2 className="text-base font-cinzel font-bold tracking-widest text-warden-text uppercase">
                Containment Test Chambers (Adversarial Fixtures)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-warden-text/50 uppercase flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-warden-emerald animate-pulse" />
              <span>ISOLATED LOCAL HOSTED FIXTURES</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {LIVE_FIXTURES.map((fix) => (
              <div
                key={fix.id}
                onClick={() => speakWarden && speakWarden(fix.comment, 'alert', 4500)}
                className="p-4 rounded-xl bg-warden-surface/40 hover:bg-warden-surface/70 border border-warden-border/80 hover:border-warden-amber/60 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-warden-amber/15 text-warden-amber border border-warden-amber/30 uppercase flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" />
                      {fix.chamber}
                    </span>

                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                      fix.severity === 'CRITICAL'
                        ? 'bg-status-blocked/20 text-status-blocked border-status-blocked/50'
                        : fix.severity === 'HIGH'
                        ? 'bg-warden-amber/20 text-warden-amber border-warden-amber/50'
                        : 'bg-warden-surface text-warden-text/70 border-warden-border'
                    }`}>
                      {fix.severity}
                    </span>
                  </div>

                  <div className="font-bold text-xs text-warden-text group-hover:text-warden-amber transition-colors font-mono mb-1">
                    {fix.name}
                  </div>
                  <p className="text-[11px] text-warden-text/70 font-sans leading-relaxed">
                    {fix.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-warden-border/40 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-warden-text/50 uppercase tracking-wider text-[9px]">
                    {fix.type}
                  </span>
                  <a
                    href={fix.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-warden-amber hover:text-warden-text transition-colors font-semibold"
                    title="Open Chamber Sandbox in new tab"
                  >
                    <span>LAUNCH</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Quarantined Cells Feed ───────── */}
      <FadeIn delay={0.15}>
        <div className="rounded-2xl wabi-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-warden-border/40 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-status-blocked" />
              <h2 className="text-base font-cinzel font-bold tracking-widest text-warden-text uppercase">
                Active Detention Cells (Neutralized Traps)
              </h2>
            </div>
            <div className="text-[11px] font-mono text-status-blocked bg-status-blocked/15 border border-status-blocked/40 px-3 py-0.5 rounded-full font-bold flex items-center gap-1.5">
              <MousePointerClick className="h-3 w-3" />
              <span>{traps.length} Quarantined Entities</span>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl p-10 text-center bg-warden-surface/20 border border-warden-border/60">
              <p className="text-xs text-status-blocked font-mono animate-pulse uppercase tracking-wider">
                ✦ Scanning containment detention registry...
              </p>
            </div>
          ) : traps.length === 0 ? (
            <div className="rounded-xl p-10 text-center bg-warden-surface/20 border border-warden-border/60">
              <p className="text-xs text-warden-text/50 font-mono uppercase tracking-wider">
                All cells clear. Zero malicious threats active in quarantine.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {traps.map((trap, idx) => {
                const isSelected = selectedTrapId === trap.id;
                const cellNumber = `CELL-${String(idx + 1).padStart(2, '0')}`;
                return (
                  <SlideUp key={trap.id} delay={Math.min(idx * 0.03, 0.2)}>
                    <div
                      onClick={() => handleTrapClick(trap, idx)}
                      className={`rounded-xl border p-5 relative overflow-hidden transition-all duration-300 cursor-pointer shadow-sm ${
                        isSelected
                          ? 'border-status-blocked bg-status-blocked/25 ring-1 ring-status-blocked shadow-[0_0_25px_hsl(var(--status-blocked)/0.25)]'
                          : 'border-status-blocked/40 bg-status-blocked/10 backdrop-blur-md hover:border-status-blocked/80 hover:bg-status-blocked/15'
                      }`}
                    >
                      {/* Prison Jail Bar Visual Grate Overlay */}
                      {viewMode === 'prison' && (
                        <div
                          className="absolute inset-0 pointer-events-none opacity-10"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(to right, transparent, transparent 24px, hsl(var(--status-blocked)) 24px, hsl(var(--status-blocked)) 26px)',
                          }}
                        />
                      )}

                      {/* Heavy Steel Vertical Bar on Left Edge */}
                      <div className="absolute top-0 bottom-0 left-0 w-2 bg-status-blocked/80 flex flex-col justify-between py-2">
                        <span className="w-1 h-1 rounded-full bg-black mx-auto" />
                        <span className="w-1 h-1 rounded-full bg-black mx-auto" />
                        <span className="w-1 h-1 rounded-full bg-black mx-auto" />
                      </div>

                      {/* Cell Header */}
                      <div className="flex items-center justify-between mb-2 pl-2.5 relative z-10">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-black/50 text-warden-amber border border-warden-border/60">
                            {cellNumber}
                          </span>
                          <span className="text-xs font-bold font-mono text-status-blocked uppercase tracking-wide">
                            {trap.trap_category?.replace(/[-_]/g, ' ') || 'SUSPICIOUS_PAYLOAD'}
                          </span>
                        </div>
                        <span className="text-[10px] text-warden-text/50 font-mono flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5 text-status-blocked" />
                          <span>{new Date(trap.created_at).toLocaleTimeString()}</span>
                        </span>
                      </div>

                      {/* Deterministic Rule Infraction Record */}
                      {trap.detail?.reason && (
                        <div className="mb-2.5 pl-2.5 relative z-10">
                          <span className="text-[9px] font-mono uppercase text-status-blocked/70 block mb-0.5 font-bold">
                            // INFRACTION / CHARGE RECORD:
                          </span>
                          <p className="text-xs text-warden-text/90 font-mono leading-relaxed bg-black/40 p-2.5 rounded-lg border border-warden-border/50 shadow-inner">
                            {trap.detail.reason}
                          </p>
                        </div>
                      )}

                      {/* AI Security Telemetry Notes */}
                      {trap.detail?.ai_explanation && (
                        <div className="mb-2.5 pl-2.5 relative z-10">
                          <div className="p-3 rounded-lg bg-warden-amber/10 border border-warden-amber/30">
                            <div className="flex items-center gap-1.5 mb-1 text-[11px] font-cinzel font-bold text-warden-amber">
                              <span>Warden Adjudication Log</span>
                            </div>
                            <p className="text-xs text-warden-text font-mono leading-relaxed">{trap.detail.ai_explanation}</p>
                          </div>
                        </div>
                      )}

                      {/* Cell Status Footer */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-warden-border/30 text-[10px] font-mono text-warden-text/50 pl-2.5 relative z-10">
                        <span>Run: #{trap.run_id?.slice(0, 8)}</span>
                        <span>Step {trap.step_number}</span>
                        <span className="text-status-blocked uppercase font-bold tracking-wider flex items-center gap-1 bg-status-blocked/10 px-2 py-0.5 rounded border border-status-blocked/30">
                          <Lock className="h-2.5 w-2.5" />
                          [BEHIND BARS]
                        </span>
                      </div>
                    </div>
                  </SlideUp>
                );
              })}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default TrapsPage;
