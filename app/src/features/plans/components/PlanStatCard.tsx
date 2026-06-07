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
      className="min-w-[31%] flex-1 rounded-3xl  px-4 py-4"
      style={{
        backgroundColor,
        borderColor,
        borderWidth: 1,
      }}
    >
      <View className={`gap-3 items-center text-center mx-auto w-fit ${dir.itemsAlign}`}>
        <View
          className="size-11 mx-auto items-center justify-center rounded-2xl"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>

        <View className={`gap-1  ${dir.itemsAlign}`}>
          <AppText className="text-sm" tone="muted" weight="semibold">
            {title}
          </AppText>
          <AppText className="text-2xl mx-auto leading-7.5" weight="bold">
            {value}
          </AppText>
          {/* <AppText className="text-xs mx-auto text-nowrap!" tone="muted" weight="medium">
            {subtitle}
          </AppText> */}
        </View>
      </View>
    </View>
  );
}
