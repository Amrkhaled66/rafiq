import { type ComponentProps, type ReactNode } from "react";
import { type StyleProp, type ViewStyle, View } from "react-native";

import { SectionTitle } from "@/features/home/components/SectionTitle";
import { useDirection } from "@/shared/hooks/use-direction";
import { ElevatedView } from "@/shared/ui/elevated-view";

type HomePageSectionProps = {
  title: string;
  icon: ComponentProps<typeof SectionTitle>["icon"];
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  style?: StyleProp<ViewStyle>;
};

export function HomePageSection({
  title,
  icon,
  children,
  action,
  className,
  contentClassName = "gap-4",
  style,
}: HomePageSectionProps) {
  const dir = useDirection();

  return (
    <ElevatedView
      className={`rounded-[28px] bg-white px-5 py-5 md:px-6 md:py-6 ${className}`}
      style={style}
    >
      <View className={contentClassName}>
        <View className={`items-center justify-between ${dir.row}`}>
          {action ?? <View />}
          <SectionTitle title={title} icon={icon} />
        </View>

        {children}
      </View>
    </ElevatedView>
  );
}
