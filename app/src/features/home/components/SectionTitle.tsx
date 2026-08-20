import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { useAppTheme } from "@/shared/theme/appearance-provider";
import { AppHeading } from "@/shared/ui/app-text";

type SectionTitleProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export function SectionTitle({ title, icon }: SectionTitleProps) {
  const { colors } = useAppTheme();

  return (
    <View className="flex-row items-center gap-2">
      <View className="h-10 w-10 items-center justify-center rounded-full ">
        <Ionicons name={icon} size={20} color={colors.tint} />
      </View>
      <AppHeading>{title}</AppHeading>
    </View>
  );
}
