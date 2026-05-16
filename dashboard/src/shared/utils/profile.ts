import { formatDateArLong } from "@/shared/utils/dates";

export function getUserInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase();
}

export function formatProfileDate(value: string) {
  // Backward-compatible wrapper; prefer importing from `@/shared/utils/dates` in new code.
  return formatDateArLong(value);
}
