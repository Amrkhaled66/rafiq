import { useParams } from "react-router-dom";

export default function StudentPage() {
  const { id } = useParams();

  return (
    <section className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(23,23,23,0.06)]">
      <h1 className="text-2xl font-bold text-foreground">
        تفاصيل الطالب
      </h1>
      <p className="mt-2 text-sm text-subTitle">
        صفحة مؤقتة لعرض بيانات الطالب رقم {id}.
      </p>
    </section>
  );
}
