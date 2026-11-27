import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/locales/en.json'
import th from '@/locales/th.json'

export const SUPPORTED_LANGUAGES = ['th', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: Language = 'th'
export const LANGUAGE_STORAGE_KEY = 'app-language'

export const defaultNS = 'translation'
export const resources = {
  th: { translation: th },
  en: { translation: en },
} as const

export const isSupportedLanguage = (value: unknown): value is Language =>
  SUPPORTED_LANGUAGES.includes(value as Language)

const readSavedLanguage = (): Language => {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isSupportedLanguage(saved) ? saved : DEFAULT_LANGUAGE
  } catch {
    // private mode / storage ถูกปิด — ใช้ภาษาเริ่มต้นแทน
    return DEFAULT_LANGUAGE
  }
}

void i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  lng: readSavedLanguage(),
  fallbackLng: 'en',
  interpolation: {
    // React escape ให้อยู่แล้ว
    escapeValue: false,
  },
})

// sync <html lang> และจำภาษาที่เลือกไว้ — screen reader และ font fallback อ่านค่านี้
i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch {
    // ignore
  }
})
document.documentElement.lang = i18n.language

export default i18n
