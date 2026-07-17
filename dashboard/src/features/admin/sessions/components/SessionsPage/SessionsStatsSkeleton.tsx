import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import StatsRow from "@/features/admin/shared/components/StatsRow";

export default function SessionsStatsSkeleton() {
  return (
    <StatsRow>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="dashboard-card flex w-full items-start justify-between md:max-w-xs"
        >
          <div className="w-full space-y-2 text-right">
            <Skeleton width="70%" height={16} />
            <Skeleton width="40%" height={32} />
          </div>
          <Skeleton circle width={56} height={56} />
        </div>
      ))}
    </StatsRow>
  );
}
