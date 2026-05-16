import { Icon } from "@iconify/react";
import { useCallback, useMemo, useState } from "react";

import { useCoachesQuery } from "@/features/admin/coaches/queries/coachQueries";
import type { Coach } from "@/features/admin/coaches/services/coachService";
import {
  useAssignCoachToStudentMutation,
  useRemoveCoachFromStudentMutation,
  useStudentCoachesQuery,
} from "@/features/admin/students/queries/studentQueries";
import Button from "@/shared/components/Button";
import DropDownMenu from "@/shared/components/DropDownMenu";
import Modal from "@/shared/components/Modal";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

export default function ManageStudentCoachesModal({
  studentId,
}: {
  studentId: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState<string>("");

  const assignedCoachesQuery = useStudentCoachesQuery(studentId);
  const coachesQuery = useCoachesQuery({ page: 1, limit: 100 });

  const assignMutation = useAssignCoachToStudentMutation(studentId);
  const removeMutation = useRemoveCoachFromStudentMutation(studentId);

  const assignedCoachIds = useMemo(() => {
    return new Set((assignedCoachesQuery.data ?? []).map((c) => c.id));
  }, [assignedCoachesQuery.data]);

  const availableCoaches = useMemo<Coach[]>(() => {
    const all = coachesQuery.data?.data ?? [];
    return all;
  }, [assignedCoachIds, coachesQuery.data?.data]);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedCoachId("");
    assignMutation.reset();
    removeMutation.reset();
  }, [assignMutation, removeMutation]);

  const open = useCallback(() => setIsOpen(true), []);

  const onAdd = useCallback(() => {
    const coachId = Number(selectedCoachId);
    if (!Number.isFinite(coachId) || coachId <= 0) return;

    assignMutation.mutate(coachId, {
      onSuccess: () => {
        setSelectedCoachId("");
      },
    });
  }, [assignMutation, selectedCoachId]);

  return (
    <>
      <Button variant="outline" className="w-full text-sm" onClick={open}>
        إدارة المدربين
      </Button>

      <Modal isOpen={isOpen} onClose={close}>
        <div className="dashboard-card mx-auto max-w-2xl space-y-6 rounded-3xl p-6 text-right md:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-foreground text-xl font-bold">
              إدارة المدربين
            </h2>
            {/* <Button variant="outline" onClick={close}>
              إغلاق
            </Button> */}
          </div>

          <div className="space-y-3">
            <h3 className="text-foreground font-semibold">المدربون الحاليون</h3>

            {assignedCoachesQuery.isLoading ? (
              <p className="text-subTitle text-sm">جاري التحميل...</p>
            ) : assignedCoachesQuery.data &&
              assignedCoachesQuery.data.length > 0 ? (
              <div className="space-y-2">
                {assignedCoachesQuery.data.map((coach) => (
                  <div
                    key={coach.id}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 drop-shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-foreground font-medium">
                        {coach.fullName}
                      </span>
                      <span className="text-subTitle text-sm">
                        {coach.phone}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="px-3"
                      isLoading={removeMutation.isPending}
                      onClick={() => removeMutation.mutate(coach.id)}
                    >
                      <Icon
                        icon="solar:trash-bin-trash-linear"
                        className="size-5"
                      />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-subTitle text-sm">
                لا يوجد مدربون معينون لهذا الطالب.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-foreground font-semibold">إضافة مدرب</h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end">
              <DropDownMenu
                // label="المدرب"
                value={selectedCoachId}
                placeholder={
                  coachesQuery.isLoading ? "جاري التحميل..." : "اختر مدربًا"
                }
                items={availableCoaches.map((c) => ({
                  label: `${c.fullName} (${c.phone})`,
                  value: String(c.id),
                }))}
                onChange={setSelectedCoachId}
              />

              <Button
                className="min-w-28"
                onClick={onAdd}
                isLoading={assignMutation.isPending}
                disabled={!selectedCoachId}
              >
                إضافة
              </Button>
            </div>

            {assignMutation.isError ? (
              <p className="text-sm text-red-500">
                {getErrorMessage(assignMutation.error, "تعذر إضافة المدرب")}
              </p>
            ) : null}

            {removeMutation.isError ? (
              <p className="text-sm text-red-500">
                {getErrorMessage(removeMutation.error, "تعذر إزالة المدرب")}
              </p>
            ) : null}
          </div>
        </div>
      </Modal>
    </>
  );
}
