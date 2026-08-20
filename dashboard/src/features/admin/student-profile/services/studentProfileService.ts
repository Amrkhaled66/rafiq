import { api } from "@/lib/api";
import type { Student, AssignedCoach } from "@/features/admin/students/services/studentService";

export type StudentProfile = {
  student: Student;
  assignedCoaches: AssignedCoach[];
  stats: {
    totalMissedTasks: number;
    totalMissedLessons: number;
    totalPlans: number;
    totalLessons: number;
  };
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
