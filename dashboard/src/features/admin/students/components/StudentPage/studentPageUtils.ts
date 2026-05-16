import { formatDateArLong, formatTimeAr } from "@/shared/utils/dates";

export function getStudentInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase();
}

export function formatStudentDate(value: string) {
  return formatDateArLong(value);
}

export function formatStudentTime(value: string) {
  return formatTimeAr(value);
}

export function normalizePhoneForWhatsapp(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("20")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `20${digits.slice(1)}`;
  }

  return digits;
}
