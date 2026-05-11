import { Icon } from "@iconify/react";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import StatCard from "@/features/admin/shared/components/StatCard";
import StudentsTable from "../components/StudentsPage/StudentsTable";

export default function StudentsPage() {
  return (
    <div className="space-y">
      <PageHeader
        title="الطلاب"
        subtitle="ادارة بيانات الطلاب المسجلين"
        actionLabel="اضافة طالب جديد"
        actionIcon={<Icon icon="material-symbols:add-rounded" className="size-5" />}
      />

      <section className="flex flex-wrap gap-4 md:gap-6 lg:gap-8">
        <StatCard
          title="اجمالي الطلاب"
          value={248}
          color="#d00507"
          icon={<Icon icon="mdi:account-group-outline" className="size-7" />}
        />
        <StatCard
          title="طلاب نشطون"
          value={212}
          color="#1f7a5a"
          icon={<Icon icon="mdi:account-check-outline" className="size-7" />}
        />
      </section>

      <StudentsTable />
    </div>
  );
}
