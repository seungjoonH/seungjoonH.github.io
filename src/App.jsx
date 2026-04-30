import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { getDefaultSiteHash, isSiteVersionAllowed } from './config.js';
import { VersionProvider } from './versioning/VersionContext.jsx';
import { I18nVersionBridge } from './versioning/I18nVersionBridge.jsx';
import { VersionAppEntry } from './versioning/VersionAppEntry.jsx';
import { IntroLinksProvider } from './versioning/IntroLinksContext.jsx';

function VersionedRoute() {
  const { versionHash } = useParams();
  const fallback = getDefaultSiteHash();

  if (!isSiteVersionAllowed(versionHash)) {
    return <Navigate to={`/${fallback}`} replace />;
  }

  return (
    <VersionProvider versionHash={versionHash}>
      <I18nVersionBridge />
      <IntroLinksProvider>
        <VersionAppEntry />
      </IntroLinksProvider>
    </VersionProvider>
  );
}

export default function App() {
  const defaultHash = getDefaultSiteHash();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${defaultHash}`} replace />} />
      <Route path="/:versionHash" element={<VersionedRoute />} />
      <Route path="*" element={<Navigate to={`/${defaultHash}`} replace />} />
    </Routes>
  );
}
