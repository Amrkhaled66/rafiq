import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/shared/ui/app-text";

type TaskNoteProps = {
  note?: string | null;
};

export function TaskNote({ note }: TaskNoteProps) {
  if (!note) return null;

  return (
    <View
      className="relative overflow-hidden rounded-3xl border bg-[#FFFDFB] px-5 py-4"
      style={{
        borderColor: "#FFE1D6",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
    >
      {/* Left sparkles */}
      <View className="absolute top-6 left-5">
        <AppText className="text-lg text-[#FFC83D]!">✦</AppText>
      </View>

      <View className="absolute top-4 left-9">
        <AppText className="text-xs text-[#FFC83D]!">✧</AppText>
      </View>

      <View className="absolute top-10 left-7">
        <AppText className="text-xs text-[#FFC83D]!">✧</AppText>
      </View>

      {/* Content */}
      <View className="items-end">
        <View className="mb-2 flex-row-reverse items-center gap-2">
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#F97316" />

          <AppText
            weight="bold"
            className="text-right text-base text-[#F97316]"
          >
            ملاحظات المهمة 
          </AppText>
        </View>

        <AppText className="max-w-[82%] text-right text-base leading-7 text-[#3F2A3F]">
          {note}
        </AppText>
      </View>
    </View>
  );
}
