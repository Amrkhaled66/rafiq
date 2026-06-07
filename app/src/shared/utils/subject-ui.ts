import type Ionicons from "@expo/vector-icons/Ionicons";

const SUBJECT_UI = {
  math: {
    label: "رياضيات",
    icon: "calculator-outline",
    iconBackgroundColor: "#F3E8FF",
    iconColor: "#8B5CF6",
  },
  chemistry: {
    label: "كيمياء",
    icon: "flask-outline",
    iconBackgroundColor: "#DBEAFE",
    iconColor: "#2563EB",
  },
  history: {
    label: "تاريخ",
    icon: "reader-outline",
    iconBackgroundColor: "#DCFCE7",
    iconColor: "#16A34A",
  },
  arabic: {
    label: "اللغة العربية",
    icon: "book-outline",
    iconBackgroundColor: "#FFEDD5",
    iconColor: "#EA580C",
  },
  physics: {
    label: "فيزياء",
    icon: "flask-outline",
    iconBackgroundColor: "#CCFBF1",
    iconColor: "#0F766E",
  },
  biology: {
    label: "أحياء",
    icon: "leaf-outline",
    iconBackgroundColor: "#ECFCCB",
    iconColor: "#65A30D",
  },
  english: {
    label: "إنجليزي",
    icon: "language-outline",
    iconBackgroundColor: "#FCE7F3",
    iconColor: "#DB2777",
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
