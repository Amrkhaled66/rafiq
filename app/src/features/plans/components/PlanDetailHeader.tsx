import { View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { BackButton } from "@/shared/ui/back-button";
import { AppText } from "@/shared/ui/app-text";
import { PageTitle } from "@/shared/ui/page-title";

type PlanDetailHeaderProps = {
  title: string;
  dateRangeLabel: string;
};

export function PlanDetailHeader({
  title,
  dateRangeLabel,
}: PlanDetailHeaderProps) {
  const dir = useDirection();

  return (
    <View className="relative items-center gap-2 md:gap-2.5">
      <View className={`absolute left-0 top-2 md:top-2.5 ${dir.isRTL ? "" : ""}`}>
        <BackButton />
      </View>
      <PageTitle title={title} />
      <AppText className="text-sm md:text-[15px]" tone="muted" weight="medium">
        {dateRangeLabel}
      </AppText>
    </View>
  );
}
