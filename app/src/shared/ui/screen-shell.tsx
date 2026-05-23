import { PropsWithChildren } from "react";
import { View } from "react-native";

import { ThemedText } from "@/shared/ui/themed-text";
import { ThemedView } from "@/shared/ui/themed-view";

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
  return (
    <ThemedView className="flex-1 bg-background px-5 py-6">
      <View className="flex-1 justify-center">
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
      </View>
    </ThemedView>
  );
}
