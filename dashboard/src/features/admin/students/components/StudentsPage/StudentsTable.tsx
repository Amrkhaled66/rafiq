import { Icon } from "@iconify/react";
import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";
import type { Student } from "@/features/admin/students/services/studentService";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";
import GradeBadge from "@/shared/components/GradeBadge";
import Table from "@/shared/components/Table";
import { useDebouncedValue } from "@/shared/utils/useDebouncedValue";

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
console.log("object")
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
            <span>شوفني</span>
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
          <StudentsSearchField
            initialValue={search}
            onSearchChange={onSearchChange}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={students}
        progressPending={isLoading}
        progressComponent={
          <div className="py-6 text-sm text-subTitle">جاري تحميل الطلاب...</div>
        }
        noDataComponent={
          <div className="py-6 text-sm text-subTitle">لا يوجد طلاب لعرضهم</div>
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

const StudentsSearchField = memo(function StudentsSearchField({
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
      label="البحث"
      name="student-search"
      placeholder="ابحث باسم الطالب أو رقم الهاتف"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      icon={<Icon icon="solar:magnifer-linear" className="size-4" />}
    />
  );
});
