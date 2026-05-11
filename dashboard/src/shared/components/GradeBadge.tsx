import {
  STUDENT_GRADES,
  STUDENT_GRADES_CLASSES,
  type StudentGrade,
} from "@/shared/const/grades";

export default function GradeBadge({ grade }: { grade: StudentGrade }) {
  return (
    <span
      className={`rounded-full p-1 text-center text-xs font-medium sm:px-3 ${STUDENT_GRADES_CLASSES[grade]}`}
    >
      {STUDENT_GRADES[grade]}
    </span>
  );
}
