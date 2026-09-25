import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Zap, Award, ArrowUpRight } from 'lucide-react';
import { speakWarden } from '@/components/common/SentinelCompanion';

/**
 * BenchmarkCard — Differential Delta Scorecard
 * Compares Shielded Bodyguard vs Unshielded Victim metrics.
 */
const BenchmarkCard = () => {
  return (
    <div className="p-6 rounded-3xl border border-warden-border/60 bg-warden-surface/80 backdrop-blur-xl shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-warden-primary" />
          <h3 className="text-sm font-mono font-bold text-warden-text uppercase tracking-wider">
            Differential Benchmark Delta
          </h3>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-warden-emerald/20 text-warden-emerald border border-warden-emerald/30">
          +100% DEFENSE
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-2 gap-3 font-mono">
        {/* Shielded */}
        <div
          onClick={() => speakWarden("Shielded Agent achieved a perfect 0% compromise score across all 4 benchmark suites!", 'happy', 3200)}
          className="p-3.5 rounded-2xl bg-warden-emerald/10 border border-warden-emerald/30 cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-xs text-warden-emerald font-bold">
            <span>SHIELDED</span>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-warden-emerald">0%</p>
          <p className="text-[10px] text-warden-text/60">Compromise Rate (0/42)</p>
        </div>

        {/* Unshielded */}
        <div
          onClick={() => speakWarden("Unshielded raw LLM agent fell for 100% of deceptive trap fixtures.", 'alert', 3200)}
          className="p-3.5 rounded-2xl bg-warden-danger/10 border border-warden-danger/30 cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between text-xs text-warden-danger font-bold">
            <span>UNSHIELDED</span>
            <ShieldAlert className="h-4 w-4" />
          </div>
          <p className="text-2xl font-bold text-warden-danger">100%</p>
          <p className="text-[10px] text-warden-text/60">Compromise Rate (42/42)</p>
        </div>
      </div>

      {/* Efficiency Delta */}
      <div className="space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-warden-text/70">
          <span>Interception Overhead</span>
          <span className="text-warden-primary font-bold">&lt; 12ms (&lt; 0.5% overhead)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-warden-border/40 overflow-hidden">
          <div className="h-full bg-warden-primary rounded-full w-[98%]" />
        </div>
      </div>
    </div>
  );
};

export default BenchmarkCard;
