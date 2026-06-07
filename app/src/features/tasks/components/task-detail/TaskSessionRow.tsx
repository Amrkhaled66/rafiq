import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

import type { TaskSessionItem } from "@/features/tasks/types";
import {
  formatTaskSessionDuration,
  formatTaskSessionStartedAt,
  getTaskSessionStatusAppearance,
} from "@/features/tasks/utils/task-session-ui";
import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type TaskSessionRowProps = {
  session: TaskSessionItem;
  index: number;
  onPress?: (session: TaskSessionItem) => void;
};

export function TaskSessionRow({
  session,
  index,
  onPress,
}: TaskSessionRowProps) {
  const dir = useDirection();
  const appearance = getTaskSessionStatusAppearance(session.status);

  return (
    <Pressable
      className="rounded-3xl border border-card-border bg-card px-4 py-4 active:opacity-90"
      onPress={() => onPress?.(session)}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className={`items-center gap-3 ${dir.rowReverse}`}>
        <View className={`flex-1 gap-1 ${dir.itemsAlign}`}>
          <View className={`items-center gap-2 ${dir.rowReverse}`}>
            <View
              className="h-9 w-9 items-center justify-center rounded-full"
              style={{ backgroundColor: appearance.iconBackgroundColor }}
            >
              <Ionicons
                name={appearance.icon}
                size={16}
                color={appearance.iconColor}
              />
            </View>
            <View className={`flex-1 ${dir.itemsAlign}`}>
              <AppText className={`text-base ${dir.textAlign}`} weight="bold">
                {`الجلسة ${index}`}
              </AppText>
              <AppText
                className={`text-sm ${dir.textAlign}`}
                tone="muted"
                weight="medium"
              >
                {formatTaskSessionStartedAt(session.startedAt)}
              </AppText>
            </View>
          </View>
        </View>

        <View className="items-center gap-1 px-1">
          <AppText className="text-base" weight="bold">
            {formatTaskSessionDuration(session.durationSeconds)}
          </AppText>
          <AppText className="text-xs" tone="muted" weight="medium">
            المدة
          </AppText>
        </View>

        <View className="items-end gap-2">
          <View
            className="rounded-full px-3 py-1"
            style={{ backgroundColor: appearance.badgeBackgroundColor }}
          >
            <AppText
              className="text-[11px]"
              weight="semibold"
              style={{ color: appearance.badgeTextColor }}
            >
              {appearance.label}
            </AppText>
          </View>
          <Ionicons
            name={dir.isRTL ? "chevron-back" : "chevron-forward"}
            size={18}
            color={Colors.light.icon}
          />
        </View>
      </View>
    </Pressable>
  );
}
