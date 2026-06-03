import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_800ExtraBold,
} from "@expo-google-fonts/cairo";
import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from "@expo-google-fonts/ibm-plex-sans-arabic";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { PropsWithChildren } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "react-native";
import { I18nProvider } from "@/shared/i18n/I18nProvider";
import { queryClient } from "@/lib/react-query";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

void ExpoSplashScreen.preventAutoHideAsync();

export function AppProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  void ExpoSplashScreen.hideAsync();

  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
}
