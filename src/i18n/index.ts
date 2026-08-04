/**
 * i18n — Internationalization System
 *
 * Usage:
 *   import { useTranslation } from "@/i18n";
 *   const { t, locale } = useTranslation();
 *   t("characters.title") // "Characters"
 */

import { type Locale, defaultLocale } from "./config";
import { en, type TranslationKeys } from "./translations/en";
import { tr } from "./translations/tr";

export type { Locale } from "./config";
export { locales, defaultLocale, localeNames, localeFlags } from "./config";

// Use a generic record type to allow different translation values
const translations: Record<string, Record<string, unknown>> = {
  en: en as unknown as Record<string, unknown>,
  tr: tr as unknown as Record<string, unknown>,
};

type DeepKeys<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? DeepKeys<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

export type TranslationKey = DeepKeys<TranslationKeys>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === "string" ? current : path;
}

export function createTranslator(locale: Locale = defaultLocale) {
  const dict = translations[locale] || translations[defaultLocale];

  return function t(key: TranslationKey, params?: Record<string, string | number>): string {
    let value = getNestedValue(dict, key);

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(`{${paramKey}}`, String(paramValue));
      });
    }

    return value;
  };
}

/**
 * Server-side translation helper
 */
export function getTranslations(locale: Locale = defaultLocale) {
  const t = createTranslator(locale);
  return { t, locale };
}
