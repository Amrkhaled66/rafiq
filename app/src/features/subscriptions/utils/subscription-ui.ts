import type {
  SubscriptionItem,
  SubscriptionStatus,
} from "@/features/subscriptions/types";
import { Colors, type AppPalette } from "@/shared/theme/theme";

const MONTH_NAMES_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export function getSubscriptionStatus(subscription: SubscriptionItem) {
  return subscription.status;
}

export function getSubscriptionStatusLabel(status: SubscriptionStatus) {
  switch (status) {
    case "active":
      return "نشط";
    case "upcoming":
      return "قادم";
    default:
      return "منتهي";
  }
}

export function getSubscriptionStatusAppearance(
  status: SubscriptionStatus,
  isActiveCard = false,
  palette: AppPalette = Colors.light,
) {
  const isDark = palette === Colors.dark;
  if (isActiveCard && status === "active") {
    return {
      badgeBackgroundColor: "#FFFFFF",
      badgeTextColor: "#5BB075",
      iconBackgroundColor: "rgba(255,255,255,0.18)",
      iconColor: "#FFFFFF",
      titleColor: "#FFFFFF",
      secondaryColor: "rgba(255,255,255,0.86)",
      chevronColor: "#FFFFFF",
      cardBackgroundColor: Colors.light.tint,
      cardBorderColor: Colors.light.tint,
    };
  }

  switch (status) {
    case "active":
      return {
        badgeBackgroundColor: palette.soft,
        badgeTextColor: palette.tint,
        iconBackgroundColor: palette.soft,
        iconColor: palette.tint,
        titleColor: palette.text,
        secondaryColor: palette.mutedText,
        chevronColor: palette.icon,
        cardBackgroundColor: palette.card,
        cardBorderColor: palette.border,
      };
    case "upcoming":
      return {
        badgeBackgroundColor: isDark ? "#4A3514" : "#FEF3C7",
        badgeTextColor: isDark ? "#FCD34D" : "#B45309",
        iconBackgroundColor: isDark ? "#4A3514" : "#FEF3C7",
        iconColor: isDark ? "#FCD34D" : "#B45309",
        titleColor: palette.text,
        secondaryColor: palette.mutedText,
        chevronColor: palette.icon,
        cardBackgroundColor: palette.card,
        cardBorderColor: palette.border,
      };
    default:
      return {
        badgeBackgroundColor: isDark ? "#342B2C" : "#F3F4F6",
        badgeTextColor: isDark ? "#BFAEB0" : "#6B7280",
        iconBackgroundColor: isDark ? "#342B2C" : "#F3F4F6",
        iconColor: isDark ? "#BFAEB0" : "#6B7280",
        titleColor: palette.text,
        secondaryColor: palette.mutedText,
        chevronColor: palette.icon,
        cardBackgroundColor: palette.card,
        cardBorderColor: palette.border,
      };
  }
}

export function formatSubscriptionDateRange(subscription: SubscriptionItem) {
  return `${formatArabicDate(subscription.startsAt)} - ${formatArabicDate(subscription.endsAt)}`;
}

export function formatArabicDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);

  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day} ${MONTH_NAMES_AR[month - 1]} ${year}`;
}

export function formatSubscriptionAmount(amountPaid: number) {
  return `${amountPaid} جنيه`;
}

export function getSubscriptionTitle(subscription: SubscriptionItem) {
  return subscription.packageName || `اشتراك #${subscription.id}`;
}
