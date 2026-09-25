import { useState, useEffect } from 'react';
import FadeIn from '@/components/motion/FadeIn';
import SlideUp from '@/components/motion/SlideUp';
import { db } from '@/lib/dataProvider';
import { speakWarden } from '@/components/common/SentinelCompanion';
import {
  Activity,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Radio,
  Sparkles,
  MousePointerClick
} from 'lucide-react';

const RunsPage = () => {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRunId, setSelectedRunId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadRuns = async () => {
      try {
        const data = await db.supabase.getList('runs', {
          order: { column: 'started_at', ascending: false }
        });
        if (!cancelled) setRuns(data);
      } catch (err) {
        console.error('Failed to load runs:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadRuns();

    // Subscribe to new runs
    const sub = db.supabase.subscribe('runs', (payload) => {
      if (payload.eventType === 'INSERT') {
        setRuns(prev => [payload.new, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setRuns(prev => prev.map(r => r.id === payload.new.id ? payload.new : r));
      }
    });

    return () => {
      cancelled = true;
      sub.unsubscribe();
    };
  }, []);

  const totalRuns = runs.length;
  const shieldedRuns = runs.filter(r => r.mode === 'shielded').length;
  const blockedCount = runs.filter(r => r.status === 'blocked').length;
  const completedCount = runs.filter(r => r.status === 'completed').length;

  const handleRunClick = (run) => {
    setSelectedRunId(run.id);
    const shortId = run.id.slice(0, 6).toUpperCase();
    if (typeof speakWarden === 'function') {
      if (run.status === 'blocked') {
        speakWarden(
          `Session #${shortId}: ${run.mode.toUpperCase()} mode intercepted a deceptive trap on ${run.target_url}! Outcome: ${run.outcome || 'Blocked'}`,
          'alert',
          5000
        );
      } else if (run.status === 'completed') {
        speakWarden(
          `Session #${shortId}: Clean run completed safely on ${run.target_url}. Outcome: ${run.outcome || 'Executed nominal trajectory'}`,
          'happy',
          4500
        );
      } else if (run.status === 'running') {
        speakWarden(
          `Session #${shortId}: Currently executing active mission with real-time telemetry streaming!`,
          'curious',
          4500
        );
      } else {
        speakWarden(
          `Session #${shortId}: [${run.status.toUpperCase()}] status on target ${run.target_url}`,
          'curious',
          4000
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header Banner ── */}
      <FadeIn delay={0.05}>
        <div className="wabi-card rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warden-surface/60 border border-warden-border text-warden-amber text-[10px] font-mono tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-warden-amber" />
                  <span>TELEMETRY ARCHIVE</span>
                </div>
                <span className="text-[10px] font-mono text-warden-text/40 tracking-wider">
                  [ HISTORICAL_INSPECTION ]
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-warden-text">
                Session Telemetry &amp; Runs
              </h1>
              <p className="text-xs sm:text-sm font-sans text-warden-text/75 mt-1 max-w-2xl leading-relaxed">
                Historical ledger of autonomous agent missions, defensive interventions, and deterministic threat neutralizations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-warden-amber font-bold px-3 py-1 rounded-full bg-warden-amber/15 border border-warden-amber/40 shadow-sm flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-warden-amber animate-pulse" />
                LIVE REALTIME SYNC
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Top Bento Metric Strip ──────────── */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => speakWarden && speakWarden(`Archived ${totalRuns} total recorded agent sessions in the ledger.`, 'curious', 3000)}
            className="rounded-2xl wabi-card p-4 relative overflow-hidden text-left hover:border-warden-amber/50 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-warden-text/50 uppercase tracking-widest font-semibold group-hover:text-warden-amber">Total Sessions</span>
              <Activity className="h-4 w-4 text-warden-amber" />
            </div>
            <div className="text-3xl font-display font-black text-warden-text">{totalRuns}</div>
            <div className="text-[10px] font-mono text-warden-text/60 uppercase tracking-wider mt-0.5">Recorded Missions</div>
          </button>

          <button
            type="button"
            onClick={() => speakWarden && speakWarden(`${shieldedRuns} sessions guarded with Warden deterministic shield defense!`, 'happy', 3000)}
            className="rounded-2xl wabi-card p-4 relative overflow-hidden text-left hover:border-warden-amber/50 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-warden-amber uppercase tracking-widest font-semibold">Shielded Runs</span>
              <ShieldCheck className="h-4 w-4 text-warden-amber" />
            </div>
            <div className="text-3xl font-display font-black text-warden-amber">{shieldedRuns}</div>
            <div className="text-[10px] font-mono text-warden-text/60 uppercase tracking-wider mt-0.5">Protected Agents</div>
          </button>

          <button
            type="button"
            onClick={() => speakWarden && speakWarden(`${blockedCount} deceptive honeypots and dark patterns intercepted in the wild!`, 'alert', 3000)}
            className="rounded-2xl wabi-card p-4 relative overflow-hidden text-left hover:border-status-blocked/50 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-status-blocked uppercase tracking-widest font-semibold">Threats Blocked</span>
              <ShieldAlert className="h-4 w-4 text-status-blocked" />
            </div>
            <div className="text-3xl font-display font-black text-status-blocked">{blockedCount}</div>
            <div className="text-[10px] font-mono text-warden-text/60 uppercase tracking-wider mt-0.5">Traps Neutralized</div>
          </button>

          <button
            type="button"
            onClick={() => speakWarden && speakWarden(`${completedCount} clean trajectories executed without adversarial hindrance.`, 'happy', 3000)}
            className="rounded-2xl wabi-card p-4 relative overflow-hidden text-left hover:border-warden-emerald/50 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-warden-emerald uppercase tracking-widest font-semibold">Clean Executions</span>
              <CheckCircle2 className="h-4 w-4 text-warden-emerald" />
            </div>
            <div className="text-3xl font-display font-black text-warden-emerald">{completedCount}</div>
            <div className="text-[10px] font-mono text-warden-text/60 uppercase tracking-wider mt-0.5">Safe Trajectories</div>
          </button>
        </div>
      </FadeIn>

      {/* ── Runs List Section ───────────── */}
      <FadeIn delay={0.15}>
        <div className="rounded-2xl wabi-card p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-warden-border/40 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-warden-amber" />
              <h2 className="text-base font-cinzel font-bold tracking-widest text-warden-text uppercase">Session Execution Archive</h2>
            </div>
            <div className="text-[11px] font-mono text-warden-amber bg-warden-amber/15 border border-warden-amber/40 px-3 py-0.5 rounded-full font-bold flex items-center gap-1.5">
              <MousePointerClick className="h-3 w-3" />
              <span>{runs.length} Sessions (Click to Inspect)</span>
            </div>
          </div>

          {loading ? (
            <div className="rounded-xl p-10 text-center bg-warden-surface/20 border border-warden-border/60">
              <p className="text-xs text-warden-amber font-mono animate-pulse uppercase tracking-wider">
                ✦ Retrieving session telemetry from Supabase Realtime...
              </p>
            </div>
          ) : runs.length === 0 ? (
            <div className="rounded-xl p-10 text-center bg-warden-surface/20 border border-warden-border/60">
              <p className="text-xs text-warden-text/50 font-mono uppercase tracking-wider">
                No session logs recorded yet. Dispatch a run from the Live Console.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {runs.map((run, idx) => {
                const isSelected = selectedRunId === run.id;
                return (
                  <SlideUp key={run.id} delay={Math.min(idx * 0.04, 0.25)}>
                    <div
                      onClick={() => handleRunClick(run)}
                      className={`rounded-xl border p-4 transition-all duration-300 cursor-pointer group shadow-sm ${
                        isSelected
                          ? 'border-warden-amber bg-warden-amber/15 ring-1 ring-warden-amber/50 shadow-[0_0_20px_hsl(var(--warden-amber)/0.15)]'
                          : 'border-warden-border/70 bg-warden-surface/40 backdrop-blur-md hover:border-warden-amber/60 hover:bg-warden-surface/60'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                            <span className="flex items-center gap-1.5 bg-black/30 px-2.5 py-0.5 rounded-full border border-warden-border/50 font-mono text-[11px] font-bold">
                              <span className={`w-2 h-2 rounded-full ${
                                run.status === 'running' ? 'bg-warden-amber animate-ping' :
                                run.status === 'blocked' ? 'bg-status-blocked' :
                                run.status === 'completed' ? 'bg-status-safe' : 'bg-warden-danger'
                              }`} />
                              <span className={`uppercase tracking-wider ${
                                run.status === 'running' ? 'text-warden-amber' :
                                run.status === 'blocked' ? 'text-status-blocked' :
                                run.status === 'completed' ? 'text-status-safe' : 'text-warden-danger'
                              }`}>
                                {run.status}
                              </span>
                            </span>

                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase font-bold border ${
                              run.mode === 'shielded'
                                ? 'bg-warden-emerald/15 border-warden-emerald/40 text-warden-emerald shadow-sm'
                                : 'bg-status-blocked/15 border-status-blocked/40 text-status-blocked shadow-sm'
                            }`}>
                              MODE: {run.mode}
                            </span>

                            <span className="text-[10px] font-mono text-warden-text/40">
                              ID: {run.id.slice(0, 8)}
                            </span>
                          </div>

                          <p className="text-xs text-warden-text/90 truncate font-mono bg-black/20 p-2 rounded-lg border border-warden-border/40 group-hover:border-warden-amber/40 transition-colors">
                            <span className="text-warden-text/40 mr-2 uppercase text-[10px]">Target:</span>
                            {run.target_url}
                          </p>

                          {run.outcome && (
                            <p className="text-[11px] text-warden-text/70 mt-1.5 font-mono flex items-center gap-1.5">
                              <span className="text-warden-amber">↳</span>
                              <span>{run.outcome}</span>
                            </p>
                          )}
                        </div>

                        <div className="text-left md:text-right shrink-0 border-t md:border-t-0 border-warden-border/20 pt-2 md:pt-0">
                          <p className="text-[11px] text-warden-text/70 font-mono font-semibold">
                            {new Date(run.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </p>
                          <p className="text-[9px] text-warden-text/40 font-mono mt-0.5">
                            {new Date(run.started_at).toLocaleDateString()}
                          </p>
                        </div>
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

export default RunsPage;
