import en from "./locales/en.json";
import enUS from "./locales/en-US.json";
import nlNL from "./locales/nl-NL.json";

export type LocaleCode = "en" | "en-US" | "nl-NL";
export type Messages = Record<string, string>;

export const supportedLocales: LocaleCode[] = ["en", "en-US", "nl-NL"];

const localeMessages: Record<LocaleCode, Messages> = {
  "en": en,
  "en-US": enUS,
  "nl-NL": nlNL,
};

const normalizeLocale = (rawLocale: string): LocaleCode => {
  const locale = rawLocale?.toLowerCase().replace("_", "-") ?? "en";

  if (locale === "en-us") {
    return "en-US";
  }

  if (locale === "en" || locale.startsWith("en-")) {
    return "en";
  }

  if (locale === "nl" || locale.startsWith("nl-")) {
    return "nl-NL";
  }

  return "en";
};

export const getBrowserLocale = (): LocaleCode => {
  if (typeof window === "undefined") {
    return "en";
  }

  const nav = window.navigator as Navigator & { languages?: readonly string[] };
  const browserLanguage = Array.isArray(nav.languages) && nav.languages.length > 0
    ? nav.languages[0]
    : nav.language || "en";

  return normalizeLocale(browserLanguage);
};

export const getMessages = (locale: string): Messages => {
  const normalized = normalizeLocale(locale);
  return localeMessages[normalized] ?? localeMessages.en;
};
