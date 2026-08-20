import React, { forwardRef, useState, type ReactNode } from "react";

type FormInputProps = {
  label: string;
  className?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
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
      hint,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);

    return (
      <label className="flex flex-col gap-2">

        <span className="text-sm font-semibold text-foreground text-right">
          {label}
          {required && (
            <span className="text-brand-primary ms-1">*</span>
          )}
        </span>


        <div
          className={`
            relative
            flex
            items-center
            rounded-2xl
            border
            transition-all
            duration-200
            ${
              error
                ? "border-red-400 bg-red-50"
                : focused
                ? "border-brand-primary bg-white shadow-[0_0_0_4px_rgba(249,131,129,0.12)]"
                : "border-gray-200 bg-gray-50 hover:border-brand-primary/40"
            }
          `}
        >

          {icon && (
            <div
              className="
                absolute
                inset-s-3
                flex
                size-8
                items-center
                justify-center
                rounded-xl
                bg-brand-primary/10
                text-brand-primary
              "
            >
              {icon}
            </div>
          )}


          <input
            ref={ref}
            dir="rtl"
            name={name}
            type={type}
            {...props}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            min={type === "number" ? min : undefined}
            required={required}

            onFocus={() => setFocused(true)}

            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}

            className={`
              w-full
              bg-transparent
              px-4
              py-3.5
              text-sm
              text-foreground
              placeholder:text-gray-400
              outline-none

              ${icon ? "ps-14" : ""}

              ${className}
            `}
          />

        </div>


        {error ? (
          <span className="text-xs font-medium text-red-500 text-right">
            {error}
          </span>
        ) : hint ? (
          <span className="text-xs text-subTitle text-right">
            {hint}
          </span>
        ) : null}

      </label>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;