import { View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

type PageTitleProps = {
  title: string;
};

export function PageTitle({ title }: PageTitleProps) {
  const dir = useDirection();

  return (
    <View className="items-center gap-1">
      <AppText className="text-3xl leading-[36px]" weight="bold">
        {title}
      </AppText>

      <View className={`items-center gap-2 ${dir.rowReverse}`}>
        <View className="bg-brand-primary size-1.5 rounded-full" />
        <View className="bg-brand-primary h-1 w-[7%] rounded-full" />
      </View>
    </View>
  );
}