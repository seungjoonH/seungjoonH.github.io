// 컴포넌트 갤러리 공통 셸 — 테마/토큰/버전 컨텍스트
import { useEffect, useMemo, type ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useConfigStore, dampenFontScale } from '@stores/configStore';
import { getAnimationCssVars, getDefaultSiteHash } from '../../config';
import {
  VersionProvider,
  I18nVersionBridge,
} from '@versioning';
import { trackEvent } from '@analytics';
import '../../i18n';
import styles from './helpers/gallery.module.css';
import { TabNavigation } from './helpers/TabNavigation';

function componentsTabFromPath(pathname: string): string {
  const segment = pathname.replace(/^\/components\/?/, '').split('/')[0] ?? '';
  return segment || 'design';
}

function GalleryChrome({ children }: { children: ReactNode }): ReactNode {
  const { theme, typographyScale, speedScale, language } = useConfigStore();
  const { pathname } = useLocation();
  const fontScale = dampenFontScale(typographyScale);
  const configStyleProps = useMemo(
    () => ({
      __html: `:root { --font-scale: ${fontScale}; --speed-scale: ${speedScale}; ${getAnimationCssVars()}; }`,
    }),
    [fontScale, speedScale],
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('lang', language);
  }, [theme, language]);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Components / Portfolio';
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', 'noindex, nofollow');
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    trackEvent({
      event: 'guide:view',
      versionHash: getDefaultSiteHash(),
      locale: language,
      entityId: 'components',
      dedupeKey: 'guide:view:components',
      cooldownMs: 1000,
    });
  }, [language]);

  useEffect(() => {
    const tab = componentsTabFromPath(pathname);
    trackEvent({
      event: 'guide:tab',
      versionHash: getDefaultSiteHash(),
      locale: language,
      entityId: `components:${tab}`,
      meta: { page: 'components', tab },
      dedupeKey: `guide:tab:components:${tab}`,
      cooldownMs: 500,
    });
  }, [pathname, language]);

  return (
    <>
      <style dangerouslySetInnerHTML={configStyleProps} />
      <div className={styles.page}>
        <Link className={styles.homeLink} to={`/${getDefaultSiteHash()}`}>
          ← Portfolio
        </Link>
        <header className={styles.header}>
          <h1 className={styles.title}>Components</h1>
        </header>
        <TabNavigation />
        {children}
      </div>
    </>
  );
}

export function ComponentsLayout(): ReactNode {
  const hash = getDefaultSiteHash();
  return (
    <VersionProvider versionHash={hash}>
      <I18nVersionBridge />
      <GalleryChrome>
        <Outlet />
      </GalleryChrome>
    </VersionProvider>
  );
}
