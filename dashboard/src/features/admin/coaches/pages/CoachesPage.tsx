import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import StatCard from "@/features/admin/shared/components/StatCard";
import Button from "@/shared/components/Button";
import AddCoachModal from "../components/CoachesPage/AddCoachModal";
import CoachesTable from "../components/CoachesPage/CoachesTable";
import { useCoachesQuery } from "../queries/coachQueries";

export default function CoachesPage() {
  const [phoneSearch, setPhoneSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [phoneSearch]);

  const coachesQuery = useCoachesQuery({
    page,
    limit,
    phone: phoneSearch.trim() || undefined,
  });

  const coaches = coachesQuery.data?.data ?? [];
  const coachesCount = coachesQuery.data?.total ?? 0;

  return (
    <div className="space-y">
      <PageHeader
        title="المدربين"
        subtitle="إدارة بيانات المدربين المسجلين"
        action={
          <AddCoachModal>
            <Button className="inline-flex items-center gap-2 text-sm">
              <Icon icon="material-symbols:add-rounded" className="size-5" />
              <span>إضافة مدرب جديد</span>
            </Button>
          </AddCoachModal>
        }
      />

      <section className="flex flex-wrap gap-4 md:gap-6 lg:gap-8">
        <StatCard
          title="إجمالي المدربين"
          value={coachesCount}
          color="#d00507"
          icon={<Icon icon="fluent:people-team-24-regular" className="size-7" />}
        />
      </section>

      <CoachesTable
        coaches={coaches}
        currentPage={coachesQuery.data?.page ?? page}
        isLoading={coachesQuery.isLoading || coachesQuery.isFetching}
        phoneSearch={phoneSearch}
        rowsPerPage={coachesQuery.data?.limit ?? limit}
        onPageChange={setPage}
        onPhoneSearchChange={setPhoneSearch}
        onRowsPerPageChange={(nextLimit, nextPage) => {
          setLimit(nextLimit);
          setPage(nextPage);
        }}
        totalRows={coachesCount}
      />
    </div>
  );
}
