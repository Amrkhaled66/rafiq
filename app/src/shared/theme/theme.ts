import { Platform } from "react-native";

const brandPrimary = "#d00507";
const brandPrimarySoft = "#f6dcdd";
const brandPrimaryHover = "#8f0d10";
const subTitle = "#6b6b6b";

export const Colors = {
  light: {
    text: "#171717",
    background: "#f8f7f5",
    tint: brandPrimary,
    icon: subTitle,
    tabIconDefault: subTitle,
    tabIconSelected: brandPrimary,
    card: "#ffffff",
    border: "rgba(208, 5, 7, 0.12)",
    soft: brandPrimarySoft,
  },
  dark: {
    text: "#f5f5f5",
    background: "#14090a",
    tint: "#ffb2b3",
    icon: "#d2a6a7",
    tabIconDefault: "#d2a6a7",
    tabIconSelected: "#ffb2b3",
    card: "#231112",
    border: "rgba(239, 169, 171, 0.18)",
    soft: brandPrimaryHover,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "'Avenir Next', Avenir, 'Segoe UI', sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace",
  },
});

export const AppFonts = {
  ar: {
    // regular: "IBMPlexSansArabic_400Regular",
    // medium: "IBMPlexSansArabic_500Medium",
    // semibold: "IBMPlexSansArabic_600SemiBold",
    // bold: "IBMPlexSansArabic_700Bold",
     regular: "Cairo_400Regular",
    medium: "Cairo_500Medium",
    semibold: "Cairo_600SemiBold",
    bold: "Cairo_700Bold",
  },
  en: {
    regular: "Cairo_400Regular",
    medium: "Cairo_500Medium",
    semibold: "Cairo_600SemiBold",
    bold: "Cairo_700Bold",
  },
} as const;
