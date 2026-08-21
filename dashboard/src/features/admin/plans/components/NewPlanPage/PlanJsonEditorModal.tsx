import { Icon } from "@iconify/react";
import { json } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { useState } from "react";

import {
  parseEditablePlanJson,
  type EditablePlanJson,
} from "@/features/admin/plans/components/NewPlanPage/planJson";
import type { PlanDay } from "@/features/admin/plans/components/NewPlanPage/types";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import { appToast } from "@/shared/lib/toast";

export default function PlanJsonEditorModal({
  isOpen,
  initialValue,
  onClose,
  onApply,
}: {
  isOpen: boolean;
  initialValue: string;
  onClose: () => void;
  onApply: (plan: EditablePlanJson, days: PlanDay[]) => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState<string[]>([]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      appToast.success("تم نسخ JSON الخطة.");
    } catch {
      appToast.error("تعذر نسخ JSON الخطة.");
    }
  }

  function handleApply() {
    const result = parseEditablePlanJson(value);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    onApply(result.plan, result.days);
    onClose();
    appToast.success("تم تطبيق JSON على بطاقات الخطة.");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <section className="dashboard-card flex max-h-[85vh] flex-col overflow-hidden text-right">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Icon
                icon="solar:code-file-linear"
                className="text-brand-primary size-5"
              />
              <h2 className="text-foreground text-lg font-bold">
                تعديل الخطة كـ JSON
              </h2>
            </div>
            <p className="text-subTitle mt-1 text-sm">
              انسخ كتلة يوم كاملة، غيّر التاريخ، ثم طبّق التعديلات لمراجعتها في
              البطاقات.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            onClick={onClose}
            aria-label="إغلاق محرر JSON"
            title="إغلاق"
          >
            <Icon icon="solar:close-circle-linear" className="size-5" />
          </button>
        </header>

        <div dir="ltr" className="mt-4 min-h-0 flex-1 overflow-y-auto">
          <CodeMirror
            value={value}
            height="52vh"
            minHeight="320px"
            theme="dark"
            extensions={[json()]}
            basicSetup={{
              bracketMatching: true,
              closeBrackets: true,
              foldGutter: true,
              highlightActiveLine: true,
              highlightActiveLineGutter: true,
              indentOnInput: true,
              lineNumbers: true,
            }}
            onChange={(nextValue) => {
              setValue(nextValue);
              if (errors.length > 0) setErrors([]);
            }}
            aria-label="JSON الخطة"
            className="border-border overflow-hidden rounded-lg border text-left text-sm [&_.cm-editor]:outline-none [&_.cm-foldGutter]:w-5 [&_.cm-gutters]:border-e [&_.cm-scroller]:font-mono"
          />

          {errors.length > 0 ? (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <div className="text-sm font-semibold text-red-700">
                تعذر تطبيق التعديلات
              </div>
              <ul className="mt-1 list-disc space-y-1 ps-5 text-sm text-red-600">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <footer className="mt-4 flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <Button
            variant="ghost"
            className="inline-flex items-center gap-1.5"
            onClick={handleCopy}
          >
            <Icon icon="solar:copy-linear" className="size-4" />
            نسخ JSON
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              className="inline-flex items-center gap-1.5"
              onClick={handleApply}
            >
              <Icon icon="solar:check-circle-linear" className="size-4" />
              تطبيق على البطاقات
            </Button>
          </div>
        </footer>
      </section>
    </Modal>
  );
}
