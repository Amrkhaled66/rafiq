import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { CurrentPlanCard } from "@/features/plans/components/CurrentPlanCard";
import { PlansSection } from "@/features/plans/components/PlansSection";
import { PlanStatusFilterTabs } from "@/features/plans/components/PlanStatusFilterTabs";
import { MOCK_PLANS, PLANS_DATE_LABEL } from "@/features/plans/data/mock-plans-data";
import type { PlanStatusFilterKey, StudyPlan } from "@/features/plans/types";
import { PageDateBadge } from "@/shared/ui/page-date-badge";
import { PageTitle } from "@/shared/ui/page-title";
import { TabPageLayout } from "@/shared/ui/tab-page-layout";

export function PlansScreen() {
  const plans = MOCK_PLANS;
  const [selectedStatus, setSelectedStatus] =
    useState<PlanStatusFilterKey>("all");

  const currentPlan = plans.find((plan) => plan.status === "active") ?? plans[0];
  const visiblePlans =
    selectedStatus === "all"
      ? plans
      : plans.filter((plan) => plan.status === selectedStatus);

  const handlePlanPress = (plan: StudyPlan) => {
    router.push(`/plans/${plan.id}`);
  };

  return (
    <TabPageLayout>
      <View className="gap-4 md:gap-5">
        <PageTitle title="الخطط" />
        <PageDateBadge dateLabel={PLANS_DATE_LABEL} />
        {currentPlan ? (
          <CurrentPlanCard plan={currentPlan} onPress={handlePlanPress} />
        ) : null}
        <PlanStatusFilterTabs
          value={selectedStatus}
          onChange={setSelectedStatus}
        />
        <PlansSection plans={visiblePlans} onPlanPress={handlePlanPress} />
      </View>
    </TabPageLayout>
  );
}
