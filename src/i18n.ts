// i18next 초기화 및 공통 번역 리소스 등록
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './data/en/translations.ts';
import ko from './data/ko/translations.ts';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  lng: 'en',
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});

export default i18n;
