import { router } from "expo-router";
import {
  RefreshControl,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { HomeHeader } from "@/features/home/components";
import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { Progress } from "@/features/home/components/Progress";
import { TodayLessons } from "@/features/home/components/TodayLessons";
import { TodayTasks } from "@/features/home/components/TodayTasks";
import { useStudentHome } from "@/features/home/queries/homeQueries";
import { mapStudentHomeToViewModel } from "@/features/home/utils/homeMappers";
import { FocusedStatusBar } from "@/shared/ui/focused-status-bar";

function getFirstName(fullName?: string | null) {
  if (!fullName) return "أحمد";
  return fullName.trim().split(/\s+/)[0] || "أحمد";
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { user } = useAuth();
  const { data, isLoading, isError, isRefetching, refetch } = useStudentHome();
  const home = data ? mapStudentHomeToViewModel(data) : null;
 console.log(data)
  return (
    <View className="bg-background flex-1">
      <FocusedStatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => void refetch()}
          />
        }
      >
        <HomeHeader firstName={getFirstName(user?.fullName)} />
        <View
          style={{
            paddingTop: isTablet ? 16 : 10,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: isTablet ? 28 : 18,
          }}
          className="w-full max-w-260 -translate-y-12 gap-4 self-center md:gap-6"
        >
          {isError ? (
            <HomeStateCard
              icon="alert-circle-outline"
              title="حصل مشكلة في تحميل الصفحة"
              description="مش قادرين نعرض بيانات الصفحة الرئيسية دلوقتي. حاول مرة تانية."
              actionLabel="إعادة المحاولة"
              onAction={() => void refetch()}
            />
          ) : (
            <>
              <Progress
                progress={home?.progress.progress ?? 0}
                completedCount={home?.progress.completedCount ?? 0}
                totalCount={home?.progress.totalCount ?? 0}
                isLoading={isLoading}
              />

              <View className="gap-6 md:gap-5">
                <View className="flex-1">
                  <TodayTasks tasks={home?.tasks ?? []} isLoading={isLoading} />
                </View>

                <View className="flex-1">
                  <TodayLessons
                    lessons={home?.lessons ?? []}
                    isLoading={isLoading}
                    onViewAll={() => router.push("/(tabs)/my-lessons")}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
