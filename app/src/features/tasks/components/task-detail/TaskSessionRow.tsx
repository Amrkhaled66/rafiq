import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

import type { TaskSessionItem } from "@/features/tasks/types";
import {
  formatTaskSessionDuration,
  formatTaskSessionStartedAt,
  getTaskSessionStatusAppearance,
} from "@/features/tasks/utils/task-session-ui";
import { AppText } from "@/shared/ui/app-text";
import { useAppTheme } from "@/shared/theme/appearance-provider";

type TaskSessionRowProps = {
  session: TaskSessionItem;
  index: number;
};

export function TaskSessionRow({ session, index }: TaskSessionRowProps) {
  const { colors } = useAppTheme();
  const appearance = getTaskSessionStatusAppearance(session.status, colors);

  return (
    <View
      className="border-card-border bg-card rounded-3xl border px-4 py-4 active:opacity-90 md:px-5 md:py-4.5"
      style={{
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      <View className="items-center gap-3 md:gap-3.5 flex-row">
        <View className="flex-1 gap-1 md:gap-1.5 items-start">
          <View className="items-center gap-2 md:gap-2.5 flex-row">
            <View
              className="h-9 w-9 items-center justify-center rounded-full md:h-10 md:w-10"
              style={{ backgroundColor: appearance.iconBackgroundColor }}
            >
              <Ionicons
                name={appearance.icon as React.ComponentProps<typeof Ionicons>["name"]}
                size={17}
                color={appearance.iconColor}
              />
            </View>

            <View className="flex-1 items-start">
              <AppText
                className="text-base md:text-[17px] "
                weight="bold"
              >
                {`الجلسة ${index + 1}`}
              </AppText>

              <AppText
                className="text-sm md:text-[15px] "
                tone="muted"
                weight="medium"
              >
                {formatTaskSessionStartedAt(session.startedAt)}
              </AppText>
            </View>
          </View>
        </View>
        <View className="items-center gap-1 px-1 md:gap-1.5 md:px-1.5">
          <AppText className="text-base md:text-[17px]" weight="bold">
            {formatTaskSessionDuration(session.durationSeconds)}
          </AppText>
          <AppText
            className="text-xs md:text-[13px]"
            tone="muted"
            weight="medium"
          >
            المدة
          </AppText>
        </View>
        <View className="items-start gap-2 md:gap-2.5">
          <View
            className="rounded-full px-3 py-1 md:px-3.5 md:py-1.5"
            style={{ backgroundColor: appearance.badgeBackgroundColor }}
          >
            <AppText
              className="text-[11px] md:text-[13px]"
              weight="semibold"
              style={{ color: appearance.badgeTextColor }}
            >
              {appearance.label}
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}
