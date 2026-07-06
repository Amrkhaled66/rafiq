import {
  ImageBackground,
  Image,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { useI18n } from "@/shared/i18n/I18nProvider";
import { AppFonts } from "@/shared/theme/theme";

import heroBg from "@assets/images/hero-bg.png";
import logoWhite from "@assets/images/logoWhite.png";

type HomeHeaderProps = {
  firstName: string;
};

function HeaderCurve({
  width,
  height = 54,
}: {
  width: number;
  height?: number;
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "absolute",
        bottom: -1,
        left: 0,
        zIndex: 5,
      }}
    >
      <Path
        d={`
    M 0 ${height * 0.66}
    C ${width * 0.12} ${height * 0.9},
      ${width * 0.22} ${height},
      ${width * 0.35} ${height}
    L ${width * 0.65} ${height}
    C ${width * 0.78} ${height},
      ${width * 0.88} ${height * 0.9},
      ${width} ${height * 0.66}
    L ${width} ${height}
    L 0 ${height}
    Z
  `}
        fill="#FFFFFF"
      />
    </Svg>
  );
}

export function HomeHeader({ firstName }: HomeHeaderProps) {
  const { isRTL, language } = useI18n();
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const headerHeight = isTablet ? 300 : 240;
  const curveHeight = isTablet ? 70 : 56;
  const textAlign = isRTL ? "right" : "left";

  return (
    <View
      className="overflow-hidden"
      style={{
        height: headerHeight,
        backgroundColor: "#A60F12",
        position: "relative",
      }}
    >
      <ImageBackground
        source={heroBg}
        resizeMode="cover"
        className="flex-1"
        imageStyle={{
          width: "100%",
          height: "100%",
        }}
      >
        <View className="flex-1 px-6 pt-12">
          {/* Top row */}
          <View className="flex-row-reverse items-center justify-between">
            {/* Logo mark */}
            <View className="items-center justify-center">
              <Image
                source={logoWhite}
                resizeMode="contain"
                style={{ width: 36, height: 36 }}
              />
            </View>

            {/* Notification */}
            {/* <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#111827"
              />

              <View className="absolute top-2 right-2 h-3 w-3 rounded-full bg-[#A60F12]" />
            </View> */}
          </View>

          {/* Text */}
          <View className="mt-7 items-end">
            <Text
              style={{
                fontFamily: AppFonts[language].medium,
                textAlign,
                fontSize: isTablet ? 22 : 18,
                lineHeight: isTablet ? 34 : 28,
                color: "#FFFFFF",
              }}
            >
              صباح الخير يا {firstName} 👋
            </Text>

            <Text
              style={{
                fontFamily: AppFonts[language].bold,
                textAlign,
                fontSize: isTablet ? 44 : 30,
                lineHeight: isTablet ? 58 : 46,
                color: "#FFFFFF",
              }}
              className="mt-2"
            >
             يلا نخلص اللي ورانا 
            </Text>

            {/* <Text
              style={{
                fontFamily: AppFonts[language].medium,
                textAlign,
                fontSize: isTablet ? 20 : 16,
                lineHeight: isTablet ? 32 : 26,
                color: "#FFFFFF",
              }}
              className="mt-2 opacity-90"
            >
              كل خطوة صغيرة بتقربك من هدفك ✨
            </Text> */}
          </View>
        </View>

        <HeaderCurve width={width} height={curveHeight} />
      </ImageBackground>
    </View>
  );
}
