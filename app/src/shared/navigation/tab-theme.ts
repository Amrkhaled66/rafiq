import { AppFonts, Colors } from "@/shared/theme/theme";

type ColorScheme = "light" | "dark";

type FontSet = (typeof AppFonts)["ar"] | (typeof AppFonts)["en"];

export function getTabTheme(colorScheme: ColorScheme, fonts: FontSet) {
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const tintColor = palette.tint;
  const labelColor = palette.text;
  const indicatorColor =
    colorScheme === "dark" ? "rgba(255,255,255,0.16)" : "rgba(143,13,16,0.14)";
  const backgroundColor = palette.card;

  return {
    tintColor,
    labelColor,
    indicatorColor,
    backgroundColor,
    nativeLabelStyle: {
      default: {
        color: labelColor,
        fontSize: 10,
        fontFamily: fonts.semibold,
      },
      selected: {
        color: tintColor,
        fontSize: 10,
        fontFamily: fonts.bold,
      },
    },
    nativeTitlePositionAdjustment: {
      vertical: 6,
    },
  };
}
