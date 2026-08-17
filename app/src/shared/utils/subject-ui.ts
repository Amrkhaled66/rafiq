import type Ionicons from "@expo/vector-icons/Ionicons";

const SUBJECT_UI = {
  arabic: {
    label: "لغة عربية",
    icon: "book-outline",
    iconBackgroundColor: "#FFEDD5",
    iconColor: "#EA580C",
  },
  english: {
    label: "انجليزي",
    icon: "language-outline",
    iconBackgroundColor: "#FCE7F3",
    iconColor: "#DB2777",
  },
  second_foreign_language: {
    label: "لغة أجنبية ثانية",
    icon: "globe-outline",
    iconBackgroundColor: "#E0F2FE",
    iconColor: "#0284C7",
  },
  math: {
    label: "رياضيات",
    icon: "calculator-outline",
    iconBackgroundColor: "#F3E8FF",
    iconColor: "#8B5CF6",
  },
  physics: {
    label: "فيزياء",
    icon: "flask-outline",
    iconBackgroundColor: "#CCFBF1",
    iconColor: "#0F766E",
  },
  chemistry: {
    label: "كيمياء",
    icon: "flask-outline",
    iconBackgroundColor: "#DBEAFE",
    iconColor: "#2563EB",
  },
  biology: {
    label: "أحياء",
    icon: "leaf-outline",
    iconBackgroundColor: "#ECFCCB",
    iconColor: "#65A30D",
  },
  history: {
    label: "تاريخ",
    icon: "reader-outline",
    iconBackgroundColor: "#DCFCE7",
    iconColor: "#16A34A",
  },
  geography: {
    label: "جغرافيا",
    icon: "map-outline",
    iconBackgroundColor: "#FEF3C7",
    iconColor: "#D97706",
  },
  statistics: {
    label: "إحصاء",
    icon: "stats-chart-outline",
    iconBackgroundColor: "#F0FDF4",
    iconColor: "#15803D",
  },
  religion: {
    label: "دين",
    icon: "moon-outline",
    iconBackgroundColor: "#FDF4FF",
    iconColor: "#A21CAF",
  },
  national_education: {
    label: "تربية وطنية",
    icon: "flag-outline",
    iconBackgroundColor: "#FEF2F2",
    iconColor: "#DC2626",
  },
} as const satisfies Record<
  string,
  {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconBackgroundColor: string;
    iconColor: string;
  }
>;

export type SchoolSubjectKey = keyof typeof SUBJECT_UI;

export function getSubjectUi(subject: string) {
  return SUBJECT_UI[subject as SchoolSubjectKey] ?? {
    label: subject,
    icon: "book-outline",
    iconBackgroundColor: "#F3F4F6",
    iconColor: "#6B7280",
  };
}
