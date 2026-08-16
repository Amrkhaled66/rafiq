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
import { PropsWithChildren, useEffect, useMemo } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider } from "@/shared/i18n/I18nProvider";
import { queryClient } from "@/lib/react-query";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import {
  AppThemeProvider,
  useAppTheme,
} from "@/shared/theme/appearance-provider";

void ExpoSplashScreen.preventAutoHideAsync();

export function AppProviders({ children }: PropsWithChildren) {
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

  return (
    <AppThemeProvider>
      <AppProviderContent fontsLoaded={fontsLoaded}>
        {children}
      </AppProviderContent>
    </AppThemeProvider>
  );
}

function AppProviderContent({
  children,
  fontsLoaded,
}: PropsWithChildren<{ fontsLoaded: boolean }>) {
  const { colors, effectiveColorScheme, isThemeReady } = useAppTheme();
  const isReady = fontsLoaded && isThemeReady;
  const navigationTheme = useMemo(() => {
    const baseTheme =
      effectiveColorScheme === "dark" ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: colors.tint,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.border,
        notification: colors.tint,
      },
    };
  }, [colors, effectiveColorScheme]);

  useEffect(() => {
    if (isReady) {
      void ExpoSplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider value={navigationTheme}>{children}</ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nProvider>
  );
}
