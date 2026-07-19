// 컴포넌트 갤러리 카탈로그 — layer(역할) + domain(도메인) SSOT
export type ComponentLayer = 'layout' | 'design' | 'interactive' | 'composed' | 'feature';
export type ComponentDomain =
  | 'layout'
  | 'icon'
  | 'text'
  | 'tag'
  | 'chip'
  | 'control'
  | 'modal'
  | 'card'
  | 'row';

export type GalleryViewMode = 'role' | 'domain';

export interface GallerySection {
  id: string;
  title: string;
  /** Role→domain / Domain→layer 보조 라벨 */
  suffix?: string;
  depth?: number;
}

export interface TocGroup {
  heading: string;
  sections: GallerySection[];
}

export interface CatalogItem {
  id: string;
  title: string;
  layer: ComponentLayer;
  domain: ComponentDomain;
  depth?: number;
  children?: string[];
}

export const LAYER_TABS: { id: ComponentLayer; label: string }[] = [
  { id: 'layout', label: 'Layout' },
  { id: 'design', label: 'Design' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'composed', label: 'Composed' },
  { id: 'feature', label: 'Feature' },
];

export const DOMAIN_TABS: { id: ComponentDomain; label: string }[] = [
  { id: 'layout', label: 'Layout' },
  { id: 'icon', label: 'Icon' },
  { id: 'text', label: 'Text' },
  { id: 'tag', label: 'Tag' },
  { id: 'chip', label: 'Chip' },
  { id: 'control', label: 'Control' },
  { id: 'modal', label: 'Modal' },
  { id: 'card', label: 'Card' },
  { id: 'row', label: 'Row' },
];

/** 갤러리에 보이는 컴포넌트 (Nav 셸 UI 제외) */
export const catalogItems: CatalogItem[] = [
  { id: 'box', title: 'Box', layer: 'layout', domain: 'layout', depth: 0 },
  { id: 'stack', title: 'Stack', layer: 'layout', domain: 'layout', depth: 0 },

  { id: 'icons', title: 'Icons', layer: 'design', domain: 'icon', depth: 0 },
  { id: 'brand-icons', title: 'BrandIcons', layer: 'design', domain: 'icon', depth: 0 },
  { id: 'logo-icons', title: 'LogoIcons', layer: 'design', domain: 'icon', depth: 0 },
  { id: 'icon', title: 'Icon', layer: 'design', domain: 'icon', depth: 0 },
  { id: 'icon-button', title: 'IconButton', layer: 'interactive', domain: 'icon', depth: 1, children: ['icon'] },
  {
    id: 'toggle-icon-button',
    title: 'ToggleIconButton',
    layer: 'interactive',
    domain: 'icon',
    depth: 2,
    children: ['icon-button'],
  },
  {
    id: 'cycle-icon-button',
    title: 'CycleIconButton',
    layer: 'interactive',
    domain: 'icon',
    depth: 2,
    children: ['icon-button'],
  },
  {
    id: 'theme-toggle-button',
    title: 'ThemeToggleButton',
    layer: 'feature',
    domain: 'icon',
    depth: 3,
    children: ['toggle-icon-button'],
  },
  {
    id: 'project-sort-button',
    title: 'ProjectSortButton',
    layer: 'feature',
    domain: 'icon',
    depth: 3,
    children: ['cycle-icon-button'],
  },
  {
    id: 'copy-icon-button',
    title: 'CopyIconButton',
    layer: 'feature',
    domain: 'icon',
    depth: 2,
    children: ['icon-button'],
  },
  {
    id: 'settings-button',
    title: 'SettingsButton',
    layer: 'feature',
    domain: 'icon',
    depth: 2,
    children: ['icon-button', 'settings-modal'],
  },

  { id: 'text', title: 'Text', layer: 'design', domain: 'text', depth: 0, children: ['icon'] },
  { id: 'heading', title: 'Heading', layer: 'design', domain: 'text', depth: 0 },
  { id: 'code-block', title: 'CodeBlock', layer: 'design', domain: 'text', depth: 0 },
  { id: 'text-button', title: 'TextButton', layer: 'interactive', domain: 'text', depth: 1, children: ['text'] },
  { id: 'goto-button', title: 'GotoButton', layer: 'interactive', domain: 'text', depth: 1, children: ['text', 'icon'] },
  {
    id: 'typed-external-link',
    title: 'TypedExternalLink',
    layer: 'composed',
    domain: 'text',
    depth: 1,
    children: ['icon'],
  },
  { id: 'nav-button', title: 'NavButton', layer: 'composed', domain: 'text', depth: 2, children: ['text-button'] },

  { id: 'tag', title: 'Tag', layer: 'design', domain: 'tag', depth: 0, children: ['text'] },
  { id: 'tag-button', title: 'TagButton', layer: 'interactive', domain: 'tag', depth: 1, children: ['tag'] },

  { id: 'chip', title: 'Chip', layer: 'design', domain: 'chip', depth: 0, children: ['icon'] },
  { id: 'chip-button', title: 'ChipButton', layer: 'interactive', domain: 'chip', depth: 1, children: ['chip'] },
  { id: 'status-chip', title: 'StatusChip', layer: 'composed', domain: 'chip', depth: 1, children: ['chip'] },
  { id: 'stack-chip-button', title: 'StackChipButton', layer: 'composed', domain: 'chip', depth: 1, children: ['chip'] },
  { id: 'skill-chip-button', title: 'SkillChipButton', layer: 'composed', domain: 'chip', depth: 1, children: ['chip'] },
  {
    id: 'relation-chip-button',
    title: 'RelationChipButton',
    layer: 'composed',
    domain: 'chip',
    depth: 2,
    children: ['chip-button'],
  },
  {
    id: 'search-chip-button',
    title: 'SearchChipButton',
    layer: 'composed',
    domain: 'chip',
    depth: 2,
    children: ['chip-button'],
  },
  {
    id: 'search-shortcut-chip-button',
    title: 'SearchShortcutChipButton',
    layer: 'feature',
    domain: 'chip',
    depth: 3,
    children: ['search-chip-button'],
  },

  { id: 'search-field', title: 'SearchField', layer: 'interactive', domain: 'control', depth: 0, children: ['icon-button'] },
  { id: 'code-field', title: 'CodeField', layer: 'interactive', domain: 'control', depth: 0 },
  {
    id: 'project-search-field',
    title: 'ProjectSearchField',
    layer: 'feature',
    domain: 'control',
    depth: 1,
    children: ['search-field'],
  },
  { id: 'segmented-button', title: 'SegmentedButton', layer: 'interactive', domain: 'control', depth: 0, children: ['text-button'] },
  {
    id: 'language-segmented-button',
    title: 'LanguageSegmentedButton',
    layer: 'feature',
    domain: 'control',
    depth: 1,
    children: ['segmented-button'],
  },
  { id: 'control-slider', title: 'ControlSlider', layer: 'interactive', domain: 'control', depth: 0, children: ['icon-button'] },
  {
    id: 'speed-control-slider',
    title: 'SpeedControlSlider',
    layer: 'feature',
    domain: 'control',
    depth: 1,
    children: ['control-slider'],
  },
  {
    id: 'font-scale-control-slider',
    title: 'FontScaleControlSlider',
    layer: 'feature',
    domain: 'control',
    depth: 1,
    children: ['control-slider'],
  },
  {
    id: 'column-control-slider',
    title: 'ColumnControlSlider',
    layer: 'feature',
    domain: 'control',
    depth: 1,
    children: ['control-slider'],
  },

  { id: 'modal', title: 'Modal', layer: 'interactive', domain: 'modal', depth: 0, children: ['icon-button'] },
  {
    id: 'settings-modal',
    title: 'SettingsModal',
    layer: 'feature',
    domain: 'modal',
    depth: 1,
    children: [
      'modal',
      'speed-control-slider',
      'font-scale-control-slider',
      'language-segmented-button',
      'theme-toggle-button',
    ],
  },
  { id: 'card', title: 'Card', layer: 'design', domain: 'card', depth: 0 },
  { id: 'flip-card', title: 'FlipCard', layer: 'interactive', domain: 'card', depth: 1 },
  { id: 'cursor-ring', title: 'CursorRing', layer: 'interactive', domain: 'card', depth: 1 },
  { id: 'field-card', title: 'FieldCard', layer: 'composed', domain: 'card', depth: 1, children: ['card', 'icon'] },
  {
    id: 'contact-field-card',
    title: 'ContactFieldCard',
    layer: 'feature',
    domain: 'card',
    depth: 2,
    children: ['field-card', 'copy-icon-button'],
  },
  {
    id: 'experience-slot-card',
    title: 'ExperienceSlotCard',
    layer: 'composed',
    domain: 'card',
    depth: 1,
    children: ['card'],
  },
  {
    id: 'experience-card',
    title: 'ExperienceCard',
    layer: 'feature',
    domain: 'card',
    depth: 2,
    children: ['experience-slot-card'],
  },
  {
    id: 'project-slot-card',
    title: 'ProjectSlotCard',
    layer: 'composed',
    domain: 'card',
    depth: 1,
    children: ['flip-card', 'cursor-ring'],
  },
  {
    id: 'project-card',
    title: 'ProjectCard',
    layer: 'feature',
    domain: 'card',
    depth: 2,
    children: ['project-slot-card', 'stack-chip-button', 'tag-button'],
  },

  {
    id: 'doc-row',
    title: 'DocRow',
    layer: 'feature',
    domain: 'row',
    depth: 1,
    children: ['icon', 'search-chip-button', 'goto-button'],
  },
];

export interface ComponentRelation {
  id: string;
  title: string;
  layer: ComponentLayer;
  domain: ComponentDomain;
  children?: string[];
}

export const componentRelations: ComponentRelation[] = catalogItems
  .filter((item) => item.id !== 'icons' && item.id !== 'brand-icons' && item.id !== 'logo-icons')
  .map(({ id, title, layer, domain, children }) => ({ id, title, layer, domain, children }));

export function getCatalogItem(id: string): CatalogItem | undefined {
  return catalogItems.find((item) => item.id === id);
}

export function getComponentRelation(id: string): ComponentRelation | undefined {
  return componentRelations.find((rel) => rel.id === id);
}

export function getChildComponents(id: string): ComponentRelation[] {
  const relation = getComponentRelation(id);
  if (!relation?.children) return [];
  return relation.children
    .map((childId) => getComponentRelation(childId))
    .filter((rel): rel is ComponentRelation => rel != null);
}

export function getParentComponents(id: string): ComponentRelation[] {
  return componentRelations.filter((rel) => rel.children?.includes(id));
}

export function getCategoryPath(bucket: string): string {
  return `/components/${bucket}`;
}

export function filterCatalog(view: GalleryViewMode, bucket: string): CatalogItem[] {
  if (view === 'role') {
    return catalogItems.filter((item) => item.layer === bucket);
  }
  return catalogItems.filter((item) => item.domain === bucket);
}

/** Role→domain 라벨, Domain→layer 라벨 (반대축) */
export function getComplementLabel(
  item: Pick<CatalogItem, 'layer' | 'domain'>,
  view: GalleryViewMode
): string {
  if (view === 'role') {
    return DOMAIN_TABS.find((tab) => tab.id === item.domain)?.label ?? item.domain;
  }
  return LAYER_TABS.find((tab) => tab.id === item.layer)?.label ?? item.layer;
}

/** Role View TOC: domain으로 그룹. Domain View TOC: layer로 그룹 */
export function buildTocGroups(view: GalleryViewMode, bucket: string): TocGroup[] {
  const items = filterCatalog(view, bucket);
  const groupKey = view === 'role' ? 'domain' : 'layer';
  const labelOf =
    view === 'role'
      ? (key: string) => DOMAIN_TABS.find((t) => t.id === key)?.label ?? key
      : (key: string) => LAYER_TABS.find((t) => t.id === key)?.label ?? key;

  const order =
    view === 'role' ? DOMAIN_TABS.map((t) => t.id) : LAYER_TABS.map((t) => t.id);
  const groups: TocGroup[] = [];

  for (const key of order) {
    const sections = items
      .filter((item) => item[groupKey] === key)
      .map((item) => ({
        id: item.id,
        title: item.title,
        suffix: getComplementLabel(item, view),
        depth: item.depth,
      }));
    if (sections.length === 0) continue;
    groups.push({ heading: labelOf(key), sections });
  }

  return groups;
}

/** UI 아이콘 파일명 (outline/fill 1:1 — outline 목록 기준) */
export function listIconNames(): string[] {
  const modules = import.meta.glob('/src/assets/icons/ui/outline/*.svg', { eager: true });
  return Object.keys(modules)
    .map((path) => path.match(/\/([^/]+)\.svg$/)?.[1])
    .filter((name): name is string => Boolean(name))
    .sort();
}

/** 브랜드·스택 아이콘 파일명 (assets/icons/brand) */
export function listBrandIconNames(): string[] {
  const modules = import.meta.glob('/src/assets/icons/brand/*.svg', { eager: true });
  return Object.keys(modules)
    .map((path) => path.match(/\/([^/]+)\.svg$/)?.[1])
    .filter((name): name is string => Boolean(name))
    .sort();
}

/** 사이트·제품 로고 파일명 (assets/icons/logo) */
export function listLogoIconNames(): string[] {
  const modules = import.meta.glob('/src/assets/icons/logo/*.svg', { eager: true });
  return Object.keys(modules)
    .map((path) => path.match(/\/([^/]+)\.svg$/)?.[1])
    .filter((name): name is string => Boolean(name))
    .sort();
}
