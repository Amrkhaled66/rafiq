import { memo, useEffect, useState } from "react";
import type { ReactNode } from "react";

import FormInput from "@/shared/components/FormInput";
import { useDebouncedValue } from "@/shared/utils/useDebouncedValue";

type DebouncedSearchFieldProps = {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  debounceMs?: number;
};

const DebouncedSearchField = memo(function DebouncedSearchField({
  label,
  name,
  placeholder,
  value,
  onChange,
  icon,
  debounceMs = 400,
}: DebouncedSearchFieldProps) {
  const [innerValue, setInnerValue] = useState(value);
  const debouncedValue = useDebouncedValue(innerValue, debounceMs);

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <FormInput
      label={label}
      name={name}
      placeholder={placeholder}
      value={innerValue}
      onChange={(event) => setInnerValue(event.target.value)}
      icon={icon}
    />
  );
});

export default DebouncedSearchField;

