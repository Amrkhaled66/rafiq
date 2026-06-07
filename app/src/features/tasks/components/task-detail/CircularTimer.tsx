import { Image, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

import { formatTaskTimer } from "@/features/tasks/utils/task-session-ui";
import { AppText } from "@/shared/ui/app-text";
import tomato from "@assets/images/tomato.png";
import tomatoHead from "@assets/images/tomato-head.png";
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
  const size = 246;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

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
          height: size + 12,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Tomato leaves above the circle */}
        <Image
          source={tomatoHead}
          resizeMode="contain"
          style={{
            position: "absolute",
            top: 4,
            width: 59,
            height: 50,
            zIndex: 5,
          }}
        />

        <Svg
          width={size}
          height={size}
          style={{ position: "absolute", top: 24 }}
        >
          <Defs>
            <SvgLinearGradient id="timerGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={TIMER_COLORS.red} />
              <Stop offset="1" stopColor={TIMER_COLORS.orange} />
            </SvgLinearGradient>
          </Defs>

          {/* Background track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={TIMER_COLORS.track}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Active progress */}
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

          {/* Progress dot */}
          {safeProgress > 0.01 ? (
            <Circle
              cx={dotX}
              cy={dotY}
              r={strokeWidth / 2 + 1}
              fill={TIMER_COLORS.red}
            />
          ) : null}
        </Svg>

        {/* Center content */}
        <View
          style={{
            position: "absolute",
            top: 72,
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
              width: 34,
              height: 34,
              marginBottom: 4,
            }}
          />

          <AppText
            weight="medium"
            style={{
              color: TIMER_COLORS.muted,
              fontSize: 13,
              lineHeight: 18,
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
              width: 190,
              textAlign: "center",
              color: TIMER_COLORS.title,
              fontSize: 54,
              lineHeight: 68,
              includeFontPadding: false,
            }}
          >
            {formatTaskTimer(remainingSeconds)}
          </AppText>

          <AppText
            weight="bold"
            style={{
              color: TIMER_COLORS.red,
              fontSize: 13,
              lineHeight: 18,
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
