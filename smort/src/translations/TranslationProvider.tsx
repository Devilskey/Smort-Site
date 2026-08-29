import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { getBrowserLocale, getMessages, LocaleCode } from "./translation";

type TranslationContextValue = {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: string) => string;
};

const defaultContext: TranslationContextValue = {
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
};

export const TranslationContext = createContext<TranslationContextValue>(defaultContext);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<LocaleCode>(getBrowserLocale());
  const messages = useMemo(() => getMessages(locale), [locale]);
  const t = useCallback((key: string) => messages[key] ?? key, [messages]);

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextValue => useContext(TranslationContext);
