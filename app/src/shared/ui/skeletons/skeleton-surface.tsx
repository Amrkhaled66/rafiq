import type { ReactNode } from "react";
import { View } from "react-native";

type SkeletonSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function SkeletonSurface({
  children,
  className = "",
}: SkeletonSurfaceProps) {
  return (
    <View
      className={`rounded-[28px] border border-card-border bg-card ${className}`}
      style={{
        shadowColor: "#000",
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
