import { Icon } from "@iconify/react";
import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";

import type { Coach } from "@/features/admin/coaches/services/coachService";
import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import DebouncedSearchField from "@/features/admin/shared/components/DebouncedSearchField";
import Button from "@/shared/components/Button";
import { formatDateArShort2DigitDay } from "@/shared/utils/dates";

type CoachesTableProps = {
  coaches: Coach[];
  currentPage: number;
  isLoading?: boolean;
  phoneSearch: string;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onPhoneSearchChange: (value: string) => void;
  onRowsPerPageChange: (rowsPerPage: number, page: number) => void;
  totalRows: number;
};

export default function CoachesTable({
  coaches,
  currentPage,
  isLoading = false,
  phoneSearch,
  rowsPerPage,
  onPageChange,
  onPhoneSearchChange,
  onRowsPerPageChange,
  totalRows,
}: CoachesTableProps) {
  const navigate = useNavigate();

  const columns = useMemo<TableColumn<Coach>[]>(
    () => [
      {
        name: "الاسم",
        selector: (row) => row.fullName,
        sortable: true,
        grow: 1.4,
      },
      {
        name: "الهاتف",
        selector: (row) => row.phone,
      },
      {
        name: "تاريخ الإنشاء",
        selector: (row) => formatDateArShort2DigitDay(row.createdAt ?? ""),
      },
      {
        name: "إجمالي الطلاب",
        selector: (row) => row.assignedStudentsCount,
        center: true,
        sortable: true,
      },
      {
        name: "",
        cell: (row) => (
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm"
            onClick={() => navigate(`${row.id}`)}
          >
            <Icon icon="solar:eye-linear" className="size-4" />
            <span>عرض</span>
          </Button>
        ),
        button: true,
      },
    ],
    [navigate],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 flex flex-col gap-4 text-right md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-foreground text-xl font-bold">قائمة المدربين</h2>
          <p className="text-subTitle mt-1 text-sm">
            إدارة بيانات المدربين المسجلين في النظام.
          </p>
        </div>

        <div className="w-full md:max-w-sm">
          <DebouncedSearchField
            label="البحث بالهاتف"
            name="coach-phone-search"
            placeholder="ابحث برقم الهاتف"
            value={phoneSearch}
            onChange={onPhoneSearchChange}
            icon={<Icon icon="solar:magnifer-linear" className="size-4" />}
          />
        </div>
      </div>

      <AdminServerTable
        columns={columns}
        data={coaches}
        isLoading={isLoading}
        loadingText="جاري تحميل المدربين..."
        noDataText="لا يوجد مدربون لعرضهم"
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </section>
  );
}

