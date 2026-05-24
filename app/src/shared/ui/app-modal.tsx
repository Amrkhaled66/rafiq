import { Modal, Pressable, Text, View } from "react-native";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { AppFonts } from "@/shared/theme/theme";

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
  const { language } = useI18n();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/45 px-6">
        <View className="w-full max-w-90 rounded-3xl bg-white px-6 py-6">
          <Text
            style={{ fontFamily: AppFonts[language].bold }}
            className="text-center text-2xl text-[#171717]"
          >
            {title}
          </Text>
          <Text
            style={{ fontFamily: AppFonts[language].medium }}
            className="mt-3 text-center leading-7 text-[#6b6b6b]"
          >
            {message}
          </Text>
          <Pressable
            onPress={onClose}
            className="bg-brand-primary mt-6 rounded-2xl py-3 active:opacity-90"
          >
            <Text
              style={{ fontFamily: AppFonts[language].bold }}
              className="text-center text-white"
            >
              {actionLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
