import { formatDateArLong, getDayNameAr } from "@/shared/utils/dates";
import { normalizePhoneDigits } from "@/shared/utils/phone";

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
  return getDayNameAr(value);
}

export function normalizePhoneForWhatsapp(phone: string) {
  const digits = normalizePhoneDigits(phone);

  if (digits.startsWith("20")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `20${digits.slice(1)}`;
  }

  return digits;
}
