import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Colors } from "@/shared/theme/theme";
import { AppCaption, AppText } from "@/shared/ui/app-text";
type ProgressRingProps = {
  progress: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
};

export function ProgressRing({
  progress,
  label,
  size = 110,
  strokeWidth = 12,
}: ProgressRingProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset =
    circumference - (circumference * normalizedProgress) / 100;
  const percentageFontSize = size >= 132 ? 28 : 24;
  const labelFontSize = size >= 132 ? 13 : 12;

  return (
    <View className="items-center justify-center">
      <View
        className="items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Svg width={size} height={size} style={{ position: "absolute" }}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F0F1F3"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.light.tint}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        <AppText
          className="text-center"
          style={{ fontSize: percentageFontSize }}
          weight="bold"
          align="center"
        >
          {normalizedProgress}%
        </AppText>

        {label ? (
          <AppCaption
            className="text-center"
            style={{ fontSize: labelFontSize }}
            align="center"
          >
            {label}
          </AppCaption>
        ) : null}
      </View>
    </View>
  );
}
