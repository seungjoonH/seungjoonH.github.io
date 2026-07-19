// 버전 해시 기반 라우팅과 VersionProvider 래핑을 담당하는 루트 앱
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { getDefaultSiteHash, isSiteVersionAllowed } from './config';
import {
  VersionProvider,
  I18nVersionBridge,
  VersionAppEntry,
  IntroLinksProvider,
} from '@versioning';
import { ComponentsLayout } from './pages/components/ComponentsLayout';
import { PhilosophyShowcase } from './pages/components/PhilosophyShowcase';
import { StructureShowcase } from './pages/components/StructureShowcase';
import { GalleryShowcase } from './pages/components/GalleryShowcase';
import { GuidesLayout } from './pages/guides/GuidesLayout';
import { ResponsiveShowcase } from './pages/guides/ResponsiveShowcase';
import { AccessibilityShowcase } from './pages/guides/AccessibilityShowcase';

function VersionedRoute() {
  const { versionHash } = useParams();
  const fallback = getDefaultSiteHash();

  if (!isSiteVersionAllowed(versionHash)) {
    return <Navigate to={`/${fallback}`} replace />;
  }

  return (
    <VersionProvider versionHash={versionHash!}>
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
      <Route path="/components" element={<ComponentsLayout />}>
        <Route index element={<Navigate to="philosophy" replace />} />
        <Route path="philosophy" element={<PhilosophyShowcase />} />
        <Route path="structure" element={<StructureShowcase />} />
        <Route path=":bucket" element={<GalleryShowcase />} />
      </Route>
      <Route path="/responsive" element={<GuidesLayout />}>
        <Route index element={<ResponsiveShowcase />} />
      </Route>
      <Route path="/accessibility" element={<GuidesLayout />}>
        <Route index element={<AccessibilityShowcase />} />
      </Route>
      <Route path="/" element={<Navigate to={`/${defaultHash}`} replace />} />
      <Route path="/:versionHash" element={<VersionedRoute />} />
      <Route path="*" element={<Navigate to={`/${defaultHash}`} replace />} />
    </Routes>
  );
}
