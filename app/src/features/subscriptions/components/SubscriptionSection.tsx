import { View } from "react-native";

import type { SubscriptionItem } from "@/features/subscriptions/types";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type SubscriptionSectionProps = {
  subscriptions: SubscriptionItem[];
};

export function SubscriptionSection({
  subscriptions,
}: SubscriptionSectionProps) {
  const dir = useDirection();

  return (
    <View className={`items-center justify-between ${dir.rowReverse}`}>
      <AppText className="text-lg md:text-xl" weight="bold">
        اشتراكاتي
      </AppText>

      <View className="rounded-full bg-brand-primary-soft/50 px-3 py-1">
        <AppText className="text-xs md:text-sm text-brand-primary!" weight="semibold">
          {subscriptions.length} اشتراكات
        </AppText>
      </View>
    </View>
  );
}

