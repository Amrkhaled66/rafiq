import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { View } from "react-native";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { PersonalInfoSheet } from "@/features/profile/components/PersonalInfoSheet";
import { ProfileActionCard } from "@/features/profile/components/ProfileActionCard";
import { ProfileHeroCard } from "@/features/profile/components/ProfileHeroCard";
import {
  ProfileSectionHeaderSkeleton,
} from "@/features/profile/components/skeletons";
import { SupportSectionCard } from "@/features/profile/components/SupportSectionCard";
import { PROFILE_FALLBACK } from "@/features/profile/data/mock-profile-data";
import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";
import { PageTitle } from "@/shared/ui/page-title";
import { TabPageLayout } from "@/shared/ui/tab-page-layout";

function getInitialFromName(fullName: string) {
  const trimmedName = fullName.trim();

  if (!trimmedName) {
    return "أ";
  }

  return trimmedName[0];
}

export function ProfileScreen() {
  const isLoading = false;
  const { user, logout } = useAuth();
  const dir = useDirection();
  const [isPersonalInfoVisible, setIsPersonalInfoVisible] = useState(false);

  const studentName = user?.fullName?.trim() || PROFILE_FALLBACK.fullName;
  const studentInitial = useMemo(
    () => getInitialFromName(studentName),
    [studentName],
  );

  const handleSubscriptionsPress = () => {
    router.push("/subscriptions");
  };

  const handleSupportPress = () => {
    // Placeholder until support flow is implemented.
  };

  return (
    <>
      <TabPageLayout>
        <View className="items-center gap-2">
          <PageTitle title="حسابي" />
          <AppText
            className="text-sm md:text-base"
            tone="muted"
            weight="medium"
          >
            بياناتك واشتراكك في رفيق
          </AppText>
        </View>

        <ProfileHeroCard
          isLoading={isLoading}
          fullName={studentName}
          gradeLabel={PROFILE_FALLBACK.gradeLabel}
          initial={studentInitial}
        />

        <View className="gap-3">
          {isLoading ? (
            <ProfileSectionHeaderSkeleton />
          ) : (
            <View className={`items-center ${dir.rowReverse}`}>
              <View className="size-10 items-center justify-center rounded-2xl">
                <Ionicons name="grid-outline" size={18} color="#D00507" />
              </View>
              <AppText className="text-lg md:text-xl" weight="bold">
                الخدمات
              </AppText>
            </View>
          )}

          <View className="gap-2.5">
            <ProfileActionCard
              isLoading={isLoading}
              title="البيانات الشخصية"
              icon="person-outline"
              onPress={() => setIsPersonalInfoVisible(true)}
            />
            <ProfileActionCard
              isLoading={isLoading}
              title="الاشتراكات"
              icon="card-outline"
              onPress={handleSubscriptionsPress}
            />
          </View>
        </View>

        <View className="gap-3">
          {isLoading ? (
            <ProfileSectionHeaderSkeleton />
          ) : (
            <View className={`items-center ${dir.rowReverse}`}>
              <View className="size-10 items-center justify-center rounded-2xl">
                <Ionicons name="settings-outline" size={18} color="#D00507" />
              </View>
              <AppText className="text-lg md:text-xl" weight="bold">
                الدعم والحساب
              </AppText>
            </View>
          )}

          <SupportSectionCard
            isLoading={isLoading}
            onSupportPress={handleSupportPress}
            onLogoutPress={() => void logout()}
          />
        </View>
      </TabPageLayout>

      <PersonalInfoSheet
        visible={isPersonalInfoVisible}
        onClose={() => setIsPersonalInfoVisible(false)}
        phone={user?.phone || PROFILE_FALLBACK.phone}
        city={PROFILE_FALLBACK.city}
        parentPhone={PROFILE_FALLBACK.parentPhone}
        studyStage={PROFILE_FALLBACK.studyStage}
      />
    </>
  );
}
