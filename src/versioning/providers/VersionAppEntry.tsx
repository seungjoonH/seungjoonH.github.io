// 버전별 App.tsx가 있으면 lazy, 없으면 PortfolioShell
import { lazy, Suspense, useMemo } from 'react';
import PortfolioShell from '../../site/PortfolioShell';
import { versionApps } from '../globs';
import { versionAppPath } from '../utils/paths';
import { useVersion } from './VersionContext';

export function VersionAppEntry() {
  const { hash } = useVersion();
  const loader = hash ? versionApps[versionAppPath(hash)] : undefined;

  const LazyVersionApp = useMemo(() => {
    if (!loader) return null;
    return lazy(loader);
  }, [loader]);

  if (!LazyVersionApp) return <PortfolioShell />;

  return (
    <Suspense fallback={null}>
      <LazyVersionApp />
    </Suspense>
  );
}
