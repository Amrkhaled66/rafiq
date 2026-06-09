import { router } from "expo-router";
import { useMemo, useState } from "react";
import { RefreshControl, View } from "react-native";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { CurrentPlanCard } from "@/features/plans/components/CurrentPlanCard";
import { PlanStatusFilterTabs } from "@/features/plans/components/PlanStatusFilterTabs";
import { PlansSection } from "@/features/plans/components/PlansSection";
import { useStudentPlans } from "@/features/plans/queries/planQueries";
import type { PlanStatusFilterKey, StudyPlan } from "@/features/plans/types";
import { mapStudentPlansToViewModel } from "@/features/plans/utils/planMappers";
import { formatArabicTodayDateLabel } from "@/features/plans/utils/plan-ui";
import { PageDateBadge } from "@/shared/ui/page-date-badge";
import { PageTitle } from "@/shared/ui/page-title";
import { TabPageLayout } from "@/shared/ui/tab-page-layout";

const LOADING_PLAN: StudyPlan = {
  id: 0,
  name: "",
  startsOn: "",
  endsOn: "",
  status: "active",
  icon: "calendar-outline",
};

export function PlansScreen() {
  const [selectedStatus, setSelectedStatus] =
    useState<PlanStatusFilterKey>("all");
  const { data, isLoading, isError, isRefetching, refetch } = useStudentPlans();
  const viewModel = data ? mapStudentPlansToViewModel(data) : null;
  const plans = viewModel?.plans ?? [];
  const dateLabel = useMemo(() => formatArabicTodayDateLabel(), []);

  const currentPlan = plans.find((plan) => plan.status === "active") ?? null;
  const visiblePlans =
    selectedStatus === "all"
      ? plans
      : plans.filter((plan) => plan.status === selectedStatus);

  const handlePlanPress = (plan: StudyPlan) => {
    router.push(`/plans/${plan.id}`);
  };

  if (isError) {
    return (
      <TabPageLayout>
        <View className="gap-4 md:gap-5">
          <PageTitle title="الخطط" />
          <HomeStateCard
            icon="alert-circle-outline"
            title="حصل مشكلة في تحميل الخطط"
            description="مش قادرين نعرض الخطط دلوقتي. حاول مرة تانية."
            actionLabel="إعادة المحاولة"
            onAction={() => void refetch()}
          />
        </View>
      </TabPageLayout>
    );
  }

  return (
    <TabPageLayout
      scrollProps={{
        refreshControl: (
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => void refetch()}
          />
        ),
      }}
    >
      <View className="gap-4 md:gap-5">
        <PageTitle title="الخطط" />
        <PageDateBadge dateLabel={dateLabel} />
        {isLoading || currentPlan ? (
          <CurrentPlanCard
            isLoading={isLoading}
            plan={currentPlan ?? LOADING_PLAN}
            onPress={handlePlanPress}
          />
        ) : null}
        <PlanStatusFilterTabs
          isLoading={isLoading}
          value={selectedStatus}
          onChange={setSelectedStatus}
        />
        <PlansSection
          isLoading={isLoading}
          plans={visiblePlans}
          onPlanPress={handlePlanPress}
        />
      </View>
    </TabPageLayout>
  );
}
