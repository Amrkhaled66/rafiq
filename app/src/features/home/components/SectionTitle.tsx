import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppHeading } from "@/shared/ui/app-text";

type SectionTitleProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export function SectionTitle({ title, icon }: SectionTitleProps) {
  const dir = useDirection();

  return (
    <View className={`items-center justify-end gap-2 ${dir.row}`}>
      <AppHeading>{title}</AppHeading>
      <View className="h-10 w-10 items-center justify-center rounded-full ">
        <Ionicons name={icon} size={20} color={Colors.light.tint} />
      </View>
    </View>
  );
}
