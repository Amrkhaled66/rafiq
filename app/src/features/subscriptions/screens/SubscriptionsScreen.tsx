import { useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { SubscriptionCard } from "@/features/subscriptions/components/SubscriptionCard";
import { SubscriptionFilterTabs } from "@/features/subscriptions/components/SubscriptionFilterTabs";
import { SubscriptionSection } from "@/features/subscriptions/components/SubscriptionSection";
import { useStudentSubscriptions } from "@/features/subscriptions/queries/subscriptionQueries";
import type {
  SubscriptionFilterKey,
  SubscriptionItem,
} from "@/features/subscriptions/types";
import { BackButton } from "@/shared/ui/back-button";
import { AppText } from "@/shared/ui/app-text";
import { PageTitle } from "@/shared/ui/page-title";

function sortSubscriptions(items: SubscriptionItem[]) {
  const statusPriority = {
    active: 0,
    upcoming: 1,
    ended: 2,
  } as const;

  return [...items].sort((left, right) => {
    if (statusPriority[left.status] !== statusPriority[right.status]) {
      return statusPriority[left.status] - statusPriority[right.status];
    }

    return right.startsAt.localeCompare(left.startsAt);
  });
}

export function SubscriptionsScreen() {
  const [selectedStatus, setSelectedStatus] =
    useState<SubscriptionFilterKey>("all");
  const { data, isLoading, isError, isRefetching, refetch } =
    useStudentSubscriptions();

  const visibleSubscriptions = useMemo(() => {
    const items = data?.items ?? [];
    const filtered =
      selectedStatus === "all"
        ? items
        : items.filter((subscription) => subscription.status === selectedStatus);

    return sortSubscriptions(filtered);
  }, [data?.items, selectedStatus]);

  const handleSubscriptionPress = (_subscription: SubscriptionItem) => {
    // Placeholder until subscription details are implemented.
  };

  if (isError) {
    return (
      <View className="bg-background flex-1 px-[18px] pt-[45px]">
        <View className="gap-4">
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

          <HomeStateCard
            icon="alert-circle-outline"
            title="حصل مشكلة في تحميل الاشتراكات"
            description="مش قادرين نعرض الاشتراكات دلوقتي. حاول مرة تانية."
            actionLabel="إعادة المحاولة"
            onAction={() => void refetch()}
          />
        </View>
      </View>
    );
  }

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
            subscription={{
              id: 0,
              studentId: 0,
              packageId: 0,
              packageName: "",
              startsAt: "",
              endsAt: "",
              amountPaid: 0,
              status: "active",
              createdAt: "",
              updatedAt: "",
            }}
            isActive={false}
          />
        ) : (
          <SubscriptionCard
            subscription={item}
            isActive={item.status === "active"}
            onPress={handleSubscriptionPress}
          />
        )
      }
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching && !isLoading}
          onRefresh={() => void refetch()}
        />
      }
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
              لن تظهر هنا إلا الاشتراكات المتاحة للطالب الحالي.
            </AppText>
          </View>
        )
      }
    />
  );
}
