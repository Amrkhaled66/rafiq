import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { TableColumn } from "react-data-table-component";
import type { Student } from "@/features/admin/students/services/studentService";
import Button from "@/shared/components/Button";
import GradeBadge from "@/shared/components/GradeBadge";
import Table from "@/shared/components/Table";
import { formatProfileDate } from "@/shared/utils/profile";
import {urls} from "@/shared/const/urls"

type CoachAssignedStudentsSectionProps = {
  currentPage: number;
  isLoading?: boolean;
  rowsPerPage: number;
  students: Student[];
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number, page: number) => void;
};

export default function CoachAssignedStudentsSection({
  currentPage,
  isLoading = false,
  rowsPerPage,
  students,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
}: CoachAssignedStudentsSectionProps) {
  const navigate = useNavigate();

  const columns = useMemo<TableColumn<Student>[]>(
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
        name: "الصف",
        cell: (row) => <GradeBadge grade={row.gradeLevel} />,
      },
      {
        name: "المدينة",
        selector: (row) => row.city,
      },
      {
        name: "تاريخ الإنشاء",
        selector: (row) => formatProfileDate(row.createdAt),
      },
      {
        name: "",
        cell: (row) => (
          <Button
            variant="ghost"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm"
            onClick={() => navigate(`/${urls.dashBoardUrl}/students/${row.id}`)}
          >
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
      <div className="mb-5 text-right">
        <h2 className="text-foreground text-xl font-bold">الطلاب المسندون</h2>
        <p className="text-subTitle mt-1 text-sm">
          قائمة الطلاب المرتبطين بهذا المدرب حالياً.
        </p>
      </div>

      <Table
        columns={columns}
        data={students}
        progressPending={isLoading}
        progressComponent={
          <div className="text-subTitle py-6 text-sm">
            جاري تحميل الطلاب المسندين...
          </div>
        }
        noDataComponent={
          <div className="text-subTitle py-6 text-sm">
            لا يوجد طلاب مسندون لهذا المدرب.
          </div>
        }
        pagination
        paginationDefaultPage={currentPage}
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[5, 10, 20, 50]}
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
