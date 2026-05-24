import { useState } from "react";

type FieldErrors<T> = Partial<Record<keyof T, string>>;

interface UseFormProps<T> {
  initialValues: T;
  validate?: (values: T) => FieldErrors<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

type ChangeTarget<T> = {
  target: {
    name: keyof T;
    value: T[keyof T];
  };
};

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormProps<T>) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});

  const handleChange = (
    fieldOrEvent: keyof T | ChangeTarget<T>,
    nextValue?: T[keyof T],
  ) => {
    const name =
      typeof fieldOrEvent === "object"
        ? fieldOrEvent.target.name
        : fieldOrEvent;
    const value =
      typeof fieldOrEvent === "object" ? fieldOrEvent.target.value : nextValue;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));
  };

  const handleSubmit = async (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();

    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(Boolean);

    if (!hasErrors) {
      await onSubmit(values);
    }
  };

  const updateError = (error: string, field: keyof T) => {
    setErrors((previous) => ({
      ...previous,
      [field]: error,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    updateError,
    resetForm,
  };
}
