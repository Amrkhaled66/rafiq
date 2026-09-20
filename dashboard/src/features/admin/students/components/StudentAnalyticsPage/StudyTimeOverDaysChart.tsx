import type { ChartConfiguration } from "chart.js";

import type { StudentStudyTimeDailyPoint } from "@/features/admin/students/services/studentService";
import { formatDateArShort } from "@/shared/utils/dates";
import AnalyticsChart from "./AnalyticsChart";
import { formatStudyMinutes } from "./studentAnalyticsUtils";

export default function StudyTimeOverDaysChart({
  data,
}: {
  data: StudentStudyTimeDailyPoint[];
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
          label: "وقت المذاكرة",
          data: data.map((point) => point.totalStudyMinutes),
          borderColor: "#7c3aed",
          backgroundColor: "rgba(124, 58, 237, 0.14)",
          borderWidth: 3,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#7c3aed",
          pointBorderWidth: 3,
          pointHoverBackgroundColor: "#7c3aed",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 3,
          pointHoverRadius: 7,
          pointRadius: 5,
          tension: 0.35,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          rtl: true,
          textDirection: "rtl",
          displayColors: false,
          callbacks: {
            title(items) {
              const index = items[0]?.dataIndex ?? 0;
              return formatDateArShort(data[index]?.date ?? "");
            },
            label(item) {
              return formatStudyMinutes(Number(item.raw ?? 0));
            },
            afterLabel(item) {
              const point = data[item.dataIndex];
              return `عدد الجلسات: ${point?.sessionsCount ?? 0}`;
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
          grace: "8%",
          ticks: { color: "#64748b", precision: 0 },
          grid: { color: "rgba(148, 163, 184, 0.24)" },
          border: { display: false },
          title: {
            display: true,
            text: "الدقائق",
            color: "#64748b",
          },
        },
      },
    },
  };

  return (
    <AnalyticsChart config={config} ariaLabel="إجمالي وقت المذاكرة اليومي" />
  );
}
