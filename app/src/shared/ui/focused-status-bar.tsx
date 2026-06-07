import { StatusBar, type StatusBarProps } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

type FocusedStatusBarProps = Pick<StatusBarProps, "style" | "hidden" | "backgroundColor" | "translucent" | "animated">;

export function FocusedStatusBar(props: FocusedStatusBarProps) {
  const isFocused = useIsFocused();

  if (!isFocused) return null;

  return <StatusBar {...props} />;
}
