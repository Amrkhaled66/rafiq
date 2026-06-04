import { View } from "react-native";

import { PROFILE_DATE_LABEL } from "@/features/profile/data/mock-profile-data";
import { PageDateBadge } from "@/shared/ui/page-date-badge";
import { PageTitle } from "@/shared/ui/page-title";
import { TabPageLayout } from "@/shared/ui/tab-page-layout";
import { AppText } from "@/shared/ui/app-text";

export function SubscriptionsScreen() {
  return (
    <TabPageLayout>
      <PageTitle title="الاشتراكات" />
      <PageDateBadge dateLabel={PROFILE_DATE_LABEL} />

      <View
        className="rounded-[28px] border border-card-border bg-card px-5 py-5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        <AppText className="text-lg md:text-xl" weight="bold">
          صفحة الاشتراكات
        </AppText>
        <AppText className="mt-2 text-sm md:text-base" tone="muted" weight="medium">
          ستظهر هنا باقاتك الحالية والسابقة وتفاصيل الاشتراك قريبًا.
        </AppText>
      </View>
    </TabPageLayout>
  );
}
