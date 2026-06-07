import { Image, View, useWindowDimensions } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

import tomato from "@assets/images/tomato.png";
import tomatoHead from "@assets/images/tomato-head.png";
import { formatTaskTimer } from "@/features/tasks/utils/task-session-ui";
import { AppText } from "@/shared/ui/app-text";

type CircularTimerProps = {
  durationSeconds: number;
  remainingSeconds: number;
  progress: number;
};

const TIMER_COLORS = {
  title: "#321334",
  muted: "#5F4B61",
  red: "#EF233C",
  orange: "#FF6B1A",
  track: "#FFE2E2",
};

export function CircularTimer({
  durationSeconds,
  remainingSeconds,
  progress,
}: CircularTimerProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const size = isTablet ? 286 : 246;
  const strokeWidth = isTablet ? 16 : 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const headWidth = isTablet ? 70 : 59;
  const headHeight = isTablet ? 58 : 50;
  const headTop = isTablet ? 2 : 4;
  const svgTop = isTablet ? 28 : 24;
  const contentTop = isTablet ? 84 : 72;
  const tomatoSize = isTablet ? 40 : 34;
  const labelFontSize = isTablet ? 15 : 13;
  const labelLineHeight = isTablet ? 20 : 18;
  const timerWidth = isTablet ? 220 : 190;
  const timerFontSize = isTablet ? 62 : 54;
  const timerLineHeight = isTablet ? 76 : 68;
  const subLabelFontSize = isTablet ? 15 : 13;
  const subLabelLineHeight = isTablet ? 20 : 18;

  const safeProgress = Math.max(0, Math.min(1, progress));
  const dashOffset = circumference * (1 - safeProgress);

  const angle = safeProgress * 2 * Math.PI - Math.PI / 2;
  const dotX = size / 2 + radius * Math.cos(angle);
  const dotY = size / 2 + radius * Math.sin(angle);

  return (
    <View className="items-center justify-center">
      <View
        style={{
          width: size,
          height: size + (isTablet ? 18 : 12),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={tomatoHead}
          resizeMode="contain"
          style={{
            position: "absolute",
            top: headTop,
            width: headWidth,
            height: headHeight,
            zIndex: 5,
          }}
        />

        <Svg
          width={size}
          height={size}
          style={{ position: "absolute", top: svgTop }}
        >
          <Defs>
            <SvgLinearGradient id="timerGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={TIMER_COLORS.red} />
              <Stop offset="1" stopColor={TIMER_COLORS.orange} />
            </SvgLinearGradient>
          </Defs>

          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={TIMER_COLORS.track}
            strokeWidth={strokeWidth}
            fill="none"
          />

          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#timerGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
            fill="none"
          />

          {safeProgress > 0.01 ? (
            <Circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth / 2 + 1}
              fill={TIMER_COLORS.red}
            />
          ) : null}
        </Svg>

        <View
          style={{
            position: "absolute",
            top: contentTop,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={tomato}
            resizeMode="contain"
            style={{
              width: tomatoSize,
              height: tomatoSize,
              marginBottom: 4,
            }}
          />

          <AppText
            weight="medium"
            style={{
              color: TIMER_COLORS.muted,
              fontSize: labelFontSize,
              lineHeight: labelLineHeight,
              includeFontPadding: false,
              marginBottom: 4,
            }}
          >
            يلا بينا
          </AppText>

          <AppText
            weight="bold"
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              width: timerWidth,
              textAlign: "center",
              color: TIMER_COLORS.title,
              fontSize: timerFontSize,
              lineHeight: timerLineHeight,
              includeFontPadding: false,
            }}
          >
            {formatTaskTimer(remainingSeconds)}
          </AppText>

          <AppText
            weight="bold"
            style={{
              color: TIMER_COLORS.red,
              fontSize: subLabelFontSize,
              lineHeight: subLabelLineHeight,
              includeFontPadding: false,
              marginTop: -4,
            }}
          >
            من {formatTaskTimer(durationSeconds)}
          </AppText>
        </View>
      </View>
    </View>
  );
}
