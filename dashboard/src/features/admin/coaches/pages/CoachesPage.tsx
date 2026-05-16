import { Icon } from "@iconify/react";
import { useState } from "react";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import StatCard from "@/features/admin/shared/components/StatCard";
import StatsRow from "@/features/admin/shared/components/StatsRow";
import useResetPageOnChange from "@/features/admin/shared/hooks/useResetPageOnChange";
import useServerPagination from "@/features/admin/shared/hooks/useServerPagination";
import Button from "@/shared/components/Button";
import { optionalTrim } from "@/shared/utils/query";
import AddCoachModal from "../components/CoachesPage/AddCoachModal";
import CoachesTable from "../components/CoachesPage/CoachesTable";
import { useCoachesQuery } from "../queries/coachQueries";

export default function CoachesPage() {
  const [phoneSearch, setPhoneSearch] = useState("");
  const { page, limit, setPage, onChangeRowsPerPage } = useServerPagination();

  useResetPageOnChange(setPage, [phoneSearch]);

  const coachesQuery = useCoachesQuery({
    page,
    limit,
    phone: optionalTrim(phoneSearch),
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

      <StatsRow>
        <StatCard
          title="إجمالي المدربين"
          value={coachesCount}
          color="#d00507"
          icon={<Icon icon="fluent:people-team-24-regular" className="size-7" />}
        />
      </StatsRow>

      <CoachesTable
        coaches={coaches}
        currentPage={coachesQuery.data?.page ?? page}
        isLoading={coachesQuery.isLoading || coachesQuery.isFetching}
        phoneSearch={phoneSearch}
        rowsPerPage={coachesQuery.data?.limit ?? limit}
        onPageChange={setPage}
        onPhoneSearchChange={setPhoneSearch}
        onRowsPerPageChange={onChangeRowsPerPage}
        totalRows={coachesCount}
      />
    </div>
  );
}
