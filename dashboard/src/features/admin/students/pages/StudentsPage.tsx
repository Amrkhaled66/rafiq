import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import StatCard from "@/features/admin/shared/components/StatCard";
import Button from "@/shared/components/Button";
import AddStudentModal from "../components/StudentsPage/AddStudentModal";
import StudentsTable from "../components/StudentsPage/StudentsTable";
import { useStudentsQuery } from "../queries/studentQueries";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const studentsQuery = useStudentsQuery({
    page,
    limit,
    search: search.trim() || undefined,
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

      <section className="flex flex-wrap gap-4 md:gap-6 lg:gap-8">
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
      </section>

      <StudentsTable
        students={students}
        currentPage={studentsQuery.data?.page ?? page}
        isLoading={studentsQuery.isLoading || studentsQuery.isFetching}
        rowsPerPage={studentsQuery.data?.limit ?? limit}
        search={search}
        onPageChange={setPage}
        onRowsPerPageChange={(nextLimit, nextPage) => {
          setLimit(nextLimit);
          setPage(nextPage);
        }}
        onSearchChange={setSearch}
        totalRows={studentsCount}
      />
    </div>
  );
}
