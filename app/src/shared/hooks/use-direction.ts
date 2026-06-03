import { useI18n } from "@/shared/i18n/I18nProvider";

export function useDirection() {
  const { isRTL } = useI18n();

  return {
    isRTL,
    row: isRTL ? "flex-row" : "flex-row-reverse",
    rowReverse: isRTL ? "flex-row-reverse" : "flex-row",
    textAlign: isRTL ? "text-right" : "text-left",
    itemsAlign: isRTL ? "items-end" : "items-start",
    marginStart3: isRTL ? "mr-3" : "ml-3",
    marginEnd3: isRTL ? "ml-3" : "mr-3",
  };
}
