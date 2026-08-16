import type { ReactNode } from "react";
import { View } from "react-native";

import { useAppTheme } from "@/shared/theme/appearance-provider";

type SkeletonSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function SkeletonSurface({
  children,
  className = "",
}: SkeletonSurfaceProps) {
  const { colors } = useAppTheme();

  return (
    <View
      className={`rounded-[28px] border border-card-border bg-card ${className}`}
      style={{
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 1,
      }}
    >
      {children}
    </View>
  );
}
