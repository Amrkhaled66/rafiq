import { View } from "react-native";

import { BackButton } from "@/shared/ui/back-button";
import { PageTitle } from "@/shared/ui/page-title";

type TaskDetailHeaderProps = {
  title: string;
};

export function TaskDetailHeader({ title }: TaskDetailHeaderProps) {
  return (
    <View className="relative items-center gap-2 md:gap-2.5">
      <View className="absolute left-0 top-2 md:top-2.5">
        <BackButton />
      </View>
      <PageTitle title={title} />
    </View>
  );
}
