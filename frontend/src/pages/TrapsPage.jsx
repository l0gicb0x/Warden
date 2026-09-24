import PageHeader from '@/components/layout/PageHeader';
import FadeIn from '@/components/motion/FadeIn';

const TrapsPage = () => {
  return (
    <FadeIn>
      <PageHeader
        title="Traps"
        subtitle="Detected trap pages and deceptive patterns"
      />
      <div className="rounded-xl border border-warden-border bg-warden-surface p-8 text-center">
        <p className="text-warden-text/40">No traps detected yet. Run an agent session to begin analysis.</p>
      </div>
    </FadeIn>
  );
};

export default TrapsPage;
