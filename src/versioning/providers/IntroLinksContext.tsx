// Intro 링크 정의를 버전별로 병합해 Context로 제공
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  INTRO_LINK_DEFINITIONS,
  type IntroLinkDefinition,
  type IntroLinkDefinitions,
} from '../../site/sections/main/introLinksConfig';
import { loadIntroLinks } from '../utils';
import { useVersion } from './VersionContext';

const IntroLinksDefsContext = createContext<IntroLinkDefinitions>(INTRO_LINK_DEFINITIONS);

interface IntroLinksProviderProps {
  children: ReactNode;
}

export function IntroLinksProvider({ children }: IntroLinksProviderProps): ReactNode {
  const { hash } = useVersion();
  const [defs, setDefs] = useState<IntroLinkDefinitions>(INTRO_LINK_DEFINITIONS);

  useEffect(() => {
    let cancelled = false;
    loadIntroLinks({ hash }).then((merged) => {
      if (!cancelled) setDefs(merged);
    });
    return () => {
      cancelled = true;
    };
  }, [hash]);

  return (
    <IntroLinksDefsContext.Provider value={defs}>{children}</IntroLinksDefsContext.Provider>
  );
}

export function useIntroLinkDefinition(linkId: string): IntroLinkDefinition | null {
  const defs = useContext(IntroLinksDefsContext);
  return defs[linkId] ?? null;
}
