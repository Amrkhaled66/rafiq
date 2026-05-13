import { isAxiosError } from "axios";

type ErrorResponse = {
  message?: string | string[];
};

export function getErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (!isAxiosError<ErrorResponse>(error)) {
    return fallbackMessage;
  }

  const responseMessage = error.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage[0] ?? fallbackMessage;
  }

  if (typeof responseMessage === "string" && responseMessage.trim()) {
    return responseMessage;
  }

  return fallbackMessage;
}
