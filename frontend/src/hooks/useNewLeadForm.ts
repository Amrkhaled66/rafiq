import { useEffect, useState } from "react";
import { isValidEgyptianPhone, normalizePhone } from "../utils/phone";

export type NewLeadFormData = {
  name: string;
  phone: string;
};

type UseNewLeadFormParams = {
  isOpen: boolean;
  onSubmit?: (data: NewLeadFormData) => Promise<void> | void;
};

export const useNewLeadForm = ({ isOpen, onSubmit }: UseNewLeadFormParams) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Partial<NewLeadFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setPhone("");
      setErrors({});
      setIsSubmitting(false);
      setIsDone(false);
      setSubmitError("");
    }
  }, [isOpen]);

  const validateForm = () => {
    const nextErrors: Partial<NewLeadFormData> = {};

    if (!name.trim()) {
      nextErrors.name = "اكتب اسمك الأول";
    }

    if (!phone.trim()) {
      nextErrors.phone = "اكتب رقم الموبايل";
    } else if (!isValidEgyptianPhone(phone)) {
      nextErrors.phone = "اكتب رقم موبايل مصري صحيح";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setSubmitError("");
    setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setSubmitError("");
    setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitError("");
      setIsSubmitting(true);

      await onSubmit?.({
        name: name.trim(),
        phone: normalizePhone(phone),
      });

      setIsDone(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "تعذر إرسال البيانات، حاول مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values: {
      name,
      phone,
    },
    errors,
    isSubmitting,
    isDone,
    submitError,
    handleNameChange,
    handlePhoneChange,
    handleSubmit,
  };
};