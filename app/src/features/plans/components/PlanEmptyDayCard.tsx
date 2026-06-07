import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

export function PlanEmptyDayCard() {
  const dir = useDirection();

  return (
    <View
      className="rounded-3xl border border-card-border bg-card px-4 py-5"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className={`items-center gap-3 ${dir.rowReverse}`}>
        <View className="h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary-soft">
          <Ionicons
            name="calendar-clear-outline"
            size={20}
            color={Colors.light.tint}
          />
        </View>
        <AppText className="flex-1 text-sm md:text-base" tone="muted" weight="medium">
          مفيش مهام مضافة لليوم ده
        </AppText>
      </View>
    </View>
  );
}
