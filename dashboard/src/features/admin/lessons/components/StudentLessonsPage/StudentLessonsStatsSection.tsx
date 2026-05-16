import { Icon } from "@iconify/react";

import StatCard from "@/features/admin/shared/components/StatCard";

type StudentLessonsStatsSectionProps = {
  nextLessonLabel: string;
  totalLessons: number;
  totalSubjects: number;
};

export default function StudentLessonsStatsSection({
  nextLessonLabel,
  totalLessons,
  totalSubjects,
}: StudentLessonsStatsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <StatCard
        title="الدرس القادم"
        value={nextLessonLabel}
        icon={<Icon icon="solar:clock-circle-linear" />}
        color="#2563eb"
        className="text-lg"
      />
      <StatCard
        title="إجمالي الدروس"
        value={totalLessons}
        icon={<Icon icon="solar:notebook-bookmark-linear" />}
        color="#16a34a"
      />
      <StatCard
        title="إجمالي المواد"
        value={totalSubjects}
        icon={<Icon icon="solar:diploma-linear" />}
        color="#d97706"
      />
    </section>
  );
}
