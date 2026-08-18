import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import type { StudentProfilePlan } from "@/features/admin/student-profile/services/studentProfileService";
import Table from "@/shared/components/Table";

function PlanStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "نشطة", className: "bg-emerald-100 text-emerald-700" },
    upcoming: { label: "قادمة", className: "bg-blue-100 text-blue-700" },
    ended: { label: "منتهية", className: "bg-slate-100 text-slate-700" },
  };
  const display = map[status] ?? map.ended;
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${display.className}`}
    >
      {display.label}
    </span>
  );
}

export default function ProfilePlansSection({
  plans,
}: {
  plans: StudentProfilePlan[];
}) {
  const columns = useMemo<TableColumn<StudentProfilePlan>[]>(
    () => [
      {
        name: "اسم الخطة",
        selector: (row) => row.name,
        grow: 1.5,
      },
      {
        name: "البداية",
        selector: (row) => row.startsOn,
      },
      {
        name: "النهاية",
        selector: (row) => row.endsOn,
      },
      {
        name: "المهام",
        selector: (row) => `${row.completedTasks} / ${row.totalTasks}`,
        center: true,
      },
      {
        name: "الفائتة",
        selector: (row) => row.missedTasks,
        center: true,
      },
      {
        name: "النسبة",
        cell: (row) => (
          <div className="flex items-center gap-2">
            <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
              <div
                className="from-brand-primary h-full rounded-full bg-linear-to-r to-blue-500"
                style={{ width: `${row.progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium">{row.progressPercent}%</span>
          </div>
        ),
        sortable: true,
        sortFunction: (a, b) => a.progressPercent - b.progressPercent,
      },
      {
        name: "الحالة",
        cell: (row) => <PlanStatusBadge status={row.status} />,
      },
    ],
    [],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">خطط الطالب</h2>
        <p className="text-subTitle mt-1 text-sm">
          جميع الخطط الدراسية للطالب ({plans.length} خطة).
        </p>
      </div>

      <Table
        columns={columns}
        data={plans}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 20, 50]}
        responsive
        highlightOnHover
        persistTableHead
        noDataComponent={
          <div className="text-subTitle py-6 text-sm">
            لا توجد خطط دراسية.
          </div>
        }
      />
    </section>
  );
}
