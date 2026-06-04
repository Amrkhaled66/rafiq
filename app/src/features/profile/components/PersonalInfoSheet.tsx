import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { Colors } from "@/shared/theme/theme";
import { AppText } from "@/shared/ui/app-text";

type PersonalInfoSheetProps = {
  visible: boolean;
  onClose: () => void;
  phone: string;
  city: string;
  parentPhone: string;
  studyStage: string;
};

type InfoRowProps = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
};

function InfoRow({ label, value, icon }: InfoRowProps) {
  const dir = useDirection();

  return (
    <View className={`items-center gap-3 ${dir.rowReverse}`}>
      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-brand-primary-soft">
        <Ionicons name={icon} size={18} color={Colors.light.tint} />
      </View>

      <View className="flex-1">
        <AppText className="text-xs" tone="muted" weight="semibold">
          {label}
        </AppText>
        <AppText className="mt-0.5 text-base md:text-lg" weight="bold">
          {value}
        </AppText>
      </View>
    </View>
  );
}

export function PersonalInfoSheet({
  visible,
  onClose,
  phone,
  city,
  parentPhone,
  studyStage,
}: PersonalInfoSheetProps) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(320)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 320,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShouldRender(false);
      }
    });
  }, [overlayOpacity, sheetTranslateY, visible]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={shouldRender}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            styles.overlay,
            { opacity: overlayOpacity },
          ]}
        />
        <Pressable className="flex-1" onPress={onClose} />

        <Animated.View
          className="rounded-t-4xl bg-card px-5 pb-8 pt-4"
          style={{ transform: [{ translateY: sheetTranslateY }] }}
        >
          <View className="mb-4 items-center">
            <View className="h-1.5 w-14 rounded-full bg-card-border" />
          </View>

          <View className="mb-5 gap-1">
            <AppText className="text-xl" weight="bold" align="center">
              البيانات الشخصية
            </AppText>
            <AppText className="text-sm" tone="muted" weight="medium" align="center">
              معلوماتك الأساسية داخل رفيق
            </AppText>
          </View>

          <View className="gap-4">
            <InfoRow label="رقم الهاتف" value={phone} icon="call-outline" />
            <InfoRow label="المدينة" value={city} icon="location-outline" />
            <InfoRow
              label="رقم ولي الأمر"
              value={parentPhone}
              icon="people-outline"
            />
            <InfoRow
              label="المرحلة الدراسية"
              value={studyStage}
              icon="school-outline"
            />
          </View>

          <Pressable
            className="mt-6 rounded-2xl bg-brand-primary py-3.5 active:opacity-90"
            onPress={onClose}
          >
            <AppText className="text-white" tone="inverse" weight="bold" align="center">
              إغلاق
            </AppText>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
});
