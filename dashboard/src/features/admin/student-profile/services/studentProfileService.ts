import { api } from "@/lib/api";
import type { Student, AssignedCoach } from "@/features/admin/students/services/studentService";
import type { MissedTaskRow } from "@/features/admin/missed-tasks/services/missedTasksService";
import type { MissedLessonRow } from "@/features/admin/missed-lessons/services/missedLessonsService";
import type { Lesson } from "@/features/admin/lessons/services/lessonService";

export type StudentProfilePlan = {
  id: number;
  name: string;
  startsOn: string;
  endsOn: string;
  createdAt: Date;
  totalTasks: number;
  completedTasks: number;
  missedTasks: number;
  progressPercent: number;
  status: string;
};

export type StudentProfile = {
  student: Student;
  assignedCoaches: AssignedCoach[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    remainingTasks: number;
    missedTasks: number;
    completionRate: number;
  };
  todayTasks: Array<{
    id: number;
    title: string;
    subject: string;
    status: string;
    dueAt: string;
    planId: number;
  }>;
  todayLessons: Array<{
    id: number;
    lessonName: string;
    subject: string;
    status: string;
    scheduledAt: string;
  }>;
  missedTasks: MissedTaskRow[];
  missedLessons: MissedLessonRow[];
  plans: StudentProfilePlan[];
  lessons: Lesson[];
};

export type StudentSearchResult = {
  id: number;
  fullName: string;
  phone: string;
};

export async function searchStudentByPhone(
  phone: string,
): Promise<StudentSearchResult> {
  const { data } = await api.get<StudentSearchResult>("/students/search", {
    params: { phone },
  });
  return data;
}

export async function getStudentProfile(id: number): Promise<StudentProfile> {
  const { data } = await api.get<StudentProfile>(`/students/${id}/profile`);
  return data;
}
