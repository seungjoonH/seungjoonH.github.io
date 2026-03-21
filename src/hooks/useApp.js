import { useEffect, useMemo, useState } from 'react';
import { useConfigStore, dampenFontScale } from '../stores/configStore';
import config from '../config.js';
import { useTranslation } from 'react-i18next';
import { useResponsive } from './useResponsive';
import { useZoomDetection } from './useZoomDetection';

const NARROW_MAX_WIDTH = 768;

export function useApp() {
  const { theme, language, typographyScale, speedScale } = useConfigStore();
  const { i18n } = useTranslation();
  const { type: breakpointType } = useResponsive();
  useZoomDetection();

  const [narrow, setNarrow] = useState(window.innerWidth <= NARROW_MAX_WIDTH);
  const [educationFadeInTriggered, setEducationFadeInTriggered] = useState(false);

  useEffect(() => {
    if (!narrow) return setEducationFadeInTriggered(true);
    setEducationFadeInTriggered(false);
    const t = setTimeout(() => setEducationFadeInTriggered(true), 2000);
    return () => clearTimeout(t);
  }, [narrow]);

  useEffect(() => {
    const m = window.matchMedia(`(max-width: ${NARROW_MAX_WIDTH}px)`);
    const update = () => setNarrow(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const mode = theme || config.theme.initial;
    document.documentElement.setAttribute('data-theme', mode);
  }, [theme]);

  const fontScale = dampenFontScale(
    typeof typographyScale === 'number' && typographyScale >= 0.5 && typographyScale <= 1.5
      ? typographyScale
      : config.typography.scale
  );
  const speedScaleValue = speedScale ?? 1;
  const configStyles = useMemo(
    () => `:root { --font-scale: ${fontScale}; --speed-scale: ${speedScaleValue}; }`,
    [fontScale, speedScaleValue]
  );
  const configStyleProps = useMemo(() => ({ __html: configStyles }), [configStyles]);

  useEffect(() => {
    if (language) i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    document.body.setAttribute('data-breakpoint', breakpointType);
    document.body.setAttribute('data-narrow', narrow ? 'true' : 'false');
  }, [breakpointType, narrow]);

  return { narrow, educationFadeInTriggered, configStyleProps };
}
