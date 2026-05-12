import React, { forwardRef, useState, type ReactNode } from "react";

type FormInputProps = {
  label: string;
  className?: string;
  error?: string;
  icon?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      value,
      onChange,
      onBlur,
      required,
      className = "",
      error,
      min,
      icon,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <label className="flex flex-col gap-1">
        <span className="text-start text-sm font-medium text-foreground">
          {label}
        </span>
        <div className="relative w-full">
          {icon ? (
            <span className="pointer-events-none absolute inset-y-0 start-2 flex items-center text-subTitle">
              {icon}
            </span>
          ) : null}
          <input
            dir="rtl"
            ref={ref}
            name={name}
            type={type}
            {...props}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            min={type === "number" ? min : undefined}
            onBlur={handleBlur}
            onFocus={handleFocus}
            required={required}
            className={`w-full border-0 border-b py-3 text-sm transition-colors focus:outline-none ${
              error
                ? "border-red-500 hover:bg-red-500/5"
                : "border-gray-400/40 hover:bg-brand-primary/5"
            } ${icon ? "ps-10 pe-2" : "px-2"} ${className}`}
          />
          <span
            className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
              error ? "bg-red-500" : "bg-brand-primary"
            } ${isFocused ? "w-full" : "w-0"}`}
          />
        </div>
        {error ? <span className="text-sm text-red-500">{error}</span> : null}
      </label>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
