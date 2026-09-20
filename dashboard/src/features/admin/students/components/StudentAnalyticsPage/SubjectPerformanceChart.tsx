import type { ChartConfiguration } from "chart.js";

import type { StudentSubjectPerformancePoint } from "@/features/admin/students/services/studentService";
import AnalyticsChart from "./AnalyticsChart";
import { getSubjectLabel } from "./studentAnalyticsUtils";

export default function SubjectPerformanceChart({
  data,
}: {
  data: StudentSubjectPerformancePoint[];
}) {
  const config: ChartConfiguration = {
    type: "bar",
    data: {
      labels: data.map((point) => getSubjectLabel(point.subject)),
      datasets: [
        {
          label: "مكتملة",
          data: data.map((point) => point.completedTasks),
          backgroundColor: "#16a34a",
          borderRadius: 6,
        },
        {
          label: "قيد التنفيذ",
          data: data.map((point) => point.inProgressTasks),
          backgroundColor: "#f59e0b",
          borderRadius: 6,
        },
        {
          label: "متبقية",
          data: data.map((point) => point.pendingTasks),
          backgroundColor: "#2563eb",
          borderRadius: 6,
        },
        {
          label: "فائتة",
          data: data.map((point) => point.missedTasks),
          backgroundColor: "#dc2626",
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true },
        },
        tooltip: {
          rtl: true,
          textDirection: "rtl",
          callbacks: {
            afterBody(items) {
              const index = items[0]?.dataIndex ?? 0;
              return `نسبة الإنجاز: ${data[index]?.completionRate ?? 0}%`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: { color: "#64748b", maxRotation: 0 },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: { color: "#64748b", precision: 0 },
          grid: { color: "rgba(148, 163, 184, 0.24)" },
          border: { display: false },
        },
      },
    },
  };

  return <AnalyticsChart config={config} ariaLabel="أداء الطالب حسب المادة" />;
}
