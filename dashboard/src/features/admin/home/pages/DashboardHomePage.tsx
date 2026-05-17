import { Icon } from "@iconify/react";

import PageHeader from "@/features/admin/shared/components/PageHeader";
import { useAuth } from "@/shared/context/authContext";
import { USER_ROLES } from "@/shared/interfaces/User";
import { useDashboardHomeQueries } from "../queries/homeQueries";
import OperationalStats from "../components/OperationalStats";
import ActionInbox from "../components/ActionInbox";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";

export default function DashboardHomePage() {
  const { authData } = useAuth();
  const isSuperAdmin = authData.user?.role === USER_ROLES.SUPER_ADMIN;

  const q = useDashboardHomeQueries({ isSuperAdmin });

  return (
    <section className="space-y-6">
      <PageHeader
        title="الصفحة الرئيسية"
        subtitle="يا الف اهلا وسهلا."
        action={
          <div className="inline-flex items-center gap-2 rounded-2xl bg-black/2 px-4 py-2 text-sm">
            <Icon icon="material-symbols:bolt" className="size-5" />
          </div>
        }
      />

      <OperationalStats
        isSuperAdmin={isSuperAdmin}
        missedStats={q.missedUnresolved.data?.stats}
        sessionsStats={q.runningSessions.data?.stats}
        subscriptionsStats={q.subscriptions.data?.stats}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ActionInbox
            isSuperAdmin={isSuperAdmin}
            now={q.today}
            missedUnresolved={q.missedUnresolved.data}
            runningSessions={q.runningSessions.data}
            subscriptions={q.subscriptions.data}
          />
        </div>

        <div className="space-y-6">
          <QuickActions isSuperAdmin={isSuperAdmin} />
          <RecentActivity resolvedMissedTasks={q.missedResolvedRecent.data} />
        </div>
      </div>
    </section>
  );
}

