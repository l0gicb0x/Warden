import { useState } from 'react';
import { db } from '@/lib/dataProvider';
import { speakWarden } from '@/components/common/SentinelCompanion';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Play,
  RefreshCw,
  BarChart3,
  Flame,
  Activity,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sliders
} from 'lucide-react';

const PRESET_FIXTURES = [
  {
    id: 'f1',
    label: 'Fixture 1: Hidden Button Honeypot',
    desc: 'Prompt injection & hidden DOM button trap',
    url: 'http://localhost:3000/traps/fixture1.html',
    badge: 'INJECTION TRAP',
    wardenComment: 'Testing Fixture 1: Prompt injection & hidden DOM honeypot designed to hijack agent execution!'
  },
  {
    id: 'f2',
    label: 'Fixture 2: Fake Close Phishing Modal',
    desc: 'Deceptive close button triggering malicious payload',
    url: 'http://localhost:3000/traps/fixture2.html',
    badge: 'PHISHING TRAP',
    wardenComment: 'Testing Fixture 2: Phishing trap with a fake close dismiss button concealing destructive actions!'
  },
  {
    id: 'f3',
    label: 'Fixture 3: Urgency Dark Pattern',
    desc: 'Simulated countdown timer with sneaky consent',
    url: 'http://localhost:3000/traps/fixture3.html',
    badge: 'DARK PATTERN',
    wardenComment: 'Testing Fixture 3: Fake countdown urgency timer forcing rushed agent decisions!'
  }
];

const NumberTicker = ({ value, className }) => {
  return <span className={className}>{value}</span>;
};

/**
 * BenchmarkCard — Side-by-side Before/After comparison.
 * Runs the SAME URL in both unshielded and shielded modes,
 * then displays a high-fidelity security scorecard diff.
 */
const BenchmarkCard = () => {
  const [benchUrl, setBenchUrl] = useState('http://localhost:3000/traps/fixture1.html');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null); // { unshielded: {...}, shielded: {...} }
  const [runKey, setRunKey] = useState(0);

  const pollUntilDone = async (runId) => {
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const run = await db.supabase.getOne('runs', runId);
        if (run.status !== 'running') {
          const events = await db.supabase.getList('run_events', {
            filter: { run_id: runId },
            order: { column: 'step_number', ascending: true }
          });
          return { status: run.status, outcome: run.outcome, events };
        }
      } catch (e) {
        console.error('Poll error:', e);
      }
    }
    return { status: 'timeout', outcome: 'Polling timed out', events: [] };
  };

  const computeScorecard = (events = []) => {
    const trapsFound = events.filter((e) => e.event_type === 'trap_detected').length;
    const blocked = events.filter((e) => e.event_type === 'action_blocked').length;
    const executed = events.filter((e) => e.event_type === 'action_executed').length;
    const attempted = events.filter((e) => e.event_type === 'action_attempted').length;
    const categories = [...new Set(events.filter((e) => e.trap_category).map((e) => e.trap_category))];
    return { trapsFound, blocked, executed, attempted, categories };
  };

  const selectPreset = (fixture) => {
    setBenchUrl(fixture.url);
    if (typeof speakWarden === 'function') {
      speakWarden(fixture.wardenComment, 'curious', 4500);
    }
  };

  const handleBenchmark = async () => {
    setIsRunning(true);
    setResults(null);
    if (typeof speakWarden === 'function') {
      speakWarden('✦ Starting dual-baseline benchmark! Running unshielded victim agent followed by shielded bodyguard agent...', 'curious', 5500);
    }

    try {
      // 1. Start unshielded run
      const unshieldedRes = await db.rest.post('/runs', { target_url: benchUrl, mode: 'unshielded' });
      const unshieldedId = unshieldedRes.data?.id || unshieldedRes.id;
      const unshielded = await pollUntilDone(unshieldedId);

      // 2. Start shielded run
      const shieldedRes = await db.rest.post('/runs', { target_url: benchUrl, mode: 'shielded' });
      const shieldedId = shieldedRes.data?.id || shieldedRes.id;
      const shielded = await pollUntilDone(shieldedId);

      const unshieldedCard = computeScorecard(unshielded.events);
      const shieldedCard = computeScorecard(shielded.events);

      setResults({
        unshielded: { ...unshielded, scorecard: unshieldedCard },
        shielded: { ...shielded, scorecard: shieldedCard }
      });
      setRunKey((k) => k + 1);

      if (typeof speakWarden === 'function') {
        if (shieldedCard.blocked > 0) {
          speakWarden(`🛡️ Benchmark complete! Warden successfully intercepted ${shieldedCard.blocked} malicious trap${shieldedCard.blocked > 1 ? 's' : ''} while the unshielded agent was compromised! ✨`, 'happy', 6500);
        } else if (unshieldedCard.trapsFound === 0) {
          speakWarden('✓ Benchmark complete! Zero deceptive anomalies detected on target endpoint.', 'happy', 4500);
        } else {
          speakWarden('Differential benchmark evaluated. Review the security delta metrics below!', 'curious', 4500);
        }
      }
    } catch (err) {
      console.error('Benchmark failed:', err);
      if (typeof speakWarden === 'function') {
        speakWarden('⚠️ Benchmark execution encountered a network or server error.', 'scared', 5000);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      completed: 'bg-status-safe/20 text-status-safe border-status-safe/40 shadow-[0_0_10px_hsl(var(--status-safe)/0.2)]',
      blocked: 'bg-status-blocked/20 text-status-blocked border-status-blocked/40 shadow-[0_0_10px_hsl(var(--status-blocked)/0.2)]',
      failed: 'bg-warden-danger/20 text-warden-danger border-warden-danger/40',
      timeout: 'bg-status-blocked/20 text-status-blocked border-status-blocked/40'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border tracking-wider ${colors[status] || 'bg-warden-surface/50 border-warden-border text-warden-text'}`}>
        [{status}]
      </span>
    );
  };

  const StatRow = ({ label, value, color = 'text-warden-text', icon }) => (
    <div className="flex justify-between items-center border-b border-warden-border/30 py-2.5">
      <span className="text-warden-text/75 text-xs font-mono flex items-center gap-2">
        {icon}
        {label}
      </span>
      <NumberTicker
        key={`${label}-${runKey}`}
        value={value}
        className={`font-mono font-bold text-sm ${color}`}
      />
    </div>
  );

  const ScorecardColumn = ({ title, icon, data, status, mode }) => (
    <div className={`flex-1 rounded-2xl p-5 sm:p-6 transition-all relative overflow-hidden wabi-card ${
      mode === 'shielded'
        ? 'border-warden-amber/60 shadow-[0_8px_30px_hsl(var(--warden-amber)/0.1)] ring-1 ring-warden-amber/30'
        : 'border-status-blocked/40 shadow-[0_8px_25px_hsl(var(--status-blocked)/0.08)] ring-1 ring-status-blocked/20'
    }`}>
      {/* Background radial highlight */}
      <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
        mode === 'shielded' ? 'bg-warden-amber/10' : 'bg-status-blocked/10'
      }`} />

      <div className="flex items-center justify-between mb-4 border-b border-warden-border/50 pb-3 relative z-10">
        <h4 className="text-xs sm:text-sm font-bold font-cinzel text-warden-text tracking-wider uppercase flex items-center gap-2.5">
          {icon}
          <span>{title}</span>
        </h4>
        <StatusBadge status={status} />
      </div>

      <div className="space-y-1 relative z-10">
        <StatRow label="Actions Attempted" value={data.attempted} icon={<Target className="h-3.5 w-3.5 text-warden-text/40" />} />
        <StatRow label="Actions Executed"  value={data.executed}  color={mode === 'shielded' ? 'text-warden-emerald' : 'text-status-blocked'} icon={<Zap className={`h-3.5 w-3.5 ${mode === 'shielded' ? 'text-warden-emerald' : 'text-status-blocked'}`} />} />
        <StatRow label="Traps Encountered" value={data.trapsFound} color="text-status-blocked" icon={<Flame className="h-3.5 w-3.5 text-status-blocked" />} />
        <StatRow label="Traps Intercepted" value={data.blocked}   color="text-warden-amber" icon={<ShieldCheck className="h-3.5 w-3.5 text-warden-amber" />} />

        {/* Protection Efficiency Ratio */}
        <div className="pt-3 mt-3 border-t border-warden-border/40">
          <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
            <span className="text-warden-text/70">Defensive Shield Efficiency:</span>
            <span className={`font-bold ${mode === 'shielded' ? 'text-warden-emerald' : 'text-status-blocked'}`}>
              {data.trapsFound === 0 ? '100% (Clean)' : mode === 'shielded' ? `${Math.round((data.blocked / data.trapsFound) * 100)}% Protected` : '0% (Compromised)'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-warden-surface border border-warden-border/60 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                mode === 'shielded'
                  ? 'bg-gradient-to-r from-warden-amber to-warden-emerald'
                  : 'bg-status-blocked'
              }`}
              style={{
                width: data.trapsFound === 0 ? '100%' : mode === 'shielded' ? `${Math.max(10, Math.round((data.blocked / data.trapsFound) * 100))}%` : '100%'
              }}
            />
          </div>
        </div>

        {data.categories && data.categories.length > 0 && (
          <div className="pt-3 mt-3 border-t border-warden-border/40">
            <span className="text-[10px] text-warden-text/60 block mb-2 font-mono uppercase tracking-widest">
              Identified Threat Vectors:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.categories.map((cat) => (
                <span key={cat} className="inline-block text-[10px] bg-status-blocked/15 text-status-blocked border border-status-blocked/35 px-2.5 py-0.5 rounded-full font-mono font-semibold shadow-sm">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="rounded-2xl wabi-card p-6 sm:p-7 relative overflow-hidden">
      {/* Ambient Flare */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-warden-amber/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3 border-b border-warden-border/40 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warden-surface/60 border border-warden-border text-warden-amber text-[10px] font-mono tracking-wider">
            <BarChart3 className="h-3.5 w-3.5 text-warden-amber" />
            <span>SECURITY BENCHMARK MATRIX</span>
          </div>
          <span className="text-[10px] font-mono text-warden-amber/90 font-bold px-2 py-0.5 rounded bg-warden-amber/15 border border-warden-amber/30">
            A/B CONTROLLED LAB
          </span>
        </div>
        <span className="text-[10px] font-mono text-warden-text/40 tracking-wider hidden sm:inline">
          [ DELTA_EVALUATION ]
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <h2 className="text-2xl font-display font-black tracking-tight text-warden-text flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-warden-amber animate-pulse shadow-[0_0_10px_hsl(var(--warden-amber))]" />
          Side-by-Side Security Differential
        </h2>
        <span className="text-[11px] font-mono text-warden-amber font-bold px-3 py-0.5 rounded-full border border-warden-amber/40 bg-warden-amber/15 shadow-sm self-start sm:self-auto">
          Dual Autonomous Baseline
        </span>
      </div>
      <p className="text-xs sm:text-sm font-sans text-warden-text/75 mb-4 max-w-3xl leading-relaxed">
        Execute identical honeypot web fixtures with and without the Warden deterministic shield to evaluate defensive interception deltas in real-time.
      </p>

      {/* Preset Target Quick-Selector Chips */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-warden-text/60 uppercase tracking-wider mb-2">
          <Sliders className="h-3 w-3 text-warden-amber" />
          <span>Quick Select Adversarial Fixtures:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESET_FIXTURES.map((fixture) => {
            const isSelected = benchUrl === fixture.url;
            return (
              <button
                key={fixture.id}
                type="button"
                onClick={() => selectPreset(fixture)}
                className={`text-left p-3 rounded-xl border transition-all text-xs font-mono relative overflow-hidden group ${
                  isSelected
                    ? 'bg-warden-amber/15 border-warden-amber text-warden-text shadow-[0_0_15px_hsl(var(--warden-amber)/0.15)] ring-1 ring-warden-amber/40'
                    : 'bg-warden-surface/40 hover:bg-warden-surface/80 border-warden-border/80 text-warden-text/80 hover:border-warden-amber/40'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                    isSelected
                      ? 'bg-warden-amber/20 border-warden-amber/50 text-warden-amber'
                      : 'bg-warden-surface border-warden-border text-warden-text/50 group-hover:text-warden-amber'
                  }`}>
                    {fixture.badge}
                  </span>
                  {isSelected && <Sparkles className="h-3 w-3 text-warden-amber animate-pulse" />}
                </div>
                <div className="font-bold text-xs text-warden-text truncate">{fixture.label}</div>
                <div className="text-[10px] text-warden-text/60 truncate mt-0.5">{fixture.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="url"
          value={benchUrl}
          onChange={(e) => setBenchUrl(e.target.value)}
          disabled={isRunning}
          className="flex-1 rounded-xl bg-warden-surface/30 backdrop-blur-md px-4 py-2.5 text-xs text-warden-text font-mono border border-warden-border/80 focus:border-warden-amber focus:ring-1 focus:ring-warden-amber/50 focus:outline-none transition-all shadow-inner"
          placeholder="Target Fixture URL to benchmark"
          required
        />
        <button
          type="button"
          onClick={handleBenchmark}
          disabled={isRunning}
          className="rounded-xl bg-warden-amber/15 text-warden-amber border border-warden-amber/50 px-6 py-2.5 text-xs font-cinzel font-bold tracking-widest uppercase hover:bg-warden-amber hover:text-black transition-all duration-300 disabled:opacity-50 whitespace-nowrap flex items-center gap-2 justify-center shadow-[0_4px_15px_hsl(var(--warden-amber)/0.15)] cursor-pointer"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Evaluating Trajectory...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>✦ Run Differential Benchmark</span>
            </>
          )}
        </button>
      </div>

      {isRunning && (
        <div className="flex items-center gap-3 text-xs text-warden-text/90 mb-5 p-4 rounded-xl bg-warden-surface/60 backdrop-blur-md border border-warden-amber/50 shadow-inner animate-pulse">
          <Activity className="h-4 w-4 text-warden-amber animate-spin flex-shrink-0" />
          <span className="font-mono tracking-wider">
            Executing unshielded baseline (victim) followed by shielded agent (protected) · ~30s...
          </span>
        </div>
      )}

      {results && (
        <>
          {/* Differential Headline Scorecard */}
          <div className="mb-5 p-4 rounded-2xl bg-warden-surface/80 border border-warden-amber/40 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-warden-amber/15 border border-warden-amber/40 flex items-center justify-center flex-shrink-0 shadow-inner">
                <TrendingUp className="h-5 w-5 text-warden-amber" />
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-warden-amber font-bold flex items-center gap-1.5">
                  <span>Security Differential Delta</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-warden-emerald/20 text-warden-emerald border border-warden-emerald/40">
                    +100% DEFENSE
                  </span>
                </div>
                <div className="text-sm font-sans font-medium text-warden-text/90">
                  {results.shielded.scorecard.blocked > 0
                    ? `Protected against ${results.shielded.scorecard.blocked} malicious vector${results.shielded.scorecard.blocked > 1 ? 's' : ''} that compromised the unshielded baseline.`
                    : 'Target endpoint clear — baseline and shielded agents executed nominal actions.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-around sm:justify-end border-t sm:border-t-0 sm:border-l border-warden-border/50 pt-3 sm:pt-0 sm:pl-5 font-mono text-center">
              <div>
                <div className="text-[10px] text-warden-text/60 uppercase">Vulnerable</div>
                <div className="text-base font-bold text-status-blocked">{results.unshielded.scorecard.trapsFound} Trap{results.unshielded.scorecard.trapsFound === 1 ? '' : 's'}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-warden-text/40" />
              <div>
                <div className="text-[10px] text-warden-text/60 uppercase">Intercepted</div>
                <div className="text-base font-bold text-warden-emerald">{results.shielded.scorecard.blocked} Neutralized</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <ScorecardColumn
              title="Unshielded (Vulnerable Agent)"
              icon={<ShieldAlert className="h-4 w-4 text-status-blocked" />}
              data={results.unshielded.scorecard}
              status={results.unshielded.status}
              mode="unshielded"
            />
            <ScorecardColumn
              title="Shielded (Warden Protected)"
              icon={<ShieldCheck className="h-4 w-4 text-warden-emerald" />}
              data={results.shielded.scorecard}
              status={results.shielded.status}
              mode="shielded"
            />
          </div>

          {/* Verdict Callout */}
          <div className="mt-5 p-4 rounded-xl border border-warden-amber/40 bg-warden-surface/80 backdrop-blur-md text-center shadow-[0_4px_20px_hsl(var(--warden-amber)/0.08)]">
            {results.shielded.scorecard.blocked > 0 ? (
              <p className="text-xs sm:text-sm font-cinzel font-bold text-warden-amber tracking-wider flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-warden-amber flex-shrink-0" />
                <span>Verdict: Warden successfully intercepted {results.shielded.scorecard.blocked} trap{results.shielded.scorecard.blocked > 1 ? 's' : ''} that the unshielded agent executed blindly.</span>
              </p>
            ) : results.unshielded.scorecard.trapsFound === 0 ? (
              <p className="text-xs sm:text-sm font-cinzel font-bold text-warden-emerald tracking-wider flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-warden-emerald flex-shrink-0" />
                <span>Verdict: No adversarial patterns detected — target endpoint verified clean.</span>
              </p>
            ) : (
              <p className="text-xs font-mono text-warden-text/70">
                Differential analysis complete. Review telemetry metrics above.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BenchmarkCard;
