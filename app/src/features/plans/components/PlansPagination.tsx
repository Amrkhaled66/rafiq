import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, View } from "react-native";

import { useAppTheme } from "@/shared/theme/appearance-provider";
import { AppText } from "@/shared/ui/app-text";

type PaginationItem = number | "ellipsis";

type PlansPaginationProps = {
  currentPage: number;
  totalPages: number;
  isFetching?: boolean;
  onPageChange: (page: number) => void;
};

export function getVisiblePlanPages(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage, "ellipsis", totalPages];
}

export function PlansPagination({
  currentPage,
  totalPages,
  isFetching = false,
  onPageChange,
}: PlansPaginationProps) {
  const { colors } = useAppTheme();

  if (totalPages <= 1) {
    return null;
  }

  const pages = getVisiblePlanPages(currentPage, totalPages);
  const previousDisabled = currentPage <= 1 || isFetching;
  const nextDisabled = currentPage >= totalPages || isFetching;

  const changePage = (page: number) => {
    if (isFetching || page === currentPage || page < 1 || page > totalPages) {
      return;
    }

    onPageChange(page);
  };

  return (
    <View className="items-center gap-2 pt-1">
      <View className="h-5 items-center justify-center">
        {isFetching ? <ActivityIndicator size="small" color={colors.tint} /> : null}
      </View>

      <View className="items-center justify-center gap-1.5 flex-row">
        <Pressable
          className="border-card-border bg-card size-10 items-center justify-center rounded-xl border"
          style={({ pressed }) => ({
            opacity: previousDisabled ? 0.38 : pressed ? 0.7 : 1,
            transform: [{ scale: pressed && !previousDisabled ? 0.96 : 1 }],
          })}
          disabled={previousDisabled}
          onPress={() => changePage(currentPage - 1)}
          accessibilityRole="button"
          accessibilityLabel="الصفحة السابقة"
          accessibilityState={{ disabled: previousDisabled }}
        >
          <Ionicons
            name="chevron-forward"
            size={18}
            color={previousDisabled ? colors.disabled : colors.icon}
          />
        </Pressable>

        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <View
              key={`ellipsis-${index}`}
              className="size-8 items-center justify-center"
            >
              <AppText tone="muted" weight="bold">
                …
              </AppText>
            </View>
          ) : (
            <Pressable
              key={item}
              className={`size-9 items-center justify-center rounded-xl border ${
                item === currentPage
                  ? "border-brand-primary bg-brand-primary"
                  : "border-card-border bg-card"
              }`}
              style={({ pressed }) => ({
                opacity: isFetching ? 0.55 : pressed ? 0.72 : 1,
                transform: [{ scale: pressed && !isFetching ? 0.96 : 1 }],
              })}
              disabled={isFetching || item === currentPage}
              onPress={() => changePage(item)}
              accessibilityRole="button"
              accessibilityLabel={`الصفحة ${item}`}
              accessibilityState={{
                disabled: isFetching || item === currentPage,
                selected: item === currentPage,
              }}
            >
              <AppText
                className="text-xs"
                tone={item === currentPage ? "inverse" : "default"}
                weight="bold"
              >
                {item}
              </AppText>
            </Pressable>
          ),
        )}

        <Pressable
          className="border-card-border bg-card size-10 items-center justify-center rounded-xl border"
          style={({ pressed }) => ({
            opacity: nextDisabled ? 0.38 : pressed ? 0.7 : 1,
            transform: [{ scale: pressed && !nextDisabled ? 0.96 : 1 }],
          })}
          disabled={nextDisabled}
          onPress={() => changePage(currentPage + 1)}
          accessibilityRole="button"
          accessibilityLabel="الصفحة التالية"
          accessibilityState={{ disabled: nextDisabled }}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={nextDisabled ? colors.disabled : colors.icon}
          />
        </Pressable>
      </View>

      <AppText className="text-xs" tone="muted" weight="medium">
        صفحة {currentPage} من {totalPages}
      </AppText>
    </View>
  );
}
