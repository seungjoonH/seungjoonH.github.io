import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './data/en/translations.js';
import ko from './data/ko/translations.js';
import enAccess from './data/en/accessabilities.json';
import koAccess from './data/ko/accessabilities.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...en, a11y: enAccess } },
    ko: { translation: { ...ko, a11y: koAccess } },
  },
  lng: 'en',
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});

export default i18n;
