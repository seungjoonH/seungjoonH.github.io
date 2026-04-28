import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { Nav } from '@components/layout/Nav';
import { CardCursor } from '@components/CardCursor';
import { useApp } from '../hooks/useApp';
import config from '../config.js';
import { useVersionHash } from '../versioning/VersionContext.jsx';
import { loadSectionModule } from '../versioning/loadSection.js';
import { DEFAULT_SECTION_SPECS } from './sectionSpecs.js';
import { useConfigStore } from '../stores/configStore.js';
import { trackSiteView } from '../utils/analytics.js';

function makeSectionLazy(relPath, versionHash) {
  return lazy(() => loadSectionModule(relPath, versionHash));
}

/**
 * @param {{ sectionSpecs?: typeof DEFAULT_SECTION_SPECS }} props
 */
// eslint-disable-next-line react/prop-types -- JSDoc above describes optional sectionSpecs
export default function CommonApp({ sectionSpecs = DEFAULT_SECTION_SPECS }) {
  const versionHash = useVersionHash();
  const language = useConfigStore((s) => s.language);
  const { narrow, educationFadeInTriggered, configStyleProps } = useApp();
  const lastTrackedVersionHashRef = useRef(null);

  useEffect(() => {
    if (lastTrackedVersionHashRef.current === versionHash) return;
    lastTrackedVersionHashRef.current = versionHash;
    trackSiteView({ versionHash, locale: language });
  }, [versionHash, language]);

  const ctx = useMemo(
    () => ({ narrow, educationFadeInTriggered }),
    [narrow, educationFadeInTriggered]
  );

  const entries = useMemo(
    () =>
      sectionSpecs.map((spec) => ({
        ...spec,
        Comp: makeSectionLazy(spec.relPath, versionHash),
      })),
    [sectionSpecs, versionHash]
  );

  return (
    <div className="columnContainer">
      <style dangerouslySetInnerHTML={configStyleProps} />
      <CardCursor />
      <Nav />
      {entries.map(({ domId, relPath, Comp, getProps }) => {
        const extra = getProps?.(ctx) ?? {};
        return (
          <div key={`${domId}-${relPath}`} className="section" id={domId}>
            <Suspense fallback={null}>
              <Comp {...extra} />
            </Suspense>
          </div>
        );
      })}
      <span className="versionLabel" aria-hidden="true">
        v{config.version?.number} - {config.version?.buildDate}
      </span>
    </div>
  );
}
