import PageHeader from "@/features/admin/shared/components/PageHeader";
import Button from "@/shared/components/Button";

export default function StudentLessonsHeader({
  onAddLesson,
  onManageOccurrences,
}: {
  onAddLesson: () => void;
  onManageOccurrences: () => void;
}) {
  return (
    <PageHeader
      icon="solar:book-bookmark-linear"
      title="دروس الطالب"
      subtitle="إدارة دروس الطالب المجدولة أسبوعيًا ومتابعة أقرب درس قادم."
      action={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={onManageOccurrences}
            className="text-sm"
          >
            استثناءات الحصص
          </Button>
          <Button onClick={onAddLesson} className="text-sm">
            إضافة درس جديد
          </Button>
        </div>
      }
    />
  );
}
