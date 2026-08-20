import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchStudentByPhoneMutation } from "@/features/admin/student-profile/queries/studentProfileQueries";
import {
  getStudentSearchErrorMessage,
  INVALID_STUDENT_PHONE_MESSAGE,
} from "@/features/admin/student-profile/utils/studentProfileSearch";
import {
  isEgyptianMobilePhone,
  normalizePhoneDigits,
} from "@/shared/utils/phone";

export default function useStudentProfileSearch() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const searchMutation = useSearchStudentByPhoneMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (searchMutation.isPending) return;

    const normalizedPhone = normalizePhoneDigits(phone);
    if (!isEgyptianMobilePhone(normalizedPhone)) {
      setValidationError(INVALID_STUDENT_PHONE_MESSAGE);
      return;
    }

    setValidationError(null);
    searchMutation.mutate(normalizedPhone, {
      onSuccess: (student) => navigate(String(student.id)),
    });
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    setValidationError(null);
    searchMutation.reset();
  }

  const error =
    validationError ??
    (searchMutation.isError
      ? getStudentSearchErrorMessage(searchMutation.error)
      : null);

  return {
    phone,
    error,
    isPending: searchMutation.isPending,
    canSubmit: phone.trim().length > 0,
    handleSubmit,
    handlePhoneChange,
  };
}
