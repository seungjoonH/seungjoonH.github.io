import { lazy, Suspense, useMemo } from 'react';
import CommonApp from '../common/App.jsx';
import { useVersionHash } from './VersionContext.jsx';

const versionApps = import.meta.glob('../versions/*/App.jsx');

export function VersionAppEntry() {
  const versionHash = useVersionHash();
  const key = `../versions/${versionHash}/App.jsx`;
  const loader = versionHash ? versionApps[key] : undefined;

  const LazyVersionApp = useMemo(() => {
    if (!loader) return null;
    return lazy(loader);
  }, [loader]);

  if (!LazyVersionApp) {
    return <CommonApp />;
  }

  return (
    <Suspense fallback={null}>
      <LazyVersionApp />
    </Suspense>
  );
}
