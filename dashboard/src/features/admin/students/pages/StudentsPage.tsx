import { Icon } from "@iconify/react";
import { useState } from "react";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import StatCard from "@/features/admin/shared/components/StatCard";
import StatsRow from "@/features/admin/shared/components/StatsRow";
import useResetPageOnChange from "@/features/admin/shared/hooks/useResetPageOnChange";
import useServerPagination from "@/features/admin/shared/hooks/useServerPagination";
import Button from "@/shared/components/Button";
import { optionalTrim } from "@/shared/utils/query";
import AddStudentModal from "../components/StudentsPage/AddStudentModal";
import StudentsTable from "../components/StudentsPage/StudentsTable";
import { useStudentsQuery } from "../queries/studentQueries";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const { page, limit, setPage, onChangeRowsPerPage } = useServerPagination();

  useResetPageOnChange(setPage, [search]);

  const studentsQuery = useStudentsQuery({
    page,
    limit,
    search: optionalTrim(search),
  });

  const students = studentsQuery.data?.items ?? [];
  const studentsCount = studentsQuery.data?.total ?? 0;

  return (
    <div className="space-y">
      <PageHeader
        title="الطلاب"
        subtitle="ادارة بيانات الطلاب المسجلين"
        action={
          <AddStudentModal>
            <Button className="inline-flex items-center gap-2 text-sm">
              <Icon icon="material-symbols:add-rounded" className="size-5" />
              <span>اضافة طالب جديد</span>
            </Button>
          </AddStudentModal>
        }
      />

      <StatsRow>
        <StatCard
          title="اجمالي الطلاب"
          value={studentsCount}
          color="#d00507"
          icon={<Icon icon="mdi:account-group-outline" className="size-7" />}
        />
        <StatCard
          title="طلاب نشطون"
          value={studentsCount}
          color="#1f7a5a"
          icon={<Icon icon="mdi:account-check-outline" className="size-7" />}
        />
      </StatsRow>

      <StudentsTable
        students={students}
        currentPage={studentsQuery.data?.page ?? page}
        isLoading={studentsQuery.isLoading || studentsQuery.isFetching}
        rowsPerPage={studentsQuery.data?.limit ?? limit}
        search={search}
        onPageChange={setPage}
        onRowsPerPageChange={onChangeRowsPerPage}
        onSearchChange={setSearch}
        totalRows={studentsCount}
      />
    </div>
  );
}
