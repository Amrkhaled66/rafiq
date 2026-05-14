import { api } from "@/lib/api";
import type { EgyptCityKey } from "@/shared/const/cities";
import type { StudentGrade } from "@/shared/const/grades";
import type { UserRole } from "@/shared/interfaces/User";
import type { AddStudentFormValues } from "@/features/admin/students/schema/addStudentSchema";

export type Student = {
  id: number;
  fullName: string;
  phone: string;
  role: UserRole;
  city: EgyptCityKey;
  parentPhone: string;
  gradeLevel: StudentGrade;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type StudentsListResponse = {
  items: Student[];
  page: number;
  limit: number;
  total: number;
};

export type ListStudentsParams = {
  coachId?: number;
  page?: number;
  limit?: number;
  search?: string;
};

export type StudentOverviewStats = {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  missedTasks: number;
  completionRate: number;
};

export type StudentOverviewTask = {
  id: number;
  title: string;
  subject: string;
  status: string;
  sessionsCount: number;
};

export type StudentOverviewLesson = {
  id: number;
  subject: string;
  scheduledAt: string;
};

export type StudentOverview = {
  student: Student;
  stats: StudentOverviewStats;
  todayTasks: StudentOverviewTask[];
  todayLessons: StudentOverviewLesson[];
};

export async function listStudents(
  params: ListStudentsParams = {},
): Promise<StudentsListResponse> {
  const { data } = await api.get<StudentsListResponse>("/students", {
    params,
  });

  return data;
}

export async function createStudent(
  payload: AddStudentFormValues,
): Promise<Student> {
  const { data } = await api.post<Student>("/students", payload);
  return data;
}

export async function getStudentOverview(id: number): Promise<StudentOverview> {
  const { data } = await api.get<StudentOverview>(`/students/${id}/overview`);
  return data;
}
