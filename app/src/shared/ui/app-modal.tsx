import { Modal, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/shared/ui/app-text";
import { useAppTheme } from "@/shared/theme/appearance-provider";

type AppModalProps = {
  visible: boolean;
  title: string;
  message: string;
  actionLabel?: string;
  onClose: () => void;
};

export function AppModal({
  visible,
  title,
  message,
  actionLabel = "حسنًا",
  onClose,
}: AppModalProps) {
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center px-6">
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: colors.overlay },
          ]}
        />
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="إغلاق النافذة"
        />

        <View className="w-full max-w-90 rounded-3xl bg-card px-6 py-6">
          <AppText className="text-2xl" weight="bold" align="center">
            {title}
          </AppText>
          <AppText
            className="mt-3 leading-7"
            tone="muted"
            weight="medium"
            align="center"
          >
            {message}
          </AppText>
          <Pressable
            onPress={onClose}
            className="bg-brand-primary mt-6 rounded-2xl py-3 active:opacity-90"
          >
            <AppText tone="inverse" weight="bold" align="center">
              {actionLabel}
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
