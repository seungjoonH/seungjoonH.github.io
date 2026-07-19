// 사이트 버전 해시를 Context로 제공 (로더는 갖지 않음)
import { createContext, useContext, type ReactNode } from 'react';

const VersionContext = createContext('');

interface VersionProviderProps {
  versionHash: string;
  children: ReactNode;
}

export function VersionProvider({ versionHash, children }: VersionProviderProps): ReactNode {
  return <VersionContext.Provider value={versionHash ?? ''}>{children}</VersionContext.Provider>;
}

export function useVersion(): { hash: string } {
  return { hash: useContext(VersionContext) };
}
