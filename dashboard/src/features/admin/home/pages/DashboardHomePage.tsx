import { Icon } from "@iconify/react";

import PageHeader from "@/features/admin/shared/components/PageHeader";

export default function DashboardHomePage() {
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
      {/* 
      <OperationalStats
        canReadSubscriptions={canReadSubscriptions}
        missedStats={q.missedUnresolved.data?.stats}
        sessionsStats={q.runningSessions.data?.stats}
        subscriptionsStats={q.subscriptions.data?.stats}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ActionInbox
            isSuperAdmin={canReadSubscriptions}
            now={q.today}
            missedUnresolved={q.missedUnresolved.data}
            runningSessions={q.runningSessions.data}
            subscriptions={q.subscriptions.data}
          />
        </div>

        <div className="space-y-6">
          <QuickActions isSuperAdmin={canReadSubscriptions} />
          <RecentActivity resolvedMissedTasks={q.missedResolvedRecent.data} />
        </div> 
      </div>
        */}
    </section>
  );
}
