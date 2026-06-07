import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type PlanStatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  borderColor: string;
  iconBackgroundColor: string;
  iconColor: string;
};

export function PlanStatCard({
  title,
  value,
  subtitle,
  icon,
  backgroundColor,
  borderColor,
  iconBackgroundColor,
  iconColor,
}: PlanStatCardProps) {
  const dir = useDirection();

  return (
    <View
      className="min-w-[31%] flex-1 rounded-3xl px-4 py-4 md:px-5 md:py-5"
      style={{
        backgroundColor,
        borderColor,
        borderWidth: 1,
      }}
    >
      <View className={`mx-auto w-fit items-center gap-3 md:gap-3.5 ${dir.itemsAlign}`}>
        <View
          className="mx-auto size-11 items-center justify-center rounded-2xl md:size-12"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Ionicons name={icon} size={21} color={iconColor} />
        </View>

        <View className={`gap-1 md:gap-1.5 ${dir.itemsAlign}`}>
          <AppText className="text-sm md:text-[15px]" tone="muted" weight="semibold">
            {title}
          </AppText>
          <AppText className="mx-auto text-2xl leading-7.5 md:text-[28px] md:leading-8" weight="bold">
            {value}
          </AppText>
        </View>
      </View>
    </View>
  );
}
