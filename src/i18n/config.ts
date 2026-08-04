/**
 * Internationalization (i18n) Configuration
 *
 * Supports multiple languages with English as default.
 * Architecture is designed for future multi-language support.
 */

export const locales = ["en", "tr", "de", "fr", "es", "ja", "ko", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  tr: "🇹🇷",
  de: "🇩🇪",
  fr: "🇫🇷",
  es: "🇪🇸",
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
};
