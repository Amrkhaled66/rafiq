import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { AppText } from "@/shared/ui/app-text";
import { useAppTheme } from "@/shared/theme/appearance-provider";

type AppModalProps = {
  visible: boolean;
  title: string;
  message: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  isActionLoading?: boolean;
  errorMessage?: string | null;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  onClose: () => void;
};

export function AppModal({
  visible,
  title,
  message,
  actionLabel = "حسنًا",
  secondaryActionLabel,
  isActionLoading = false,
  errorMessage,
  onAction,
  onSecondaryAction,
  onClose,
}: AppModalProps) {
  const { colors } = useAppTheme();
  const handleClose = () => {
    if (!isActionLoading) onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
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
          disabled={isActionLoading}
          onPress={handleClose}
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
          {errorMessage ? (
            <AppText
              className="mt-3 text-sm"
              weight="medium"
              align="center"
              style={{ color: "#DC2626" }}
            >
              {errorMessage}
            </AppText>
          ) : null}

          <View className="mt-6 flex-row gap-3">
            {secondaryActionLabel ? (
              <Pressable
                disabled={isActionLoading}
                onPress={onSecondaryAction ?? handleClose}
                className="border-card-border flex-1 rounded-2xl border py-3 active:opacity-80 disabled:opacity-60"
              >
                <AppText className="text-nowrap" weight="bold" align="center">
                  {secondaryActionLabel}
                </AppText>
              </Pressable>
            ) : null}

            <Pressable
              disabled={isActionLoading}
              onPress={onAction ?? handleClose}
              className="bg-brand-primary min-h-12 flex-1 items-center justify-center rounded-2xl px-3 py-3 active:opacity-90 disabled:opacity-70"
            >
              {isActionLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <AppText className="text-nowrap"  tone="inverse" weight="bold" align="center">
                  {actionLabel}
                </AppText>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
