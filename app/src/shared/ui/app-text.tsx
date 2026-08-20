import { type ReactNode } from "react";
import { Text, type TextProps } from "react-native";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { AppFonts, type AppPalette } from "@/shared/theme/theme";
import { useAppTheme } from "@/shared/theme/appearance-provider";

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

function resolveColor(tone: TextTone, colors: AppPalette) {
  switch (tone) {
    case "muted":
      return colors.mutedText;
    case "tint":
      return colors.tint;
    case "inverse":
      return "#ffffff";
    default:
      return colors.text;
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
  const { language } = useI18n();
  const { colors } = useAppTheme();
  return (
    <Text
      className={className}
      style={[
        {
          color: resolveColor(tone, colors),
          fontFamily: resolveFont(weight, language),
          textAlign: align,
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
