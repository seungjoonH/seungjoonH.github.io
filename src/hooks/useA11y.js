import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useA11y() {
  const { t } = useTranslation();
  return useCallback((key, options) => t(`a11y.${key}`, options), [t]);
}
