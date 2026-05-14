import { Icon } from "@iconify/react";
import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";
import type { Coach } from "@/features/admin/coaches/services/coachService";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";
import Table from "@/shared/components/Table";
import { useDebouncedValue } from "@/shared/utils/useDebouncedValue";

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
        selector: (row) => formatDate(row.createdAt ?? ""),
      },
      {
        name: "إجمالي الطلاب",
        selector: (row) => row.assignedStudentsCount,
        center: true,
        sortable:true
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
            <span>شوفني</span>
          </Button>
        ),
        button: true,
      },
    ],
    [],
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
          <CoachPhoneSearchField
            initialValue={phoneSearch}
            onSearchChange={onPhoneSearchChange}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={coaches}
        progressPending={isLoading}
        progressComponent={
          <div className="text-subTitle py-6 text-sm">
            جاري تحميل المدربين...
          </div>
        }
        noDataComponent={
          <div className="text-subTitle py-6 text-sm">
            لا يوجد مدربين لعرضهم
          </div>
        }
        pagination
        paginationDefaultPage={currentPage}
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={onPageChange}
        onChangeRowsPerPage={onRowsPerPageChange}
        responsive
        highlightOnHover
        persistTableHead
      />
    </section>
  );
}

const CoachPhoneSearchField = memo(function CoachPhoneSearchField({
  initialValue,
  onSearchChange,
}: {
  initialValue: string;
  onSearchChange: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebouncedValue(value, 400);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  return (
    <FormInput
      label="البحث بالهاتف"
      name="coach-phone-search"
      placeholder="ابحث برقم الهاتف"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      icon={<Icon icon="solar:magnifer-linear" className="size-4" />}
    />
  );
});

function formatDate(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
