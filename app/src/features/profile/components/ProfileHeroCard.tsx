import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";
import { Ionicons } from "@expo/vector-icons";

type ProfileHeroCardProps = {
  fullName: string;
  gradeLabel: string;
  initial: string;
};

export function ProfileHeroCard({
  fullName,
  gradeLabel,
  initial,
}: ProfileHeroCardProps) {
  const dir = useDirection();

  return (
    <LinearGradient
      colors={["#D00507", "#B10C0F", "#8F0D10"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="overflow-hidden rounded-[30px]"
      style={{
        shadowColor: "#7F1D1D",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 18,
        elevation: 5,
        borderRadius: 30,
      }}
    >
      <View className="absolute top-8 -left-8 h-28 w-28 rounded-full bg-white/10" />
      <View className="absolute top-6 right-8 h-16 w-16 rounded-full bg-white/10" />
      <View className="absolute -bottom-12 left-16 h-36 w-36 rounded-full bg-white/10" />
      <View className="absolute right-24 bottom-8 h-20 w-20 rounded-full border border-white/15" />
      <View className="absolute -right-10 bottom-8 h-40 w-40 rotate-12 rounded-[36px] border border-white/10" />
      <View className="absolute top-5 left-6 h-28 w-28 -rotate-12 rounded-4xl border border-white/10" />

      <View className="px-5 py-6">
        <View className={`items-center gap-5 ${dir.rowReverse}`}>
          <View className="h-29.5 w-29.5 items-center justify-center rounded-full bg-white/95">
            <AppText
              className="text-brand-primary! text-[48px] leading-[56px]"
              weight="bold"
              align="center"
            >
              {initial}
            </AppText>
          </View>

          <View className={`flex-1 gap-3 ${dir.itemsAlign}`}>
            <AppText
              className={`text-2xl leading-[32px] ${dir.textAlign}`}
              tone="inverse"
              weight="bold"
              numberOfLines={1}
            >
              {fullName}
            </AppText>

            <View className="rounded-full bg-white/16 px-4 py-2">
              <View className={`items-center gap-2 ${dir.rowReverse}`}>
                <Ionicons name="school-outline" size={17} color="#FFFFFF" />

                <AppText className="text-sm" tone="inverse" weight="semibold">
                  {gradeLabel}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
