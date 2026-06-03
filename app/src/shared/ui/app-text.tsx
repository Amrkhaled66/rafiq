import { type ReactNode } from "react";
import { Text, type TextProps } from "react-native";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { AppFonts, Colors } from "@/shared/theme/theme";

type TextTone = "default" | "muted" | "tint" | "inverse";
type TextWeight = "regular" | "medium" | "semibold" | "bold";
type TextAlign = "auto" | "left" | "right" | "center";

type BaseTextProps = TextProps & {
  children?: ReactNode;
  className?: string;
  tone?: TextTone;
  weight?: TextWeight;
  align?: TextAlign;
};

function resolveColor(tone: TextTone) {
  switch (tone) {
    case "muted":
      return Colors.light.icon;
    case "tint":
      return Colors.light.tint;
    case "inverse":
      return "#ffffff";
    default:
      return Colors.light.text;
  }
}

function resolveFont(weight: TextWeight, language: "ar" | "en") {
  const currentFont = AppFonts[language];

  switch (weight) {
    case "medium":
      return currentFont.medium;
    case "semibold":
      return currentFont.semibold;
    case "bold":
      return currentFont.bold;
    default:
      return currentFont.regular;
  }
}

export function AppText({
  className,
  tone = "default",
  weight = "regular",
  align = "auto",
  style,
  ...props
}: BaseTextProps) {
  const { isRTL, language } = useI18n();
  const textAlign =
    align === "auto" ? (isRTL ? "right" : "left") : align;

  return (
    <Text
      className={className}
      style={[
        {
          color: resolveColor(tone),
          fontFamily: resolveFont(weight, language),
          textAlign,
          writingDirection: isRTL ? "rtl" : "ltr",
        },
        style,
      ]}
      {...props}
    />
  );
}

type VariantProps = Omit<BaseTextProps, "weight">;

export function AppHeading({
  className,
  tone = "default",
  ...props
}: VariantProps) {
  return (
    <AppText
      className={["text-lg md:text-xl", className].filter(Boolean).join(" ")}
      tone={tone}
      weight="bold"
      {...props}
    />
  );
}

export function AppCaption({
  className,
  tone = "muted",
  ...props
}: VariantProps) {
  return (
    <AppText
      className={["text-sm md:text-base", className].filter(Boolean).join(" ")}
      tone={tone}
      weight="medium"
      {...props}
    />
  );
}
