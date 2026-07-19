// 섹션 lazy 로드·Nav·CursorRing을 묶는 포트폴리오 사이트 셸
import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { Nav } from '@components/composed/Nav';
import { CursorRing } from '@components/interactive/cursor/CursorRing';
import { useApp } from '@hooks/useApp';
import { loadSection, useVersion } from '@versioning';
import { DEFAULT_SECTION_SPECS, type SectionSpec } from './sectionSpecs';
import { useConfigStore } from '@stores/configStore';
import { trackSiteView } from '@analytics';

interface PortfolioShellProps {
  sectionSpecs?: SectionSpec[];
}

export default function PortfolioShell({ sectionSpecs = DEFAULT_SECTION_SPECS }: PortfolioShellProps) {
  const { hash } = useVersion();
  const language = useConfigStore((s) => s.language);
  const { narrow, educationFadeInTriggered, configStyleProps } = useApp();
  const lastTrackedHashRef = useRef<string | null>(null);

  useEffect(() => {
    if (lastTrackedHashRef.current === hash) return;
    lastTrackedHashRef.current = hash;
    trackSiteView({ versionHash: hash, locale: language });
  }, [hash, language]);

  const ctx = useMemo(
    () => ({ narrow, educationFadeInTriggered }),
    [narrow, educationFadeInTriggered]
  );

  const entries = useMemo(
    () =>
      sectionSpecs.map((spec) => ({
        ...spec,
        Comp: lazy(() => loadSection({ hash, path: spec.relPath })),
      })),
    [sectionSpecs, hash]
  );

  return (
    <div className="columnContainer">
      <style dangerouslySetInnerHTML={configStyleProps} />
      <CursorRing />
      <Nav />
      {entries.map(({ domId, Comp, getProps }) => (
        <section key={domId} id={domId}>
          <Suspense fallback={null}>
            <Comp {...(getProps?.(ctx) ?? {})} />
          </Suspense>
        </section>
      ))}
    </div>
  );
}
