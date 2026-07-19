// Philosophy | Structure | Gallery. 버킷은 Gallery 아래 행
import type { ReactNode } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { TextButton } from '@components/interactive/button/TextButton';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';
import { useA11y } from '@hooks/useA11y';
import {
  DOMAIN_TABS,
  LAYER_TABS,
  type GalleryViewMode,
} from './catalog';
import styles from './gallery.module.css';

const VIEW_QUERY = 'view';
const GALLERY_DEFAULT = 'design';

const VIEW_OPTIONS = [
  { value: 'role', label: 'Role' },
  { value: 'domain', label: 'Domain' },
];

type ModeTab = {
  id: 'philosophy' | 'structure' | 'gallery';
  label: string;
  path: string;
};

const MODE_TABS: ModeTab[] = [
  { id: 'philosophy', label: 'Philosophy', path: '/components/philosophy' },
  { id: 'structure', label: 'Structure', path: '/components/structure' },
  { id: 'gallery', label: 'Gallery', path: `/components/${GALLERY_DEFAULT}` },
];

export function TabNavigation(): ReactNode {
  const a11y = useA11y();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();

  const view: GalleryViewMode = params.get(VIEW_QUERY) === 'domain' ? 'domain' : 'role';
  const bucketTabs = view === 'role' ? LAYER_TABS : DOMAIN_TABS;
  const onPhilosophy = pathname === '/components/philosophy';
  const onStructure = pathname === '/components/structure';
  const onGallery = !onPhilosophy && !onStructure;

  const setView = (next: GalleryViewMode) => {
    const nextParams = new URLSearchParams(params);
    if (next === 'role') nextParams.delete(VIEW_QUERY);
    else nextParams.set(VIEW_QUERY, 'domain');
    const defaultBucket = next === 'role' ? 'design' : 'icon';
    const q = nextParams.toString();
    navigate(`/components/${defaultBucket}${q ? `?${q}` : ''}`);
  };

  const goBucket = (id: string) => {
    const q = params.toString();
    navigate(`/components/${id}${q ? `?${q}` : ''}`);
  };

  const goMode = (tab: ModeTab) => {
    if (tab.id === 'gallery') {
      if (onGallery) return;
      const q = params.toString();
      navigate(`/components/${GALLERY_DEFAULT}${q ? `?${q}` : ''}`);
      return;
    }
    if (pathname !== tab.path) navigate(tab.path);
  };

  return (
    <div className={styles.tabsStack}>
      <div className={styles.tabsBlock}>
        <nav className={styles.tabs} role="tablist" aria-label={a11y('components.tabs')}>
          {MODE_TABS.map((tab) => {
            const selected =
              tab.id === 'philosophy'
                ? onPhilosophy
                : tab.id === 'structure'
                  ? onStructure
                  : onGallery;
            const TabVariant = selected ? TextButton.Secondary : TextButton.Primary;
            return (
              <TabVariant
                key={tab.id}
                size="medium"
                pressed={selected}
                ariaLabel={tab.label}
                onClick={() => goMode(tab)}
              >
                {tab.label}
              </TabVariant>
            );
          })}
        </nav>

        {onGallery ? (
          <div className={styles.viewToggle}>
            <SegmentedButton
              options={VIEW_OPTIONS}
              value={view}
              onChange={(next) => setView(next as GalleryViewMode)}
              ariaLabel="Gallery view"
            />
          </div>
        ) : null}
      </div>

      {onGallery ? (
        <nav
          className={styles.bucketTabs}
          role="tablist"
          aria-label="Gallery buckets"
        >
          {bucketTabs.map(({ id, label }) => {
            const selected = pathname === `/components/${id}`;
            const TabVariant = selected ? TextButton.Secondary : TextButton.Primary;
            return (
              <TabVariant
                key={id}
                size="medium"
                pressed={selected}
                ariaLabel={label}
                onClick={() => {
                  if (!selected) goBucket(id);
                }}
              >
                {label}
              </TabVariant>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
