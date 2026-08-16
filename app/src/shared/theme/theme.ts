import { Platform } from "react-native";

const brandPrimary = "#d00507";
const brandPrimarySoft = "#f6dcdd";
const subTitle = "#6b6b6b";

export const Colors = {
  light: {
    text: "#171717",
    mutedText: "#6b6b6b",
    background: "#f8f7f5",
    tint: brandPrimary,
    icon: subTitle,
    tabIconDefault: subTitle,
    tabIconSelected: brandPrimary,
    card: "#ffffff",
    surfaceElevated: "#ffffff",
    input: "#fafafa",
    border: "rgba(208, 5, 7, 0.12)",
    divider: "#ece4e4",
    soft: brandPrimarySoft,
    overlay: "rgba(0, 0, 0, 0.4)",
    shadow: "#000000",
    disabled: "#d1d5db",
  },
  dark: {
    text: "#f8eeee",
    mutedText: "#c8aaab",
    background: "#14090a",
    tint: "#ffb2b3",
    icon: "#d2a6a7",
    tabIconDefault: "#d2a6a7",
    tabIconSelected: "#ffb2b3",
    card: "#1a1a1a",
    surfaceElevated: "#2d1718",
    input: "#1c0e0f",
    border: "rgba(239, 169, 171, 0.18)",
    divider: "#432426",
    soft: "#3a1618",
    overlay: "rgba(0, 0, 0, 0.68)",
    shadow: "#000000",
    disabled: "#59484a",
  },
};

export type AppColorScheme = keyof typeof Colors;
export type AppPalette = (typeof Colors)[AppColorScheme];

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
    bold: "Cairo_800ExtraBold",
  },
  en: {
    regular: "Cairo_400Regular",
    medium: "Cairo_500Medium",
    semibold: "Cairo_600SemiBold",
    bold: "Cairo_800ExtraBold",
  },
} as const;
