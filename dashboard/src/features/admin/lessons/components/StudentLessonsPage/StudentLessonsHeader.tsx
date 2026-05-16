import PageHeader from "@/features/admin/shared/components/PageHeader";
import Button from "@/shared/components/Button";

export default function StudentLessonsHeader({
  onAddLesson,
}: {
  onAddLesson: () => void;
}) {
  return (
    <PageHeader
      title="دروس الطالب"
      subtitle="إدارة دروس الطالب المجدولة ومتابعة موعدها القادم."
      action={
        <Button onClick={onAddLesson} className="text-sm">
          إضافة درس جديد
        </Button>
      }
    />
  );
}

