import { router } from "expo-router";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

import { useAuth } from "@/features/auth/context/AuthProvider";
import { HomeHeader } from "@/features/home/components";
import { HomeStateCard } from "@/features/home/components/HomeStateCard";
import { Progress } from "@/features/home/components/Progress";
import {
  TodayLessons,
} from "@/features/home/components/TodayLessons";
import type { LessonItem } from "@/features/home/components/TodayLessonCard";
import { TodayTasks } from "@/features/home/components/TodayTasks";
import type { TaskItem } from "@/features/home/components/TodayTaskCard";
import { useI18n } from "@/shared/i18n/I18nProvider";
// import { LOGO_XML } from "@/shared/ui/tab-page-header";

const TASKS: TaskItem[] = [
  {
    subject: "رياضيات",
    title: "حل واجب الدوال",
    icon: "calculator-outline",
    iconBackgroundClassName: "bg-[#F3E8FF]",
    iconColor: "#8B5CF6",
  },
  {
    subject: "كيمياء",
    title: "مراجعة الباب الثالث",
    icon: "flask-outline",
    iconBackgroundClassName: "bg-[#DBEAFE]",
    iconColor: "#2563EB",
  },
  {
    subject: "تاريخ",
    title: "تلخيص الوحدة الثانية",
    icon: "book-outline",
    iconBackgroundClassName: "bg-[#DCFCE7]",
    iconColor: "#16A34A",
  },
  {
    subject: "عربي",
    title: "تدريب على النصوص",
    icon: "language-outline",
    iconBackgroundClassName: "bg-[#FFEDD5]",
    iconColor: "#EA580C",
  },
  {
    subject: "فيزياء",
    title: "حل مسائل الحركة",
    icon: "speedometer-outline",
    iconBackgroundClassName: "bg-[#CCFBF1]",
    iconColor: "#0F766E",
  },
];

const LESSONS: LessonItem[] = [
  {
    subject: "الرياضيات",
    time: "9:00 ص",
    teacher: "أستاذ أحمد",
    icon: "calculator-outline",
    attended: true,
  },
  {
    subject: "الكيمياء",
    time: "11:30 ص",
    teacher: "أستاذة منى",
    icon: "flask-outline",
  },
  {
    subject: "اللغة العربية",
    time: "2:00 م",
    teacher: "أستاذ خالد",
    icon: "book-outline",
  },
];

type HomeProgress = {
  progress: number;
  completedCount: number;
  totalCount: number;
};

type HomeViewModel = {
  progress: HomeProgress;
  tasks: TaskItem[];
  lessons: LessonItem[];
  isLoadingProgress: boolean;
  isLoadingTasks: boolean;
  isLoadingLessons: boolean;
  isError: boolean;
  retry: () => void;
};

function useHomeViewModel(): HomeViewModel {
  return {
    progress: {
      progress: 40,
      completedCount: 3,
      totalCount: 7,
    },
    tasks: TASKS,
    lessons: LESSONS,
    isLoadingProgress: false,
    isLoadingTasks: false,
    isLoadingLessons: false,
    isError: false,
    retry: () => {},
  };
}

function getFirstName(fullName?: string | null) {
  if (!fullName) return "أحمد";
  return fullName.trim().split(/\s+/)[0] || "أحمد";
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isRTL } = useI18n();
  const isTablet = width >= 768;
  const { user } = useAuth();
  const {
    progress,
    tasks,
    lessons,
    isLoadingProgress,
    isLoadingTasks,
    isLoadingLessons,
    isError,
    retry,
  } = useHomeViewModel();

  return (
    <View className="bg-background flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        // contentContainerStyle={{

        // }}
      >
        <HomeHeader firstName={getFirstName(user?.fullName)} />
        <View
          style={{
            paddingTop: isTablet ? 16 : 10,
            paddingBottom: insets.bottom + 20,
            paddingHorizontal: isTablet ? 28 : 18,
          }}
          className="w-full max-w-260 -translate-y-12 gap-4 md:gap-6 self-center"
        >
          {isError ? (
            <HomeStateCard
              icon="alert-circle-outline"
              title="حصل مشكلة في تحميل الصفحة"
              description="مش قادرين نعرض بيانات الصفحة الرئيسية دلوقتي. حاول مرة تانية."
              actionLabel="إعادة المحاولة"
              onAction={retry}
            />
          ) : (
            <>
              <Progress
                progress={progress.progress}
                completedCount={progress.completedCount}
                totalCount={progress.totalCount}
                isLoading={isLoadingProgress}
              />

              <View className={`gap-6 md:gap-5`}>
                <View className="flex-1">
                  <TodayTasks tasks={tasks} isLoading={isLoadingTasks} />
                </View>

                <View className="flex-1">
                  <TodayLessons
                    lessons={lessons}
                    isLoading={isLoadingLessons}
                    onViewAll={() => router.push("/(tabs)/plans")}
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
