import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance, useColorScheme } from "react-native";
import * as SystemUI from "expo-system-ui";

import {
  Colors,
  type AppColorScheme,
  type AppPalette,
} from "@/shared/theme/theme";

export type ThemePreference = "system" | "light" | "dark";

type AppThemeContextValue = {
  preference: ThemePreference;
  effectiveColorScheme: AppColorScheme;
  colors: AppPalette;
  setPreference: (preference: ThemePreference) => Promise<void>;
  isThemeReady: boolean;
};

const STORAGE_KEY = "rafiq.theme-preference";
const AppThemeContext = createContext<AppThemeContextValue | null>(null);

function isThemePreference(value: string | null): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

function applyPreference(preference: ThemePreference) {
  Appearance.setColorScheme(preference === "system" ? null : preference);
}

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [preference, setPreferenceState] =
    useState<ThemePreference>("system");
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restorePreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem(STORAGE_KEY);
        const nextPreference = isThemePreference(storedPreference)
          ? storedPreference
          : "system";

        applyPreference(nextPreference);

        if (isMounted) {
          setPreferenceState(nextPreference);
        }
      } catch {
        applyPreference("system");
        if (isMounted) {
          setPreferenceState("system");
        }
      } finally {
        if (isMounted) {
          setIsThemeReady(true);
        }
      }
    };

    void restorePreference();

    return () => {
      isMounted = false;
    };
  }, []);

  const setPreference = useCallback(async (next: ThemePreference) => {
    applyPreference(next);
    setPreferenceState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The visual preference still applies for this session if storage is unavailable.
    }
  }, []);

  const effectiveColorScheme: AppColorScheme =
    systemColorScheme === "dark" ? "dark" : "light";

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(
      Colors[effectiveColorScheme].background,
    ).catch(() => undefined);
  }, [effectiveColorScheme]);

  const value = useMemo<AppThemeContextValue>(
    () => ({
      preference,
      effectiveColorScheme,
      colors: Colors[effectiveColorScheme],
      setPreference,
      isThemeReady,
    }),
    [effectiveColorScheme, isThemeReady, preference, setPreference],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used inside AppThemeProvider.");
  }

  return context;
}
