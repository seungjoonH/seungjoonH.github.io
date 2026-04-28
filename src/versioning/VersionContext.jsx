/* eslint-disable react-refresh/only-export-components -- hook + provider share one context module */
import { createContext, useContext } from 'react';

const VersionContext = createContext('');

/** @param {{ versionHash: string, children: import('react').ReactNode }} props */
// eslint-disable-next-line react/prop-types
export function VersionProvider({ versionHash, children }) {
  return (
    <VersionContext.Provider value={versionHash ?? ''}>
      {children}
    </VersionContext.Provider>
  );
}

export function useVersionHash() {
  return useContext(VersionContext);
}
