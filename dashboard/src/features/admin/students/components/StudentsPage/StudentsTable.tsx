import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";
import GradeBadge from "@/shared/components/GradeBadge";
import Table from "@/shared/components/Table";
import type { Student } from "@/features/admin/students/services/studentService";

type StudentsTableProps = {
  students: Student[];
  isLoading?: boolean;
};

export default function StudentsTable({
  students,
  isLoading = false,
}: StudentsTableProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return students;
    }

    return students.filter((student) =>
      [student.fullName, student.phone].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [search, students]);

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
          <FormInput
            label="البحث"
            name="student-search"
            placeholder="دور علي الطالب"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            icon={<Icon icon="solar:magnifer-linear" className="size-4" />}
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredStudents}
        progressPending={isLoading}
        progressComponent={
          <div className="py-6 text-sm text-subTitle">جاري تحميل الطلاب...</div>
        }
        noDataComponent={
          <div className="py-6 text-sm text-subTitle">لا يوجد طلاب لعرضهم</div>
        }
        pagination
        responsive
        highlightOnHover
        persistTableHead
      />
    </section>
  );
}
