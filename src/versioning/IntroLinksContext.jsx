/* eslint-disable react-refresh/only-export-components -- provider + hook share one module */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INTRO_LINK_DEFINITIONS } from '../common/sections/main/introLinksConfig.js';
import { loadMergedIntroLinks } from './introLinksLoader.js';
import { useVersionHash } from './VersionContext.jsx';

const IntroLinksDefsContext = createContext(INTRO_LINK_DEFINITIONS);

export function IntroLinksProvider({ children }) {
  const versionHash = useVersionHash();
  const [defs, setDefs] = useState(INTRO_LINK_DEFINITIONS);

  useEffect(() => {
    let cancelled = false;
    loadMergedIntroLinks(versionHash).then((merged) => {
      if (!cancelled) setDefs(merged);
    });
    return () => {
      cancelled = true;
    };
  }, [versionHash]);

  const value = useMemo(() => defs, [defs]);
  return <IntroLinksDefsContext.Provider value={value}>{children}</IntroLinksDefsContext.Provider>;
}

export function useIntroLinkDefinition(linkId) {
  const defs = useContext(IntroLinksDefsContext);
  return defs[linkId] ?? null;
}
