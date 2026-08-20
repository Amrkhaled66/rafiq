import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";

type DropdownItem = {
  label: string;
  value: string;
  disabled?: boolean;
};

type Props = {
  label?: string;
  value?: string;
  placeholder?: string;
  error?: string;
  items: DropdownItem[];
  onChange: (value: string) => void;
  loading?: boolean;
  icon?: React.ReactNode;
  hint?: string;
};

export default function DropdownField({
  label,
  value,
  placeholder = "Select option",
  error,
  items,
  onChange,
  loading = false,
  icon,
  hint,
}: Props) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const selected = items.find((item) => item.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex flex-col gap-2">
      {label && (
        <span className="text-foreground text-right text-sm font-semibold">
          {label}
        </span>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setOpen((prev) => !prev);
            setFocused(true);
          }}
          className={`relative flex w-full items-center rounded-2xl border px-4 py-3.5 text-right text-sm transition-all duration-200 ${
            error
              ? "border-red-400 bg-red-50"
              : focused
                ? "border-brand-primary bg-white shadow-[0_0_0_4px_rgba(249,131,129,0.12)]"
                : "hover:border-brand-primary/40 border-gray-200 bg-gray-50"
          } `}
        >
          {icon && (
            <span className="bg-brand-primary/10 text-brand-primary me-3 flex size-8 items-center justify-center rounded-xl">
              {icon}
            </span>
          )}

          <span
            className={`flex-1 ${
              selected ? "text-foreground" : "text-gray-400"
            } `}
          >
            {selected ? selected.label : placeholder}
          </span>

          <Icon
            icon="mdi:chevron-down"
            className={`size-5 text-gray-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            } `}
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
            {loading ? (
              <div className="flex items-center justify-center py-5">
                <span className="border-brand-primary/30 border-t-brand-primary size-6 animate-spin rounded-full border-2" />
              </div>
            ) : (
              items.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled) {
                      onChange(item.value);
                      setOpen(false);
                      setFocused(false);
                    }
                  }}
                  className={`flex w-full rounded-xl px-4 py-3 text-right text-sm transition ${
                    item.value === value
                      ? "bg-brand-primary/10 text-brand-primary font-semibold"
                      : "hover:bg-brand-primary/5"
                  } ${item.disabled ? "cursor-not-allowed opacity-40" : ""} `}
                >
                  {item.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error ? (
        <span className="text-right text-xs font-medium text-red-500">
          {error}
        </span>
      ) : hint ? (
        <span className="text-subTitle text-right text-xs">{hint}</span>
      ) : null}
    </div>
  );
}
