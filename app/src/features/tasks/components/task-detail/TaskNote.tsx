import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { TaskNoteSkeleton } from "@/features/tasks/components/task-detail/skeletons";
import { AppText } from "@/shared/ui/app-text";

type TaskNoteProps = {
  note?: string | null;
  isLoading?: boolean;
};

export function TaskNote({
  note,
  isLoading = false,
}: TaskNoteProps) {
  if (isLoading) {
    return <TaskNoteSkeleton />;
  }

  if (!note) return null;

  return (
    <View
      className="relative overflow-hidden rounded-3xl border bg-[#FFFDFB] px-5 py-4 md:px-6 md:py-5"
      style={{
        borderColor: "#FFE1D6",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
      }}
    >
      <View className="absolute left-5 top-6">
        <AppText className="text-lg text-[#FFC83D]!">✦</AppText>
      </View>

      <View className="absolute left-9 top-4">
        <AppText className="text-xs text-[#FFC83D]!">✧</AppText>
      </View>

      <View className="absolute left-7 top-10">
        <AppText className="text-xs text-[#FFC83D]!">✧</AppText>
      </View>

      <View className="items-end">
        <View className="mb-2 flex-row-reverse items-center gap-2 md:mb-2.5 md:gap-2.5">
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#F97316" />

          <AppText
            weight="bold"
            className="text-right text-base text-[#F97316] md:text-[17px]"
          >
            ملاحظات المهمة
          </AppText>
        </View>

        <AppText className="max-w-[82%] text-right text-base leading-7 text-[#3F2A3F] md:text-[17px] md:leading-8">
          {note}
        </AppText>
      </View>
    </View>
  );
}
