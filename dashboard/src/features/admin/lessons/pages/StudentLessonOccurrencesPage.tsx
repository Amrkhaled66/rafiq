import { useNavigate, useParams } from "react-router-dom";

import LessonOccurrencesManager from "@/features/admin/lessons/components/StudentLessonsPage/LessonOccurrencesManager";
import PageHeader from "@/features/admin/shared/components/PageHeader";
import Button from "@/shared/components/Button";
import { urls } from "@/shared/const/urls";

export default function StudentLessonOccurrencesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const studentId = Number(id);

  if (!Number.isFinite(studentId) || studentId <= 0) {
    return (
      <section className="dashboard-card text-right">
        <h1 className="text-foreground text-2xl font-bold">
          استثناءات الحصص
        </h1>
        <p className="text-subTitle mt-2 text-sm">رقم الطالب غير صالح.</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon="solar:calendar-mark-linear"
        title="استثناءات حصص الطالب"
        subtitle="حذف أو تغيير موعد حصة هنا يؤثر على هذا التاريخ فقط ولا يغير جدول الدرس الأسبوعي."
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              navigate(`/${urls.dashBoardUrl}/students/${studentId}/lessons`)
            }
          >
            الرجوع للدروس
          </Button>
        }
      />

      <LessonOccurrencesManager studentId={studentId} />
    </div>
  );
}
