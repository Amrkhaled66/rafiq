import { Image, View, useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

import authBg from "@assets/images/auth-bg.webp";
import { useAppTheme } from "@/shared/theme/appearance-provider";

export default function LoginHeader() {
  const { width } = useWindowDimensions();
  const { effectiveColorScheme } = useAppTheme();
  const isDark = effectiveColorScheme === "dark";
  return (
    <View className="relative h-[45%] overflow-hidden bg-red-700 sm:h-[50%]">
      <Image source={authBg} resizeMode="cover" className="h-full w-full" />

      {/* White curved shape */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: -1,
          left: 0,
          right: 0,
          height: 70,
        }}
      >
        <Svg
          width={width}
          height={70}
          viewBox={`0 0 ${width} 70`}
          preserveAspectRatio="none"
        >
          <Path
            d={`
              M0 50
              C ${width * 0.18} 18, ${width * 0.32} 50, ${width * 0.5} 25
              C ${width * 0.68} 5, ${width * 0.82} 50, ${width} 50
              L ${width} 70
              L 0 70
              Z
            `}
            fill={isDark ? "#1a1a1a" : "#fff"}
          />
        </Svg>
      </View>
    </View>
  );
}
