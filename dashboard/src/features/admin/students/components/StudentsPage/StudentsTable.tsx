import { Icon } from "@iconify/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";
import Button from "@/shared/components/Button";
import FormInput from "@/shared/components/FormInput";
import GradeBadge from "@/shared/components/GradeBadge";
import Table from "@/shared/components/Table";
import { type StudentGrade } from "@/shared/const/grades";

type StudentRow = {
  id: number;
  name: string;
  phone: string;
  grade: StudentGrade;
};

const students: StudentRow[] = [
  {
    id: 1,
    name: "أحمد علي",
    phone: "01001234567",
    grade: "first_secondary",
  },
  {
    id: 2,
    name: "سارة محمد",
    phone: "01007654321",
    grade: "second_secondary",
  },
  {
    id: 3,
    name: "يوسف خالد",
    phone: "01122334455",
    grade: "third_secondary",
  },
];

export default function StudentsTable() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return students;
    }

    return students.filter((student) =>
      [student.name, student.phone].some((value) =>
        value.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [search]);

  const columns = useMemo<TableColumn<StudentRow>[]>(
    () => [
      {
        name: "اسم الطالب",
        selector: (row) => row.name,
        sortable: true,
        grow: 1.4,
      },
      {
        name: "رقم الهاتف",
        selector: (row) => row.phone,
      },
      {
        name: "الصف",
        cell: (row) => <GradeBadge grade={row.grade} />,
      },
      {
        name: "",
        cell: (row) => (
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm"
            onClick={() => navigate(`/students/${row.id}`)}
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
        pagination
        responsive
        highlightOnHover
        persistTableHead
      />
    </section>
  );
}
