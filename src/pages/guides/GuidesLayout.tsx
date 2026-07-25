// 가이드 페이지 공통 셸 — 테마/토큰 컨텍스트
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
import { buildCls } from '@utils/cssUtil';
import styles from './responsive.module.css';

const GUIDE_TITLES: Record<string, string> = {
  '/responsive': 'Responsive',
  '/accessibility': 'Accessibility',
};

const GUIDE_PAGE_BY_PATH: Record<string, 'responsive' | 'accessibility'> = {
  '/responsive': 'responsive',
  '/accessibility': 'accessibility',
};

function GuidesChrome({ children }: { children: ReactNode }): ReactNode {
  const { theme, typographyScale, speedScale, language } = useConfigStore();
  const location = useLocation();
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
    const page = GUIDE_TITLES[location.pathname] ?? 'Guides';
    document.title = `${page} / Portfolio`;
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
  }, [location.pathname]);

  useEffect(() => {
    const page = GUIDE_PAGE_BY_PATH[location.pathname];
    if (!page) return;
    trackEvent({
      event: 'guide:view',
      versionHash: getDefaultSiteHash(),
      locale: language,
      entityId: page,
      dedupeKey: `guide:view:${page}`,
      cooldownMs: 1000,
    });
  }, [location.pathname, language]);

  const isAccessibility = location.pathname === '/accessibility';

  return (
    <>
      <style dangerouslySetInnerHTML={configStyleProps} />
      <div className={buildCls(styles.page, isAccessibility && styles.pageScroll)}>
        <Link className={styles.homeLink} to={`/${getDefaultSiteHash()}`}>
          ← Portfolio
        </Link>
        {children}
      </div>
    </>
  );
}

export function GuidesLayout(): ReactNode {
  const hash = getDefaultSiteHash();
  return (
    <VersionProvider versionHash={hash}>
      <I18nVersionBridge />
      <GuidesChrome>
        <Outlet />
      </GuidesChrome>
    </VersionProvider>
  );
}
