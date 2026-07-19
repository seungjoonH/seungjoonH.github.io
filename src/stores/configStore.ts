// 테마/언어/타이포/속도 설정을 persist하는 Zustand 스토어
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import config, {
  SPEED_SCALE_MAX,
  SPEED_SCALE_MIN,
  TYPO_SCALE_MAX,
  TYPO_SCALE_MIN,
} from '../config';

export type Theme = 'light' | 'dark';

export interface ConfigState {
  theme: Theme;
  isLight: boolean;
  isDark: boolean;
  language: string;
  typographyScale: number;
  speedScale: number;
  setTheme: (theme: Theme | string) => void;
  toggleTheme: () => void;
  setLanguage: (language: string) => void;
  setTypographyScale: (v: number | string) => void;
  setSpeedScale: (v: number | string) => void;
  reset: () => void;
}

const initialState = {
  theme: config.theme.initial as Theme,
  isLight: config.theme.initial === 'light',
  isDark: config.theme.initial === 'dark',
  language: config.language.initial as string,
  typographyScale: config.typography.scale as number,
  speedScale: 1,
};

export function dampenFontScale(scale: number): number {
  const clamped = Math.min(TYPO_SCALE_MAX, Math.max(TYPO_SCALE_MIN, Number(scale)));
  return 1 + (clamped - 1) * 0.35;
}

function deriveThemeState(theme: string): Pick<ConfigState, 'theme' | 'isLight' | 'isDark'> {
  const nextTheme: Theme = theme === 'light' ? 'light' : 'dark';
  return {
    theme: nextTheme,
    isLight: nextTheme === 'light',
    isDark: nextTheme === 'dark',
  };
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      ...initialState,
      setTheme: (theme) => set(deriveThemeState(theme)),
      toggleTheme: () => set(({ theme }) => deriveThemeState(theme === 'light' ? 'dark' : 'light')),
      setLanguage: (language) => set({ language }),
      setTypographyScale: (v) =>
        set({
          typographyScale: Math.min(TYPO_SCALE_MAX, Math.max(TYPO_SCALE_MIN, Number(v))),
        }),
      setSpeedScale: (v) =>
        set({
          speedScale: Math.min(SPEED_SCALE_MAX, Math.max(SPEED_SCALE_MIN, Number(v))),
        }),
      reset: () => set({ ...initialState }),
    }),
    { name: 'portfolio-config' }
  )
);
