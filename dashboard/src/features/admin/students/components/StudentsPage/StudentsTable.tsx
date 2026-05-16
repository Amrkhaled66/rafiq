import { Icon } from "@iconify/react";
import { useMemo } from "react";
import type { TableColumn } from "react-data-table-component";
import { useNavigate } from "react-router-dom";

import AdminServerTable from "@/features/admin/shared/components/AdminServerTable";
import DebouncedSearchField from "@/features/admin/shared/components/DebouncedSearchField";
import type { Student } from "@/features/admin/students/services/studentService";
import Button from "@/shared/components/Button";
import GradeBadge from "@/shared/components/GradeBadge";

type StudentsTableProps = {
  students: Student[];
  currentPage: number;
  isLoading?: boolean;
  rowsPerPage: number;
  search: string;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number, page: number) => void;
  onSearchChange: (value: string) => void;
  totalRows: number;
};

export default function StudentsTable({
  students,
  currentPage,
  isLoading = false,
  rowsPerPage,
  search,
  onPageChange,
  onRowsPerPageChange,
  onSearchChange,
  totalRows,
}: StudentsTableProps) {
  const navigate = useNavigate();

  const columns = useMemo<TableColumn<Student>[]>(
    () => [
      {
        name: "اسم الطالب",
        selector: (row) => row.fullName,
        sortable: true,
        grow: 1.4,
      },
      {
        name: "رقم الهاتف",
        selector: (row) => row.phone,
      },
      {
        name: "الصف",
        cell: (row) => <GradeBadge grade={row.gradeLevel} />,
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
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [navigate],
  );

  return (
    <section className="dashboard-card">
      <div className="mb-5 flex flex-col gap-4 text-right md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-foreground text-xl font-bold">قائمة الطلاب</h2>
          <p className="text-subTitle mt-1 text-sm">
            عرض مبدئي لبيانات الطلاب المسجلين.
          </p>
        </div>

        <div className="w-full md:max-w-sm">
          <DebouncedSearchField
            label="البحث"
            name="student-search"
            placeholder="ابحث باسم الطالب أو رقم الهاتف"
            value={search}
            onChange={onSearchChange}
            icon={<Icon icon="solar:magnifer-linear" className="size-4" />}
          />
        </div>
      </div>

      <AdminServerTable
        columns={columns}
        data={students}
        isLoading={isLoading}
        loadingText="جاري تحميل الطلاب..."
        noDataText="لا يوجد طلاب لعرضهم"
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </section>
  );
}

