import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

export function PlanEmptyDayCard() {
  const dir = useDirection();

  return (
    <View
      className="border-card-border bg-card rounded-3xl border px-4 py-5 md:px-5 md:py-6"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className={`items-center gap-3 md:gap-3.5 ${dir.rowReverse}`}>
        <View className="bg-brand-primary-soft h-11 w-11 items-center justify-center rounded-2xl md:h-12 md:w-12">
          <Ionicons
            name="calendar-clear-outline"
            size={21}
            color={Colors.light.tint}
          />
        </View>
        <AppText
          className="flex-1 text-sm md:text-[15px]"
          tone="muted"
          weight="medium"
        >
          مفيش مهام مضافة لليوم ده
        </AppText>
      </View>
    </View>
  );
}
