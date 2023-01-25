import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '../../public/locales/en/translation.json';
import zh from '../../public/locales/zh/translation.json';

export const defaultNS = 'en';
export const resources = {
  en,
  zh,
} as const;

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    resources,
    defaultNS,
  });

export default i18n;
