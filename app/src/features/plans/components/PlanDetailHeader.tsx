import { View } from "react-native";

import { PlanDetailHeaderSkeleton } from "@/features/plans/components/skeletons";
import { BackButton } from "@/shared/ui/back-button";
import { AppText } from "@/shared/ui/app-text";
import { PageTitle } from "@/shared/ui/page-title";

type PlanDetailHeaderProps = {
  title: string;
  dateRangeLabel: string;
  isLoading?: boolean;
};

export function PlanDetailHeader({
  title,
  dateRangeLabel,
  isLoading = false,
}: PlanDetailHeaderProps) {

  if (isLoading) {
    return <PlanDetailHeaderSkeleton />;
  }

  return (
    <View className="relative items-center gap-2 md:gap-2.5">
      <View className="absolute inset-e-0 top-2 md:top-2.5 ">
        <BackButton />
      </View>
      <PageTitle title={title} />
      <AppText className="text-sm md:text-[15px]" tone="muted" weight="medium">
        {dateRangeLabel}
      </AppText>
    </View>
  );
}
