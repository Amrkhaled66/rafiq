import type { ChartConfiguration } from "chart.js";

import type { StudentTaskCompletionTrendPoint } from "@/features/admin/students/services/studentService";
import { formatDateArShort } from "@/shared/utils/dates";
import AnalyticsChart from "./AnalyticsChart";

export default function TaskCompletionTrendChart({
  data,
}: {
  data: StudentTaskCompletionTrendPoint[];
}) {
  const config: ChartConfiguration = {
    type: "line",
    data: {
      labels: data.map((point) =>
        new Intl.DateTimeFormat("ar-EG", {
          day: "numeric",
          month: "short",
        }).format(new Date(point.date)),
      ),
      datasets: [
        {
          label: "إجمالي المهام",
          data: data.map((point) => point.totalTasks),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.1)",
          borderWidth: 3,
          pointRadius: 4,
          tension: 0.35,
          fill: true,
        },
        {
          label: "المهام المكتملة",
          data: data.map((point) => point.completedTasks),
          borderColor: "#16a34a",
          backgroundColor: "rgba(22, 163, 74, 0.08)",
          borderWidth: 3,
          pointRadius: 4,
          tension: 0.35,
        },
        {
          label: "المهام الفائتة",
          data: data.map((point) => point.missedTasks),
          borderColor: "#dc2626",
          backgroundColor: "rgba(220, 38, 38, 0.08)",
          borderWidth: 3,
          pointRadius: 4,
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true },
        },
        tooltip: {
          rtl: true,
          textDirection: "rtl",
          callbacks: {
            title(items) {
              const index = items[0]?.dataIndex ?? 0;
              return formatDateArShort(data[index]?.date ?? "");
            },
            afterBody(items) {
              const index = items[0]?.dataIndex ?? 0;
              return `نسبة الإنجاز: ${data[index]?.completionRate ?? 0}%`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#64748b", maxRotation: 0, maxTicksLimit: 10 },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#64748b", precision: 0 },
          grid: { color: "rgba(148, 163, 184, 0.24)" },
          border: { display: false },
        },
      },
    },
  };

  return <AnalyticsChart config={config} ariaLabel="اتجاه إنجاز المهام" />;
}
