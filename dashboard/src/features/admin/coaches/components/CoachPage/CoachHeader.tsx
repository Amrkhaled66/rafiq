import { Icon } from "@iconify/react";
import type { CoachProfile } from "@/features/admin/coaches/services/coachService";
import UpdateCoachInfoModal from "@/features/admin/coaches/components/CoachPage/UpdateCoachInfoModal";
import Button from "@/shared/components/Button";
import { formatProfileDate, getUserInitials } from "@/shared/utils/profile";

export default function CoachHeader({ coach }: { coach: CoachProfile }) {
  const initials = getUserInitials(coach.fullName);

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-row gap-4 text-right">
          <div className="bg-brand-primary flex size-18 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm">
            {initials}
          </div>

          <div className="text-subTitle flex flex-col gap-3 text-sm sm:flex-wrap sm:gap-x-6">
            <div className="space-y-2">
              <h1 className="text-foreground text-3xl font-bold">
                {coach.fullName}
              </h1>
            </div>

            <div className="flex gap-x-6">
              <div className="inline-flex items-center gap-2">
                <Icon
                  icon="solar:phone-linear"
                  className="text-brand-primary size-4"
                />
                <span>{coach.phone}</span>
              </div>
            </div>

            <div className="text-subTitle inline-flex items-center gap-2 text-sm">
              <Icon
                icon="solar:calendar-mark-linear"
                className="text-brand-primary size-4"
              />
              <span>
                تاريخ إنشاء الحساب: {formatProfileDate(coach.createdAt ?? "")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <UpdateCoachInfoModal coach={coach}>
            <Button variant="outline" className="inline-flex items-center gap-2">
              <Icon icon="solar:pen-2-linear" className="size-4" />
              <span>تعديل البيانات</span>
            </Button>
          </UpdateCoachInfoModal>
        </div>
      </div>
    </section>
  );
}
