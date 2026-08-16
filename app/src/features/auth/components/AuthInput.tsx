import { Ionicons } from "@expo/vector-icons";
import {
  forwardRef,
  type ComponentProps,
  type ReactNode,
  useState,
} from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { AppFonts } from "@/shared/theme/theme";
import { useAppTheme } from "@/shared/theme/appearance-provider";

type AuthInputProps = Omit<TextInputProps, "style"> & {
  iconName: ComponentProps<typeof Ionicons>["name"];
  error?: string;
  label?: string;
  trailingElement?: ReactNode;
};

const AuthInput = forwardRef<TextInput, AuthInputProps>(function AuthInput(
  {
    error,
    iconName,
    label,
    trailingElement,
    className,
    onBlur,
    onFocus,
    ...props
  },
  ref,
) {
  const { language } = useI18n();
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = error
    ? colors.tint
    : isFocused
      ? colors.tint
      : colors.disabled;

  return (
    <View className="mx-auto w-[86%] max-w-[520px] gap-2 sm:w-[68%]">
      <View
        style={{
          borderBottomColor: borderColor,
          borderBottomWidth: 1,
        }}
        className="px-1 pb-2"
      >
        {label ? (
          <Text
            style={{
              fontFamily: AppFonts[language].medium,
              textAlign: language === "ar" ? "right" : "left",
            }}
            className="px-3 pb-1 text-sm text-muted-text sm:text-base"
          >
            {label}
          </Text>
        ) : null}
        <View className="flex-row items-center">
          <TextInput
            ref={ref}
            {...props}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            style={{
              flex: 1,
              color: colors.text,
              textAlign: language === "ar" ? "right" : "left",
              writingDirection: language === "ar" ? "rtl" : "ltr",
            }}
            placeholderTextColor={colors.icon}
            className={`px-3 py-3 text-base sm:py-4 sm:text-lg ${className ?? ""}`}
          />

          <Ionicons name={iconName} size={20} className="text-brand-primary" />
          {
            <View className=" absolute left-0 ">
              {trailingElement}
            </View>
          }
        </View>
      </View>
      {error ? (
        <Text
          style={{
            fontFamily: AppFonts[language].medium,
          }}
          className="text-brand-primary text-sm sm:text-base"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
});

export default AuthInput;
