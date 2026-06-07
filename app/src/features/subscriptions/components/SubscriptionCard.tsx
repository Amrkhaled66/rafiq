import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import type { SubscriptionItem } from "@/features/subscriptions/types";
import {
  formatSubscriptionAmount,
  formatSubscriptionDateRange,
  getSubscriptionStatus,
  getSubscriptionStatusAppearance,
  getSubscriptionStatusLabel,
  getSubscriptionTitle,
} from "@/features/subscriptions/utils/subscription-ui";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type SubscriptionCardProps = {
  subscription: SubscriptionItem;
  isActive: boolean;
  onPress?: (subscription: SubscriptionItem) => void;
};

export function SubscriptionCard({
  subscription,
  isActive,
  onPress,
}: SubscriptionCardProps) {
  const dir = useDirection();
  const status = getSubscriptionStatus(subscription);
  const appearance = getSubscriptionStatusAppearance(status, isActive);

  return (
    <Pressable
      className="rounded-3xl px-4 py-4 active:opacity-90"
      onPress={() => onPress?.(subscription)}
      style={{
        backgroundColor: appearance.cardBackgroundColor,
        borderColor: appearance.cardBorderColor,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isActive ? 0.08 : 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className={`items-start gap-3 ${dir.rowReverse}`}>
        <View
          className="size-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: appearance.iconBackgroundColor }}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={appearance.iconColor}
          />
        </View>

        <View className={`flex-1 gap-2 ${dir.itemsAlign}`}>
          <View
            className={`items-center justify-between gap-2 ${dir.rowReverse}`}
          >
            <AppText
              className={`flex-1 text-base md:text-lg ${dir.textAlign}`}
              weight="bold"
              style={{ color: appearance.titleColor }}
              numberOfLines={1}
            >
              {getSubscriptionTitle(subscription)}
            </AppText>

            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: appearance.badgeBackgroundColor }}
            >
              <AppText
                className="text-[11px] md:text-xs"
                weight="semibold"
                style={{ color: appearance.badgeTextColor }}
              >
                {getSubscriptionStatusLabel(status)}
              </AppText>
            </View>
          </View>

          <AppText
            className={`text-sm md:text-base ${dir.textAlign}`}
            weight="medium"
            style={{ color: appearance.secondaryColor }}
          >
            {formatSubscriptionDateRange(subscription)}
          </AppText>

          <View className="flex-row items-center gap-1">
            <AppText
              className={`text-sm md:text-base ${dir.textAlign}`}
              weight="medium"
              style={{ color: appearance.secondaryColor }}
            >
              {formatSubscriptionAmount(subscription.amountPaid)}
            </AppText>
            <Ionicons
              style={{ color: appearance.secondaryColor }}
              name="wallet-outline"
            />
          </View>

          {subscription.cancelledAt && subscription.cancellationReason ? (
            <AppText
              className={`text-sm ${dir.textAlign}`}
              weight="semibold"
              style={{ color: "#DC2626" }}
            >
              {`سبب الإلغاء: ${subscription.cancellationReason}`}
            </AppText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
