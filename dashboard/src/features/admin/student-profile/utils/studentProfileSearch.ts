import { isAxiosError } from "axios";

export const INVALID_STUDENT_PHONE_MESSAGE =
  "أدخل رقم هاتف مصري صحيح مكوّن من 11 رقم.";

export function getStudentSearchErrorMessage(error: unknown) {
  if (!isAxiosError(error)) {
    return "حدث خطأ غير متوقع. حاول مرة أخرى.";
  }

  if (error.response?.status === 400) {
    return INVALID_STUDENT_PHONE_MESSAGE;
  }

  if (error.response?.status === 404) {
    return "لم يتم العثور على طالب بهذا الرقم.";
  }

  return "تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى.";
}
