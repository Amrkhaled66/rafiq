import { Pressable, View } from "react-native";

import { useDirection } from "@/shared/hooks/use-direction";
import { AppText } from "@/shared/ui/app-text";

export type SegmentedFilterOption<T extends string> = {
  key: T;
  label: string;
};

type SegmentedFilterTabsProps<T extends string> = {
  options: SegmentedFilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  selectedClassName?: string;
  unselectedClassName?: string;
  selectedTextClassName?: string;
  unselectedTextClassName?: string;
};

export function SegmentedFilterTabs<T extends string>({
  options,
  value,
  onChange,
  selectedClassName = "bg-brand-primary",
  unselectedClassName = "bg-white",
  selectedTextClassName = "text-white!",
  unselectedTextClassName = "text-card-border",
}: SegmentedFilterTabsProps<T>) {
  const dir = useDirection();

  return (
    <View
      className={`border-card-border bg-card rounded-2xl border ${dir.rowReverse}`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
      }}
    >
      {options.map((option) => {
        const isSelected = option.key === value;

        return (
          <Pressable
            key={option.key}
            className={`flex-1 items-center justify-center rounded-2xl px-2 py-3 active:opacity-90 ${
              isSelected ? selectedClassName : unselectedClassName
            }`}
            onPress={() => onChange(option.key)}
          >
            <AppText
              className={`text-sm md:text-base ${
                isSelected ? selectedTextClassName : unselectedTextClassName
              }`}
              weight="semibold"
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
