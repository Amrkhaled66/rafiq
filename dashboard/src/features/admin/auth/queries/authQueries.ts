import { useMutation } from "@tanstack/react-query";
import { loginAdmin } from "@/features/admin/auth/services/authService";

export function useAdminLoginMutation() {
  return useMutation({
    mutationFn: loginAdmin,
  });
}
