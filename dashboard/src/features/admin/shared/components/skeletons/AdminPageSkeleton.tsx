import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function HeaderSkeleton() {
  return (
    <section className="dashboard-card flex items-start justify-between gap-6">
      <div className="w-full max-w-md space-y-3 text-right">
        <Skeleton width="55%" height={34} />
        <Skeleton width="85%" height={18} />
      </div>
      <Skeleton width={120} height={40} borderRadius={8} />
    </section>
  );
}

function ProfileHeaderSkeleton() {
  return (
    <section className="dashboard-card">
      <div className="flex flex-col justify-between gap-6 lg:flex-row">
        <div className="flex flex-1 gap-4">
          <Skeleton circle width={72} height={72} />
          <div className="w-full max-w-md space-y-3">
            <Skeleton width="55%" height={32} />
            <Skeleton width="75%" height={18} />
            <Skeleton width="65%" height={18} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} width={110} height={38} borderRadius={8} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSkeleton({ count }: { count: number }) {
  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="dashboard-card flex min-w-0 items-start justify-between gap-4"
        >
          <div className="min-w-0 flex-1 space-y-3 text-right">
            <Skeleton width="75%" height={16} />
            <Skeleton width="40%" height={30} />
          </div>
          <Skeleton circle width={52} height={52} />
        </div>
      ))}
    </section>
  );
}

function ContentSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <section className="dashboard-card" aria-hidden="true">
      <div className="mb-6 space-y-2 text-right">
        <Skeleton width={190} height={26} />
        <Skeleton width={300} height={16} />
      </div>

      <div className="space-y-3">
        <Skeleton height={24} />
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} height={44} borderRadius={8} />
        ))}
      </div>
    </section>
  );
}

export default function AdminPageSkeleton({
  header = "page",
  statsCount = 0,
  contentSections = 1,
  rows = 5,
}: {
  header?: "page" | "profile";
  statsCount?: number;
  contentSections?: number;
  rows?: number;
}) {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-label="جاري تحميل البيانات"
    >
      {header === "profile" ? <ProfileHeaderSkeleton /> : <HeaderSkeleton />}
      {statsCount > 0 ? <StatsSkeleton count={statsCount} /> : null}
      {Array.from({ length: contentSections }).map((_, index) => (
        <ContentSkeleton key={index} rows={rows} />
      ))}
      <span className="sr-only">جاري تحميل البيانات...</span>
    </div>
  );
}
