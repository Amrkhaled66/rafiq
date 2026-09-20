import type { ChartConfiguration } from "chart.js";

import type { StudentStudyTimeBySubjectPoint } from "@/features/admin/students/services/studentService";
import AnalyticsChart from "./AnalyticsChart";
import {
  formatStudyMinutes,
  getSubjectLabel,
} from "./studentAnalyticsUtils";

export default function StudyTimeBySubjectChart({
  data,
}: {
  data: StudentStudyTimeBySubjectPoint[];
}) {
  const config: ChartConfiguration = {
    type: "bar",
    data: {
      labels: data.map((point) => getSubjectLabel(point.subject)),
      datasets: [
        {
          label: "وقت المذاكرة",
          data: data.map((point) => point.totalStudyMinutes),
          backgroundColor: "#7c3aed",
          borderRadius: 8,
          barThickness: 22,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          rtl: true,
          textDirection: "rtl",
          displayColors: false,
          callbacks: {
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
          beginAtZero: true,
          ticks: { color: "#64748b", precision: 0 },
          grid: { color: "rgba(148, 163, 184, 0.24)" },
          border: { display: false },
          title: {
            display: true,
            text: "الدقائق",
            color: "#64748b",
          },
        },
        y: {
          grid: { display: false },
          ticks: { color: "#64748b" },
        },
      },
    },
  };

  return <AnalyticsChart config={config} ariaLabel="وقت المذاكرة حسب المادة" />;
}
