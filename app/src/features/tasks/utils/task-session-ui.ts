import { Colors } from "@/shared/theme/theme";

import type { TaskSessionItem, TaskSessionStatus } from "@/features/tasks/types";

export function getTaskSessionStatusAppearance(status: TaskSessionStatus) {
  switch (status) {
    case "completed":
      return {
        label: "مكتملة",
        icon: "checkmark",
        badgeBackgroundColor: "#DCFCE7",
        badgeTextColor: "#166534",
        iconBackgroundColor: "#DCFCE7",
        iconColor: "#16A34A",
      };
    case "running":
      return {
        label: "جارية",
        icon: "play",
        badgeBackgroundColor: "#DBEAFE",
        badgeTextColor: "#1D4ED8",
        iconBackgroundColor: "#DBEAFE",
        iconColor: "#2563EB",
      };
    case "paused":
      return {
        label: "متوقفة مؤقتًا",
        icon: "pause",
        badgeBackgroundColor: "#FEF3C7",
        badgeTextColor: "#B45309",
        iconBackgroundColor: "#FEF3C7",
        iconColor: "#F59E0B",
      };
    default:
      return {
        label: "ملغاة",
        icon: "close",
        badgeBackgroundColor: "#F3F4F6",
        badgeTextColor: "#6B7280",
        iconBackgroundColor: "#F3F4F6",
        iconColor: Colors.light.icon,
      };
  }
}

export function formatTaskSessionDuration(durationSeconds: number) {
  return `${Math.max(1, Math.round(durationSeconds / 60))} دقيقة`;
}

export function formatTaskTimer(durationSeconds: number) {
  const safeSeconds = Math.max(0, durationSeconds);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function formatTaskSessionStartedAt(startedAt: string) {
  const sessionDate = new Date(startedAt);
  const now = new Date();

  const sessionLocal = new Date(
    sessionDate.getFullYear(),
    sessionDate.getMonth(),
    sessionDate.getDate(),
  );
  const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round(
    (nowLocal.getTime() - sessionLocal.getTime()) / (1000 * 60 * 60 * 24),
  );

  const timeLabel = new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(sessionDate);

  if (diffDays === 0) {
    return `اليوم، ${timeLabel}`;
  }

  if (diffDays === 1) {
    return `أمس، ${timeLabel}`;
  }

  if (diffDays === 2) {
    return `أول أمس، ${timeLabel}`;
  }

  const weekday = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
  }).format(sessionDate);

  return `${weekday}، ${timeLabel}`;
}

export function buildTaskSessionStats(sessions: TaskSessionItem[]) {
  const totalFocusMinutes = Math.max(
    0,
    Math.round(
      sessions.reduce((total, session) => total + session.durationSeconds, 0) / 60,
    ),
  );
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(
    (session) => session.status === "completed",
  ).length;

  return {
    totalFocusMinutes,
    totalSessions,
    completedSessions,
  };
}
