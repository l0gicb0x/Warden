/**
 * TemplateSkeleton — loading placeholder.
 * Copy and customise shimmer dimensions for your feature's card shape.
 */
const TemplateSkeleton = ({ count = 3 }) => {
  return (
    <div className="template-skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="template-skeleton" aria-busy="true">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-body" />
          <div className="skeleton-line skeleton-body short" />
        </div>
      ))}
    </div>
  );
};

export default TemplateSkeleton;
