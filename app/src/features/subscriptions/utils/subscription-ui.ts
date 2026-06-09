import type {
  SubscriptionItem,
  SubscriptionStatus,
} from "@/features/subscriptions/types";
import { Colors } from "@/shared/theme/theme";

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
) {
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
        badgeBackgroundColor: Colors.light.soft,
        badgeTextColor: Colors.light.tint,
        iconBackgroundColor: Colors.light.soft,
        iconColor: Colors.light.tint,
        titleColor: Colors.light.text,
        secondaryColor: Colors.light.icon,
        chevronColor: Colors.light.icon,
        cardBackgroundColor: Colors.light.card,
        cardBorderColor: Colors.light.border,
      };
    case "upcoming":
      return {
        badgeBackgroundColor: "#FEF3C7",
        badgeTextColor: "#B45309",
        iconBackgroundColor: "#FEF3C7",
        iconColor: "#B45309",
        titleColor: Colors.light.text,
        secondaryColor: Colors.light.icon,
        chevronColor: Colors.light.icon,
        cardBackgroundColor: Colors.light.card,
        cardBorderColor: Colors.light.border,
      };
    default:
      return {
        badgeBackgroundColor: "#F3F4F6",
        badgeTextColor: "#6B7280",
        iconBackgroundColor: "#F3F4F6",
        iconColor: "#6B7280",
        titleColor: Colors.light.text,
        secondaryColor: Colors.light.icon,
        chevronColor: Colors.light.icon,
        cardBackgroundColor: Colors.light.card,
        cardBorderColor: Colors.light.border,
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
