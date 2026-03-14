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

function applyConfigToDocument(state) {
  if (typeof document === 'undefined') return;
  const raw = state?.typographyScale ?? config.typography.scale;
  const scale = Math.min(TYPOGRAPHY_SCALE_MAX, Math.max(TYPOGRAPHY_SCALE_MIN, Number(raw)));
  const theme = state?.theme ?? config.theme.initial;
  const speed = Math.min(SPEED_SCALE_MAX, Math.max(SPEED_SCALE_MIN, Number(state?.speedScale ?? 1)));
  document.documentElement.style.setProperty('--font-scale', String(scale));
  document.documentElement.setAttribute('data-theme', theme || config.theme.initial);
  document.documentElement.style.setProperty('--speed-scale', String(speed));
}

export const useConfigStore = create(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setTypographyScale: (v) =>
        set({
          typographyScale: Math.min(TYPOGRAPHY_SCALE_MAX, Math.max(TYPOGRAPHY_SCALE_MIN, Number(v))),
        }),
      setSpeedScale: (v) =>
        set({
          speedScale: Math.min(SPEED_SCALE_MAX, Math.max(SPEED_SCALE_MIN, Number(v))),
        }),
      reset: () => set(initialState),
    }),
    {
      name: 'portfolio-config',
      onRehydrateStorage: () => (state, err) => {
        if (!err && state) applyConfigToDocument(state);
      },
    }
  )
);

export default useConfigStore;
