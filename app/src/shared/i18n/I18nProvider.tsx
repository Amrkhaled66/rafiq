import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from "expo-localization";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AppLanguage,
  translations,
  TranslationKey,
} from "@/shared/i18n/translations";

const STORAGE_KEY = "rafiq.language";

type I18nContextValue = {
  language: AppLanguage;
  isRTL: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getDeviceLanguage(): AppLanguage {
  const deviceLanguage = Localization.getLocales()[0]?.languageCode;
  return deviceLanguage === "ar" ? "ar" : "en";
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<AppLanguage>("ar");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedLanguage === "ar" || savedLanguage === "en") {
        setLanguageState(savedLanguage);
      } else {
        setLanguageState(getDeviceLanguage());
      }

      setReady(true);
    };

    void loadLanguage();
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      isRTL: language === "ar",
      setLanguage: async (nextLanguage) => {
        setLanguageState(nextLanguage);
        await AsyncStorage.setItem(STORAGE_KEY, nextLanguage);
      },
      t: (key) => translations[language][key] ?? translations.ar[key],
    }),
    [language],
  );

  if (!ready) {
    return null;
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
