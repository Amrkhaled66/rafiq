export default function ProgressCell({ value }: { value: number }) {
  const safe = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

  return (
    <div className="min-w-36">
      <div className="text-subTitle mb-1 flex items-center justify-between text-xs">
        <span>{safe}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-300">
        <div
          className="h-full rounded-full bg-green-700 transition-all duration-300"
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}
