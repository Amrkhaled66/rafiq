import { useParams } from "react-router-dom";
import { useCoachProfileQuery } from "@/features/admin/coaches/queries/coachQueries";

export default function CoachPage() {
  const params = useParams();
  const coachId = Number(params.id);
  const coachQuery = useCoachProfileQuery(coachId);
  const coach = coachQuery.data;

  if (coachQuery.isLoading) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(23,23,23,0.06)]">
        <p className="text-subTitle text-sm">جاري تحميل بيانات المدرب...</p>
      </section>
    );
  }

  if (!coach) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(23,23,23,0.06)]">
        <p className="text-subTitle text-sm">تعذر العثور على بيانات المدرب.</p>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(23,23,23,0.06)]">
      <h1 className="text-foreground text-2xl font-bold">{coach.fullName}</h1>
      <div className="text-subTitle mt-4 space-y-2 text-sm">
        <p>رقم الهاتف: {coach.phone}</p>
        <p>الدور: {coach.role}</p>
      </div>
    </section>
  );
}
