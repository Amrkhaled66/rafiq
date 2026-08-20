import { Icon } from "@iconify/react";
import type { FormEvent, ReactNode } from "react";
import Button from "@/shared/components/Button";

export default function FilterPanel({
  children,
  fieldsClassName,
  isApplying,
  hasChanges,
  hasFilters,
  onApply,
  onReset,
}: {
  children: ReactNode;
  fieldsClassName: string;
  isApplying: boolean;
  hasChanges: boolean;
  hasFilters: boolean;
  onApply: () => void;
  onReset: () => void;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply();
  }

  return (
    <form className="dashboard-card" onSubmit={handleSubmit}>
      <div className={fieldsClassName}>{children}</div>
      <div className="mt-5 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
        <Button
          type="button"
          variant="ghost"
          disabled={!hasFilters || isApplying}
          onClick={onReset}
          className="inline-flex items-center gap-2"
        >
          <Icon icon="solar:restart-linear" className="size-4" />
          مسح الفلاتر
        </Button>
        <Button
          type="submit"
          isLoading={isApplying}
          disabled={!hasChanges}
          className="inline-flex items-center gap-2"
        >
          <Icon icon="solar:filter-linear" className="size-4" />
          تطبيق الفلاتر
        </Button>
      </div>
    </form>
  );
}
