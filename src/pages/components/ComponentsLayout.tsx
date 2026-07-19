// 컴포넌트 갤러리 공통 셸 — 테마/토큰/버전 컨텍스트
import { useEffect, useMemo, type ReactNode } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useConfigStore, dampenFontScale } from '@stores/configStore';
import { getAnimationCssVars, getDefaultSiteHash } from '../../config';
import {
  VersionProvider,
  I18nVersionBridge,
} from '@versioning';
import '../../i18n';
import styles from './helpers/gallery.module.css';
import { TabNavigation } from './helpers/TabNavigation';

function GalleryChrome({ children }: { children: ReactNode }): ReactNode {
  const { theme, typographyScale, speedScale, language } = useConfigStore();
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
