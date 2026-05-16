import PageHeader from "@/features/admin/shared/components/PageHeader";
import Button from "@/shared/components/Button";
import { formatDateArShort } from "@/shared/utils/dates";

export default function StudentPlanDetailsHeader({
  title,
  startsOn,
  endsOn,
  onDelete,
  onEdit,
}: {
  title: string;
  startsOn: string;
  endsOn: string;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <PageHeader
      title={title}
      subtitle={`الفترة: ${formatDateArShort(startsOn)} - ${formatDateArShort(
        endsOn,
      )}`}
      action={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-red-600" onClick={onDelete}>
            حذف الخطة
          </Button>
          <Button onClick={onEdit}>تعديل الخطة</Button>
        </div>
      }
    />
  );
}
