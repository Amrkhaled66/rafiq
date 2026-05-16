import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import CreateSubscriptionPackageModal from "@/features/admin/subscriptions/components/SubscriptionPackagesPage/CreateSubscriptionPackageModal";
import SubscriptionPackagesTable from "@/features/admin/subscriptions/components/SubscriptionPackagesPage/SubscriptionPackagesTable";
import { useSubscriptionPackagesActions } from "@/features/admin/subscriptions/hooks/useSubscriptionPackagesActions";
import { useSubscriptionPackagesQuery } from "@/features/admin/subscriptions/queries/subscriptionQueries";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import Button from "@/shared/components/Button";

export default function SubscriptionPackagesPage() {
  const navigate = useNavigate();
  const packagesQuery = useSubscriptionPackagesQuery();
  const actions = useSubscriptionPackagesActions();

  if (packagesQuery.isLoading && !packagesQuery.data) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">باقات الاشتراك</h1>
        <p className="text-subTitle mt-2 text-sm">جاري تحميل الباقات...</p>
      </section>
    );
  }

  if (packagesQuery.isError) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">باقات الاشتراك</h1>
        <p className="mt-2 text-sm text-red-500">تعذر تحميل بيانات الباقات.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="باقات الاشتراك"
        subtitle="إدارة الباقات المتاحة قبل إنشاء اشتراكات الطلاب."
        action={
          <div className="flex flex-col gap-3 md:flex-row">
            <Button
              variant="outline"
              className="inline-flex items-center gap-2 text-sm"
              onClick={() => navigate("..")}
            >
              <Icon icon="solar:arrow-right-linear" className="size-5" />
              <span>العودة للاشتراكات</span>
            </Button>
            <Button
              className="inline-flex items-center gap-2 text-sm"
              onClick={actions.openCreateModal}
            >
              <Icon icon="material-symbols:add-rounded" className="size-5" />
              <span>إضافة باقة</span>
            </Button>
          </div>
        }
      />

      <SubscriptionPackagesTable
        packages={packagesQuery.data ?? []}
        isLoading={packagesQuery.isFetching}
      />

      <CreateSubscriptionPackageModal
        isOpen={actions.isCreateOpen}
        onClose={actions.closeCreateModal}
        onSubmit={actions.handleCreate}
        isSubmitting={actions.isCreating}
      />
    </div>
  );
}
