import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/Button";
import SectionCard from "./SectionCard";

export default function QuickActions({
  isSuperAdmin,
}: {
  isSuperAdmin: boolean;
}) {
  const navigate = useNavigate();

  return (
    <SectionCard title="إجراءات سريعة">
      <div className="grid grid-cols-1 gap-3">
        <Button
          type="button"
          onClick={() => navigate("students")}
          className="inline-flex items-center justify-between gap-3 border-none bg-white! text-sm text-black! drop-shadow-sm"
        >
          <span className="inline-flex items-center gap-2">
            <Icon
              icon="mdi:school-outline"
              className="text-brand-primary size-5"
            />
            الذهاب إلى الطلاب
          </span>
          <Icon
            icon="material-symbols:chevron-left-rounded"
            className="size-5"
          />
        </Button>

        <Button
          type="button"
          onClick={() => navigate("sessions")}
          variant="outline"
          className="inline-flex items-center justify-between gap-3 border-none bg-white! text-sm text-black! drop-shadow-sm"
        >
          <span className="inline-flex items-center gap-2">
            <Icon
              icon="material-symbols:timer-outline"
              className="size-5 text-blue-600"
            />
            عرض الجلسات
          </span>
          <Icon
            icon="material-symbols:chevron-left-rounded"
            className="size-5"
          />
        </Button>

        <Button
          type="button"
          onClick={() => navigate("missed-tasks")}
          variant="outline"
          className="inline-flex items-center justify-between gap-3 border-none bg-white! text-sm text-black! drop-shadow-sm"
        >
          <span className="inline-flex items-center gap-2">
            <Icon
              icon="material-symbols:event-busy-outline"
              className="text-brand-primary size-5"
            />
            متابعة المهام الفائتة
          </span>
          <Icon
            icon="material-symbols:chevron-left-rounded"
            className="size-5"
          />
        </Button>

        {isSuperAdmin ? (
          <Button
            type="button"
            onClick={() => navigate("subscriptions")}
            variant="outline"
            className="inline-flex items-center justify-between gap-3 border-none bg-white! text-sm text-black! drop-shadow-sm"
          >
            <span className="inline-flex items-center gap-2">
              <Icon
                icon="material-symbols:subscriptions-outline"
                className="size-5 text-purple-700"
              />
              إدارة الاشتراكات
            </span>
            <Icon
              icon="material-symbols:chevron-left-rounded"
              className="size-5"
            />
          </Button>
        ) : null}
      </div>
    </SectionCard>
  );
}
