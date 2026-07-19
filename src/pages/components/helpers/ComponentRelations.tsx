// 컴포넌트 부모/자식 관계 칩 링크 (RelationChipButton: inner=자식, outer=부모)
import type { ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RelationChipButton } from '@components/composed/chip/RelationChipButton';
import {
  getCategoryPath,
  getChildComponents,
  getParentComponents,
  type ComponentRelation,
  type GalleryViewMode,
} from './catalog';
import styles from './gallery.module.css';

interface ComponentRelationsProps {
  componentId: string;
}

function relationHref(relation: ComponentRelation, view: GalleryViewMode, search: string): string {
  const bucket = view === 'domain' ? relation.domain : relation.layer;
  const q = search ? `?${search}` : '';
  return `${getCategoryPath(bucket)}${q}#${relation.id}`;
}

export function ComponentRelations({ componentId }: ComponentRelationsProps): ReactNode {
  const [params] = useSearchParams();
  const view: GalleryViewMode = params.get('view') === 'domain' ? 'domain' : 'role';
  const search = params.toString();
  const children = getChildComponents(componentId);
  const parents = getParentComponents(componentId);
  if (children.length === 0 && parents.length === 0) return null;

  return (
    <div className={styles.relations}>
      {children.map((child) => (
        <RelationChipButton
          key={child.id}
          type="inner"
          label={child.title}
          href={relationHref(child, view, search)}
        />
      ))}
      {parents.map((parent) => (
        <RelationChipButton
          key={parent.id}
          type="outer"
          label={parent.title}
          href={relationHref(parent, view, search)}
        />
      ))}
    </div>
  );
}
