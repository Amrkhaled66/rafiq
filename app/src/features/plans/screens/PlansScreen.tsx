import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  type LayoutChangeEvent,
} from "react-native";

import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { CurrentPlanCard } from "@/features/plans/components/CurrentPlanCard";
import { PlanStatusFilterTabs } from "@/features/plans/components/PlanStatusFilterTabs";
import { PlansPagination } from "@/features/plans/components/PlansPagination";
import { PlansSection } from "@/features/plans/components/PlansSection";
import {
  useStudentCurrentPlan,
  useStudentPlans,
} from "@/features/plans/queries/planQueries";
import type { PlanStatusFilterKey, StudyPlan } from "@/features/plans/types";
import { mapStudentPlansToViewModel } from "@/features/plans/utils/planMappers";
import { formatArabicTodayDateLabel } from "@/features/plans/utils/plan-ui";
import { PageDateBadge } from "@/shared/ui/page-date-badge";
import { PageTitle } from "@/shared/ui/page-title";
import { TabPageLayout } from "@/shared/ui/tab-page-layout";
import { useAppTheme } from "@/shared/theme/appearance-provider";

const PLANS_PAGE_SIZE = 10;

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
  const [page, setPage] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const plansSectionOffset = useRef(0);
  const { colors } = useAppTheme();
  const plansQuery = useStudentPlans({
    page,
    limit: PLANS_PAGE_SIZE,
    status: selectedStatus === "all" ? undefined : selectedStatus,
  });
  const currentPlanQuery = useStudentCurrentPlan();
  const viewModel = plansQuery.data
    ? mapStudentPlansToViewModel(plansQuery.data)
    : null;
  const currentPlanViewModel = currentPlanQuery.data
    ? mapStudentPlansToViewModel(currentPlanQuery.data)
    : null;
  const plans = viewModel?.plans ?? [];
  const dateLabel = useMemo(() => formatArabicTodayDateLabel(), []);
  const currentPlan = currentPlanViewModel?.plans[0] ?? null;
  const isInitialLoading = plansQuery.isLoading && !plansQuery.data;
  const isChangingPage =
    plansQuery.isFetching && plansQuery.isPlaceholderData;

  useEffect(() => {
    if (!viewModel) {
      return;
    }

    const lastAvailablePage = Math.max(1, viewModel.totalPages);

    if (page > lastAvailablePage) {
      setPage(lastAvailablePage);
    }
  }, [page, viewModel]);

  const handlePlanPress = (plan: StudyPlan) => {
    router.push(`/plans/${plan.id}`);
  };

  const scrollToPlans = () => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(0, plansSectionOffset.current - 12),
        animated: true,
      });
    });
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    scrollToPlans();
  };

  const handleStatusChange = (nextStatus: PlanStatusFilterKey) => {
    setSelectedStatus(nextStatus);
    setPage(1);
  };

  const handlePlansSectionLayout = (event: LayoutChangeEvent) => {
    plansSectionOffset.current = event.nativeEvent.layout.y + 45;
  };

  const handleRefresh = () => {
    setPage(1);
    void Promise.all([plansQuery.refetch(), currentPlanQuery.refetch()]);
  };

  if (plansQuery.isError && !plansQuery.data) {
    return (
      <TabPageLayout>
        <View className="gap-4 md:gap-5">
          <PageTitle title="الخطط" />
          <HomeStateCard
            icon="alert-circle-outline"
            title="حصل مشكلة في تحميل الخطط"
            description="مش قادرين نعرض الخطط دلوقتي. حاول مرة تانية."
            actionLabel="إعادة المحاولة"
            onAction={() => void plansQuery.refetch()}
          />
        </View>
      </TabPageLayout>
    );
  }

  return (
    <TabPageLayout
      scrollViewRef={scrollViewRef}
      scrollProps={{
        refreshControl: (
          <RefreshControl
            progressViewOffset={30}
            refreshing={
              (plansQuery.isRefetching || currentPlanQuery.isRefetching) &&
              !isInitialLoading
            }
            onRefresh={handleRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
            progressBackgroundColor={colors.card}
          />
        ),
      }}
    >
      <View className="gap-4 md:gap-5">
        <PageTitle title="الخطط" />
        <PageDateBadge dateLabel={dateLabel} />
        {currentPlanQuery.isLoading || currentPlan ? (
          <CurrentPlanCard
            isLoading={currentPlanQuery.isLoading}
            plan={currentPlan ?? LOADING_PLAN}
            onPress={handlePlanPress}
          />
        ) : null}
        <PlanStatusFilterTabs
          isLoading={isInitialLoading && selectedStatus === "all"}
          value={selectedStatus}
          onChange={handleStatusChange}
        />

        <View onLayout={handlePlansSectionLayout}>
          {plansQuery.isError ? (
            <HomeStateCard
              icon="alert-circle-outline"
              title="حصل مشكلة في تحميل الصفحة"
              description="تعذر تحميل هذه الصفحة من الخطط. حاول مرة تانية."
              actionLabel="إعادة المحاولة"
              onAction={() => void plansQuery.refetch()}
            />
          ) : (
            <View style={{ opacity: isChangingPage ? 0.62 : 1 }}>
              <PlansSection
                isLoading={isInitialLoading}
                plans={plans}
                totalPlans={viewModel?.total ?? 0}
                onPlanPress={handlePlanPress}
              />

              <PlansPagination
                currentPage={viewModel?.page ?? page}
                totalPages={viewModel?.totalPages ?? 0}
                isFetching={isChangingPage}
                onPageChange={handlePageChange}
              />
            </View>
          )}
        </View>
      </View>
    </TabPageLayout>
  );
}
