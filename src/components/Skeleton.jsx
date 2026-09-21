/**
 * Skeleton — reusable shimmer loading components.
 */

export function SkeletonLine({ width = '100%', height = '0.875rem', className = '' }) {
  return (
    <div
      className={`skeleton-shimmer rounded-md ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonBlock({ width = '100%', height = '6rem', className = '' }) {
  return (
    <div
      className={`skeleton-shimmer rounded-xl ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-5 space-y-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="skeleton-shimmer w-7 h-7 rounded-lg" />
        <SkeletonLine width="40%" height="0.75rem" />
      </div>
      <SkeletonLine width="100%" />
      <SkeletonLine width="85%" />
      <SkeletonLine width="60%" />
    </div>
  );
}

export function SkeletonClauseCard({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="skeleton-shimmer w-2 h-2 rounded-full" />
          <SkeletonLine width="100px" height="0.625rem" />
        </div>
        <SkeletonLine width="50px" height="1.25rem" className="rounded-full" />
      </div>
      <SkeletonLine width="70%" height="1rem" />
      <SkeletonLine width="100%" />
      <SkeletonLine width="90%" />
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Document header skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="skeleton-shimmer w-10 h-10 rounded-xl" />
          <div className="space-y-2 flex-1">
            <SkeletonLine width="200px" height="1rem" />
            <SkeletonLine width="120px" height="0.625rem" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <SkeletonBlock key={i} height="3.5rem" />
          ))}
        </div>
      </div>

      {/* Summary skeleton */}
      <SkeletonCard />

      {/* Clauses skeleton */}
      <div className="space-y-3">
        <SkeletonLine width="160px" height="0.625rem" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonClauseCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
