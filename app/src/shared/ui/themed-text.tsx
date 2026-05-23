import { StyleSheet, Text, type TextProps } from "react-native";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { AppFonts, Colors, Fonts } from "@/shared/theme/theme";
import { useThemeColor } from "@/shared/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "eyebrow" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const linkColor = useThemeColor(
    { light: Colors.light.tint, dark: Colors.dark.tint },
    "tint",
  );
  const { isRTL, language } = useI18n();
  const currentFont = AppFonts[language];

  return (
    <Text
      style={[
        {
          color,
          textAlign: isRTL ? "right" : "left",
          writingDirection: isRTL ? "rtl" : "ltr",
        },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "eyebrow" ? styles.eyebrow : undefined,
        type === "link" ? [styles.link, { color: linkColor }] : undefined,
        type === "default" ? { fontFamily: currentFont.regular } : undefined,
        type === "title" ? { fontFamily: currentFont.bold } : undefined,
        type === "defaultSemiBold"
          ? { fontFamily: currentFont.semibold }
          : undefined,
        type === "subtitle" ? { fontFamily: currentFont.bold } : undefined,
        type === "eyebrow" ? { fontFamily: currentFont.bold } : undefined,
        type === "link" ? { fontFamily: currentFont.medium } : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.sans,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: Fonts.sans,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 42,
    fontFamily: Fonts.sans,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
    fontFamily: Fonts.sans,
  },
  eyebrow: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontFamily: Fonts.mono,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontFamily: Fonts.sans,
  },
});
