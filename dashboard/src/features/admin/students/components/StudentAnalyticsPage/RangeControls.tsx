import Button from "@/shared/components/Button";
import {
  ANALYTICS_PRESETS,
  getPresetRange,
} from "./studentAnalyticsUtils";

export default function RangeControls({
  from,
  to,
  hasValidRange,
  onChange,
}: {
  from: string;
  to: string;
  hasValidRange: boolean;
  onChange: (nextRange: { from: string; to: string }) => void;
}) {
  return (
    <section className="dashboard-card space-y-5 text-right">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-foreground text-xl font-bold">الفترة الزمنية</h2>
          <p className="text-subTitle mt-1 text-sm">
            اختر فترة لا تزيد عن 90 يومًا لتحليل أداء الطالب خلال نفس النطاق.
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-end gap-3">
          <label className="space-y-1 text-sm">
            <span className="text-subTitle block">من</span>
            <input
              type="date"
              value={from}
              onChange={(event) => onChange({ from: event.target.value, to })}
              className="border-border focus:border-brand-primary rounded-lg border bg-white px-3 py-2 outline-none"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-subTitle block">إلى</span>
            <input
              type="date"
              value={to}
              onChange={(event) => onChange({ from, to: event.target.value })}
              className="border-border focus:border-brand-primary rounded-lg border bg-white px-3 py-2 outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {ANALYTICS_PRESETS.map((preset) => (
              <Button
                key={preset.days}
                variant="outline"
                onClick={() => onChange(getPresetRange(preset.days))}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {!hasValidRange && (
        <p className="text-sm text-red-500">
          يجب أن تكون الفترة صحيحة ولا تزيد عن 90 يومًا.
        </p>
      )}
    </section>
  );
}
