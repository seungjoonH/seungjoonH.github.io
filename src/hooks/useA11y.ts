import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type A11yOptions = Record<string, unknown>;

export function useA11y(): (key: string, options?: A11yOptions) => string {
  const { t } = useTranslation();
  return useCallback((key: string, options?: A11yOptions) => String(t(`a11y.${key}`, options)), [t]);
}
