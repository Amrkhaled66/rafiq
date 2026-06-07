import { View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";
import { BackButton } from "@/shared/ui/back-button";
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
    <View className="relative items-center gap-2">
      <View className={`absolute left-0 top-2 ${dir.isRTL ? "" : ""}`}>
        <BackButton />
      </View>
      <PageTitle title={title} />
      <AppText className="text-sm md:text-base" tone="muted" weight="medium">
        {dateRangeLabel}
      </AppText>
    </View>
  );
}
