import { appToast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

export function showApiErrorToast(
  error: unknown,
  fallbackMessage: string,
  toastId = "api-error",
) {
  appToast.error(getErrorMessage(error, fallbackMessage), {
    id: toastId,
  });
}

