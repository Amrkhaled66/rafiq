import type { LessonWeekday } from "@/features/admin/lessons/services/lessonService";
import { LESSON_WEEKDAY_ORDER } from "@/shared/const/weekdays";

export function formatDateArLong(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    // year: "numeric",
  }).format(new Date(value));
}

export function getDayNameAr(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
  }).format(new Date(value));
}

export function formatDateArShort(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateArShort2DigitDay(value: string) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTimeAr(value: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDateLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayWeekday(): LessonWeekday {
  const day = new Date().getDay() + 1;
  return LESSON_WEEKDAY_ORDER[day] as LessonWeekday;
}