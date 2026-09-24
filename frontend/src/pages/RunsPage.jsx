import PageHeader from '@/components/layout/PageHeader';
import FadeIn from '@/components/motion/FadeIn';

const RunsPage = () => {
  return (
    <FadeIn>
      <PageHeader
        title="Runs"
        subtitle="Agent test sessions and real-time monitoring"
      />
      <div className="rounded-xl border border-warden-border bg-warden-surface p-8 text-center">
        <p className="text-warden-text/40">No runs yet. Start an agent session to see it here.</p>
      </div>
    </FadeIn>
  );
};

export default RunsPage;
