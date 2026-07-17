export const SESSION_STATUS_VALUES = [
  "running",
  "paused",
  "completed",
  "cancelled",
] as const;

export type SessionStatus = (typeof SESSION_STATUS_VALUES)[number];

export const SESSION_STATUS_FILTER_OPTIONS: Array<{
  label: string;
  value: "" | SessionStatus;
}> = [
  { label: "كل الحالات", value: "" },
  { label: "جارية", value: "running" },
  { label: "متوقفة", value: "paused" },
  { label: "مكتملة", value: "completed" },
  { label: "ملغاة", value: "cancelled" },
];

export const SESSION_STATUS_BADGE_CONFIG: Record<
  SessionStatus,
  { label: string; className: string }
> = {
  running: {
    label: "جارية",
    className: "bg-sky-100 text-sky-700",
  },
  paused: {
    label: "متوقفة",
    className: "bg-amber-100 text-amber-800",
  },
  completed: {
    label: "مكتملة",
    className: "bg-emerald-100 text-emerald-700",
  },
  cancelled: {
    label: "ملغاة",
    className: "bg-slate-100 text-slate-700",
  },
};

export function isSessionStatus(value: string): value is SessionStatus {
  return SESSION_STATUS_VALUES.includes(value as SessionStatus);
}
