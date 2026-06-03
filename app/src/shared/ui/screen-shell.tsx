import { PropsWithChildren } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ElevatedView } from "@/shared/ui/elevated-view";
import { ThemedText } from "@/shared/ui/themed-text";
import { ThemedView } from "@/shared/ui/themed-view";
import { TabPageHeader } from "@/shared/ui/tab-page-header";

type ScreenShellProps = PropsWithChildren & {
  eyebrow?: string;
  title: string;
  description: string;
  contentClassName?: string;
};

export function ScreenShell({
  eyebrow,
  title,
  description,
  children,
  contentClassName,
}: ScreenShellProps) {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      className="flex-1 bg-background px-5 pb-6"
      style={{ paddingTop: insets.top + 12 }}
    >
      <TabPageHeader />
      <View className="flex-1 justify-center">
        <ElevatedView
          className="rounded-[28px]"
          shadowColor="#6e090b"
          shadowOpacity={0.08}
          // shadowRadius={26}
          shadowOffset={{ width: 0, height: 14 }}
          androidElevation={8}
        >
          <View className="overflow-hidden rounded-[28px] border border-card-border bg-card px-6 py-7">
            <View className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-brand-primary-soft opacity-60" />
            <View className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-brand-primary-soft opacity-45" />
            <View className={contentClassName ?? "gap-4"}>
              {eyebrow ? <ThemedText type="eyebrow">{eyebrow}</ThemedText> : null}
              <ThemedText type="title">{title}</ThemedText>
              <ThemedText className="max-w-[520px] text-base leading-7 text-sub-title">
                {description}
              </ThemedText>
              {children}
            </View>
          </View>
        </ElevatedView>
      </View>
    </ThemedView>
  );
}
