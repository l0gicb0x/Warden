import PageHeader from '@/components/layout/PageHeader';
import FadeIn from '@/components/motion/FadeIn';

const DashboardPage = () => {
  return (
    <FadeIn>
      <PageHeader
        title="Dashboard"
        subtitle="Warden agent monitoring overview"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Dashboard cards will be built as features are added */}
        <div className="rounded-xl border border-warden-border bg-warden-surface p-6">
          <p className="text-sm text-warden-text/50">Total Runs</p>
          <p className="mt-1 text-3xl font-bold text-warden-text">—</p>
        </div>
        <div className="rounded-xl border border-warden-border bg-warden-surface p-6">
          <p className="text-sm text-warden-text/50">Traps Detected</p>
          <p className="mt-1 text-3xl font-bold text-warden-danger">—</p>
        </div>
        <div className="rounded-xl border border-warden-border bg-warden-surface p-6">
          <p className="text-sm text-warden-text/50">Active Agents</p>
          <p className="mt-1 text-3xl font-bold text-warden-primary">—</p>
        </div>
      </div>
    </FadeIn>
  );
};

export default DashboardPage;
