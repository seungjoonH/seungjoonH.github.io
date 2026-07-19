// 테마·언어·브레이크포인트·스크롤 복원 등 앱 전역 부수효과 훅
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useConfigStore, dampenFontScale } from '@stores/configStore';
import { useZoomHintStore } from '@stores/zoomHintStore';
import { useTranslation } from 'react-i18next';
import { getAnimationCssVars, getMobileMaxWidthPx } from '../config';
import { useResponsive } from './useResponsive';
import { setupZoomDetection } from './zoomDetection';

const MOBILE_MAX_WIDTH = getMobileMaxWidthPx();

export function useApp() {
  const { theme, language, typographyScale, speedScale } = useConfigStore();
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const { type: breakpointType } = useResponsive();
  const showZoomHint = useZoomHintStore((s) => s.showZoomHint);

  const [narrow, setNarrow] = useState(window.innerWidth <= MOBILE_MAX_WIDTH);
  const [educationFadeInTriggered, setEducationFadeInTriggered] = useState(false);

  useEffect(() => setupZoomDetection(showZoomHint), [showZoomHint]);

  useEffect(() => {
    if (!narrow) return setEducationFadeInTriggered(true);
    setEducationFadeInTriggered(false);
    const t = setTimeout(() => setEducationFadeInTriggered(true), 2000);
    return () => clearTimeout(t);
  }, [narrow]);

  useEffect(() => {
    const m = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
    const update = () => setNarrow(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fontScale = dampenFontScale(typographyScale);
  const configStyleProps = useMemo(
    () => ({
      __html: `:root { --font-scale: ${fontScale}; --speed-scale: ${speedScale}; ${getAnimationCssVars()}; }`,
    }),
    [fontScale, speedScale],
  );

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  useEffect(() => {
    document.body.setAttribute('data-breakpoint', breakpointType);
    document.body.setAttribute('data-narrow', narrow ? 'true' : 'false');
  }, [breakpointType, narrow]);

  return { narrow, educationFadeInTriggered, configStyleProps };
}
