import { useParams } from "react-router-dom";

export default function StudentAddPlanPage() {
  const { id } = useParams();

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(23,23,23,0.06)]">
      <h1 className="min-h-screen text-2xl font-bold text-[var(--foreground)]">
        إضافة خطة جديدة
      </h1>
      <p className="mt-2 text-sm text-[var(--subTitle)]">
        صفحة مؤقتة لإضافة خطة جديدة للطالب رقم {id}.
      </p>
    </section>
  );
}
