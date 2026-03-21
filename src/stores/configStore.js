import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import config from '../config.js';

const initialState = {
  theme: config.theme.initial,
  language: config.language.initial,
  typographyScale: config.typography.scale,
  speedScale: 1,
};

const TYPOGRAPHY_SCALE_MIN = 0.5;
const TYPOGRAPHY_SCALE_MAX = 1.5;
const SPEED_SCALE_MIN = 0.5;
const SPEED_SCALE_MAX = 1.5;

export function dampenFontScale(scale) {
  const clamped = Math.min(TYPOGRAPHY_SCALE_MAX, Math.max(TYPOGRAPHY_SCALE_MIN, Number(scale)));
  return 1 + (clamped - 1) * 0.35;
}

export const useConfigStore = create(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setTypographyScale: (v) =>
        set({ typographyScale: Math.min(TYPOGRAPHY_SCALE_MAX, Math.max(TYPOGRAPHY_SCALE_MIN, Number(v))) }),
      setSpeedScale: (v) =>
        set({ speedScale: Math.min(SPEED_SCALE_MAX, Math.max(SPEED_SCALE_MIN, Number(v))) }),
      reset: () => set(initialState),
    }),
    { name: 'portfolio-config' }
  )
);

export default useConfigStore;
