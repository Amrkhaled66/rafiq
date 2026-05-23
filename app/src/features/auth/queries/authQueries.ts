import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/features/auth/services/authService";

export function useLoginMutation() {
  return useMutation({ mutationFn: loginUser });
}
