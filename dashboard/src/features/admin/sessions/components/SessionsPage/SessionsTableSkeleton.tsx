import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SessionsTableSkeleton() {
  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <Skeleton width={140} height={28} />
      </div>

      <div className="space-y-3">
        {/* Header row skeleton */}
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`h-${i}`} className="flex-1">
              <Skeleton height={20} />
            </div>
          ))}
        </div>

        {/* Data rows skeleton */}
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4">
            {Array.from({ length: 6 }).map((_, colIdx) => (
              <div key={`${rowIdx}-${colIdx}`} className="flex-1">
                <Skeleton height={40} borderRadius={8} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-4 flex items-center justify-end gap-4">
        <Skeleton width={80} height={32} />
        <Skeleton width={120} height={32} />
      </div>
    </section>
  );
}
