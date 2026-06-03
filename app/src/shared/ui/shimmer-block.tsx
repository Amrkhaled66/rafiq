import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ShimmerBlockProps = {
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor?: string;
  style?: ViewStyle;
};

export function ShimmerBlock({
  width,
  height,
  borderRadius,
  backgroundColor = "#EEF1F4",
  style,
}: ShimmerBlockProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [progress]);

  const shimmerWidth = Math.max(width * 0.55, 56);
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerWidth, width + shimmerWidth],
  });

  return (
    <View
      className="overflow-hidden"
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    >
      <Animated.View
        className="absolute inset-y-0"
        style={{
          width: shimmerWidth,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.72)",
            "rgba(255,255,255,0)",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
