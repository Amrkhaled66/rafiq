import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";

import {
  AppLanguage,
  translations,
  TranslationKey,
} from "@/shared/i18n/translations";

type I18nContextValue = {
  language: AppLanguage;
  isRTL: boolean;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: PropsWithChildren) {
  const language: AppLanguage = "ar";

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      isRTL: true,
      t: (key) => translations.ar[key],
    }),
    [],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
