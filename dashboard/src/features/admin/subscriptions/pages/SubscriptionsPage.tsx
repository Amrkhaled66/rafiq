import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import CreateSubscriptionModal from "@/features/admin/subscriptions/components/SubscriptionsPage/CreateSubscriptionModal";
import SubscriptionsStatsSection from "@/features/admin/subscriptions/components/SubscriptionsPage/SubscriptionsStatsSection";
import SubscriptionsTable from "@/features/admin/subscriptions/components/SubscriptionsPage/SubscriptionsTable";
import { useSubscriptionsActions } from "@/features/admin/subscriptions/hooks/useSubscriptionsActions";
import {
  useSubscriptionPackagesQuery,
  useSubscriptionsQuery,
} from "@/features/admin/subscriptions/queries/subscriptionQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import useServerPagination from "@/features/admin/shared/hooks/useServerPagination";
import Button from "@/shared/components/Button";

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const pagination = useServerPagination();
  const subscriptionsQuery = useSubscriptionsQuery({
    page: pagination.page,
    limit: pagination.limit,
  });
  const packagesQuery = useSubscriptionPackagesQuery();
  const actions = useSubscriptionsActions();

  if (subscriptionsQuery.isLoading && !subscriptionsQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">الاشتراكات</h1>
        <p className="text-subTitle mt-2 text-sm">جاري تحميل الاشتراكات...</p>
      </section>
    );
  }

  if (subscriptionsQuery.isError || !subscriptionsQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">الاشتراكات</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل بيانات الاشتراكات.</p>
      </section>
    );
  }

  const { stats, items, total, page, limit } = subscriptionsQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الاشتراكات"
        subtitle="إدارة اشتراكات الطلاب وإسناد الباقات المناسبة لكل طالب."
        action={
          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              variant="outline"
              className="inline-flex items-center gap-2 text-sm"
              onClick={() => navigate("packages")}
            >
              <Icon icon="solar:box-linear" className="size-5" />
              <span>إدارة الباقات</span>
            </Button>
            <Button
              className="inline-flex items-center gap-2 text-sm"
              onClick={actions.openCreateModal}
            >
              <Icon icon="material-symbols:add-rounded" className="size-5" />
              <span>إضافة اشتراك</span>
            </Button>
          </div>
        }
      />

      <SubscriptionsStatsSection stats={stats} />

      <SubscriptionsTable
        items={items}
        total={total}
        page={page}
        limit={limit}
        isLoading={subscriptionsQuery.isFetching}
        onChangePage={pagination.setPage}
        onChangeRowsPerPage={pagination.onChangeRowsPerPage}
      />

      <CreateSubscriptionModal
        isOpen={actions.isCreateOpen}
        onClose={actions.closeCreateModal}
        onSubmit={actions.handleCreate}
        isSubmitting={actions.isCreating}
        packages={packagesQuery.data ?? []}
      />
    </div>
  );
}
