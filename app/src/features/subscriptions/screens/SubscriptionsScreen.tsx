import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import { SubscriptionCard } from "@/features/subscriptions/components/SubscriptionCard";
import { SubscriptionFilterTabs } from "@/features/subscriptions/components/SubscriptionFilterTabs";
import { SubscriptionSection } from "@/features/subscriptions/components/SubscriptionSection";
import {
  MOCK_SUBSCRIPTIONS,
  SUBSCRIPTIONS_REFERENCE_DATE,
} from "@/features/subscriptions/data/mock-subscriptions-data";
import type {
  SubscriptionFilterKey,
  SubscriptionItem,
} from "@/features/subscriptions/types";
import {
  formatArabicDate,
  getSubscriptionStatus,
} from "@/features/subscriptions/utils/subscription-ui";
import { BackButton } from "@/shared/ui/back-button";
import { AppText } from "@/shared/ui/app-text";
import { PageTitle } from "@/shared/ui/page-title";

function sortSubscriptions(items: SubscriptionItem[]) {
  const statusPriority = {
    active: 0,
    upcoming: 1,
    ended: 2,
    cancelled: 3,
  } as const;

  return [...items].sort((left, right) => {
    const leftStatus = getSubscriptionStatus(left);
    const rightStatus = getSubscriptionStatus(right);

    if (statusPriority[leftStatus] !== statusPriority[rightStatus]) {
      return statusPriority[leftStatus] - statusPriority[rightStatus];
    }

    return right.startsAt.localeCompare(left.startsAt);
  });
}

export function SubscriptionsScreen() {
  const isLoading = false;
  const [selectedStatus, setSelectedStatus] =
    useState<SubscriptionFilterKey>("all");

  const visibleSubscriptions = useMemo(() => {
    const filtered =
      selectedStatus === "all"
        ? MOCK_SUBSCRIPTIONS
        : MOCK_SUBSCRIPTIONS.filter(
            (subscription) =>
              getSubscriptionStatus(subscription) === selectedStatus,
          );

    return sortSubscriptions(filtered);
  }, [selectedStatus]);

  const handleSubscriptionPress = (_subscription: SubscriptionItem) => {
    // Placeholder until subscription details are implemented.
  };

  return (
    <FlatList<SubscriptionItem | number>
      data={isLoading ? [0, 1, 2] : visibleSubscriptions}
      keyExtractor={(item, index) =>
        typeof item === "number"
          ? `subscription-skeleton-${index}`
          : item.id.toString()
      }
      renderItem={({ item }) =>
        typeof item === "number" ? (
          <SubscriptionCard
            isLoading
            subscription={MOCK_SUBSCRIPTIONS[0]}
            isActive={false}
          />
        ) : (
          <SubscriptionCard
            subscription={item}
            isActive={getSubscriptionStatus(item) === "active"}
            onPress={handleSubscriptionPress}
          />
        )
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 45,
        paddingBottom: 130,
        paddingHorizontal: 18,
        gap: 10,
      }}
      ListHeaderComponent={
        <View className="mb-4 gap-4">
          <View className="relative items-center gap-2">
            <View className="absolute top-0 left-0">
              <BackButton />
            </View>
            <PageTitle title="الاشتراكات" />
            <AppText
              className="text-sm md:text-base"
              tone="muted"
              weight="medium"
            >
              تابع حالة اشتراكاتك بسهولة
            </AppText>
          </View>

          <SubscriptionFilterTabs
            isLoading={isLoading}
            value={selectedStatus}
            onChange={setSelectedStatus}
          />

          <SubscriptionSection
            isLoading={isLoading}
            subscriptions={visibleSubscriptions}
          />
        </View>
      }
      ListEmptyComponent={
        isLoading ? null : (
          <View
            className="border-card-border bg-card items-center gap-3 rounded-3xl border px-5 py-7"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.04,
              shadowRadius: 10,
              elevation: 1,
            }}
          >
            <AppText className="text-base md:text-lg" weight="bold">
              لا توجد اشتراكات
            </AppText>
            <AppText
              className="text-center text-sm md:text-base"
              tone="muted"
              weight="medium"
            >
              {`لن تظهر هنا إلا الاشتراكات المتاحة حتى ${formatArabicDate(
                SUBSCRIPTIONS_REFERENCE_DATE,
              )}`}
            </AppText>
          </View>
        )
      }
    />
  );
}
