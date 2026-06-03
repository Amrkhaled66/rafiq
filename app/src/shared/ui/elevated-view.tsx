import { type ReactNode } from "react";
import { Platform, type StyleProp, type ViewStyle, View } from "react-native";

type ElevatedViewProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  androidElevation?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: {
    width: number;
    height: number;
  };
};

export function ElevatedView({
  children,
  className,
  style,
  androidElevation = 2,
  shadowColor = "#000000",
  shadowOpacity = 0.1,
  shadowRadius = 10,
  shadowOffset = { width: 0, height: 10 },
}: ElevatedViewProps) {
  const platformShadow: ViewStyle = Platform.select({
    android: {
      elevation: androidElevation,
    },
    ios: {
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
    },
    default: {
      shadowColor,
      shadowOffset,
      shadowOpacity,
      shadowRadius,
    },
  }) as ViewStyle;

  return (
    <View className={className} style={[platformShadow, style]}>
      {children}
    </View>
  );
}
