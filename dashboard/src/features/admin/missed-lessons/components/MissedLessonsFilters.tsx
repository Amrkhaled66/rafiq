import DropdownField from "@/shared/components/DropDownMenu";
import FormInput from "@/shared/components/FormInput";

type Props = {
  from: string;
  to: string;
  status: "" | "resolved" | "unresolved";
  watchStatus: "" | "unwatched" | "watched_late";
  coachId: string;
  showCoach: boolean;
  coachOptions: Array<{ label: string; value: string }>;
  coachesLoading: boolean;
  onChange: (
    key: "from" | "to" | "status" | "watchStatus" | "coachId",
    value: string,
  ) => void;
};

export default function MissedLessonsFilters(props: Props) {
  return (
    <section className="dashboard-card grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
      <FormInput
        label="من"
        type="date"
        name="missed-lessons-from"
        value={props.from}
        onChange={(event) => props.onChange("from", event.target.value)}
      />
      <FormInput
        label="إلى"
        type="date"
        name="missed-lessons-to"
        value={props.to}
        onChange={(event) => props.onChange("to", event.target.value)}
      />
      <DropdownField
        label="حالة المتابعة"
        value={props.status}
        placeholder="كل الحالات"
        items={[
          { label: "كل الحالات", value: "" },
          { label: "تمت المتابعة", value: "resolved" },
          { label: "بحاجة للمتابعة", value: "unresolved" },
        ]}
        onChange={(value) => props.onChange("status", value)}
      />
      <DropdownField
        label="حالة المشاهدة"
        value={props.watchStatus}
        placeholder="كل الحالات"
        items={[
          { label: "كل الحالات", value: "" },
          { label: "لم تُشاهد", value: "unwatched" },
          { label: "شوهدت متأخرًا", value: "watched_late" },
        ]}
        onChange={(value) => props.onChange("watchStatus", value)}
      />
      {props.showCoach ? (
        <DropdownField
          label="المدرب"
          value={props.coachId}
          placeholder="كل المدربين"
          items={[{ label: "كل المدربين", value: "" }, ...props.coachOptions]}
          loading={props.coachesLoading}
          onChange={(value) => props.onChange("coachId", value)}
        />
      ) : null}
    </section>
  );
}
