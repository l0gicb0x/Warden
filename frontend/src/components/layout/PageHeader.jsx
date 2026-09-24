/**
 * PageHeader — reusable page title bar with optional subtitle and action slot.
 *
 * Usage:
 *   <PageHeader
 *     title="Active Runs"
 *     subtitle="Monitor agent sessions in real time"
 *     action={<button>New Run</button>}
 *   />
 */
const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-warden-text">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-warden-text/50">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
