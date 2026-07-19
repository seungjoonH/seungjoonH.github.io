// Role|Domain 필터 갤러리 쇼케이스 — complement 그룹 + 단일 열 카드
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Text } from '@components/design/button/Text';
import { TextButton } from '@components/interactive/button/TextButton';
import { GotoButton } from '@components/interactive/button/GotoButton';
import { Card } from '@components/design/card/Card';
import { Chip } from '@components/design/chip/Chip';
import { ChipButton } from '@components/interactive/chip/ChipButton';
import { RelationChipButton } from '@components/composed/chip/RelationChipButton';
import { StatusChip } from '@components/composed/chip/StatusChip';
import { StackChipButton } from '@components/composed/chip/StackChipButton';
import { SkillChipButton } from '@components/composed/chip/SkillChipButton';
import { Icon } from '@components/design/icon/Icon';
import { IconButton } from '@components/interactive/icon/IconButton';
import { ToggleIconButton } from '@components/interactive/icon/ToggleIconButton';
import { CycleIconButton } from '@components/interactive/icon/CycleIconButton';
import { SearchField } from '@components/interactive/field/SearchField';
import CodeBlock from '@components/design/codeBlock/CodeBlock';
import { CodeField } from '@components/interactive/field/CodeField';
import { FlipCard } from '@components/interactive/card/FlipCard';
import { SearchChipButton } from '@components/composed/chip/SearchChipButton';
import { TypedExternalLink } from '@components/composed/link/TypedExternalLink';
import { FieldCard } from '@components/composed/card/FieldCard';
import { ProjectSortButton } from '@components/feature/icon/ProjectSortButton';
import { ProjectSearchField } from '@components/feature/field/ProjectSearchField';
import { CopyIconButton } from '@components/feature/icon/CopyIconButton';
import { SearchShortcutChipButton } from '@components/feature/chip/SearchShortcutChipButton';
import {
  ContactFieldCard,
  CONTACT_FIELD_KEYS,
} from '@components/feature/card/ContactFieldCard';
import { ExperienceSlotCard } from '@components/composed/card/ExperienceSlotCard';
import { TwoLineText } from '@components/composed/text/TwoLineText';
import slotStyles from '@components/composed/card/experienceSlotCard.module.css';
import { ExperienceCard } from '@components/feature/card/ExperienceCard';
import { ProjectSlotCard } from '@components/composed/card/ProjectSlotCard';
import { ProjectCard } from '@components/feature/card/ProjectCard';
import { DocRow } from '@components/feature/row/DocRow';
import ExperienceModel, { type ExperienceModelInput } from '@models/experience';
import ProjectModel, { type ProjectModelInput } from '@models/project';
import koExperiences from '@data/ko/experiences';
import koProjects from '@data/ko/projects';
import { Modal } from '@components/interactive/modal/Modal';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';
import { ControlSlider } from '@components/interactive/controlSlider/ControlSlider';
import { SpeedControlSlider } from '@components/feature/controlSlider/SpeedControlSlider';
import { FontScaleControlSlider } from '@components/feature/controlSlider/FontScaleControlSlider';
import { ColumnControlSlider } from '@components/feature/controlSlider/ColumnControlSlider';
import { ThemeToggleButton } from '@components/feature/icon/ThemeToggleButton';
import { LanguageSegmentedButton } from '@components/feature/control/LanguageSegmentedButton';
import { Tag } from '@components/design/tag/Tag';
import { TagButton } from '@components/interactive/tag/TagButton';
import { Heading } from '@components/design/heading/Heading';
import { NavButton } from '@components/composed/NavButton';
import { SettingsButton } from '@components/feature/SettingsButton';
import { SettingsModal } from '@components/feature/SettingsModal';
import { CursorRing } from '@components/interactive/cursor/CursorRing';
import { Box } from '@components/layout/box/Box';
import {
  Stack,
  type StackAlign,
  type StackDirection,
  type StackGap,
  type StackJustify,
  type StackWrap,
} from '@components/layout/stack/Stack';
import { useA11y } from '@hooks/useA11y';
import { PROJECT_STATUS } from '@sections/projects/status/projectStatus';
import {
  DESIGN_OPACITIES,
  DESIGN_SHAPES,
  DESIGN_SIZES,
  DESIGN_VARIANTS,
  LAYOUT_WIDTHS,
  type DesignSize,
  type LayoutWidth,
} from '@components/design/designTokens';
import { ComponentPreview } from './helpers/ComponentPreview';
import { ComponentRelations } from './helpers/ComponentRelations';
import { GalleryTitle } from './helpers/GalleryTitle';
import { TableOfContents } from './helpers/TableOfContents';
import {
  buildTocGroups,
  filterCatalog,
  getCatalogItem,
  getComplementLabel,
  listIconNames,
  listBrandIconNames,
  listLogoIconNames,
  type GalleryViewMode,
} from './helpers/catalog';
import { listSkillChipItems, listStackChipItems } from './helpers/galleryChipItems';
import { buildCls } from '@utils/cssUtil';
import styles from './helpers/gallery.module.css';

/** DESIGN_VARIANTS.map(variant => ...)로 동적 variant를 순회할 때 쓰는 룩업 */
const ICON_VARIANT = { primary: Icon.Primary, secondary: Icon.Secondary, outlined: Icon.Outlined };
const ICON_BUTTON_VARIANT = {
  primary: IconButton.Primary,
  secondary: IconButton.Secondary,
  outlined: IconButton.Outlined,
};
const TEXT_VARIANT = { primary: Text.Primary, secondary: Text.Secondary, outlined: Text.Outlined };
const TEXT_BUTTON_VARIANT = {
  primary: TextButton.Primary,
  secondary: TextButton.Secondary,
  outlined: TextButton.Outlined,
};
const CHIP_VARIANT = { primary: Chip.Primary, secondary: Chip.Secondary, outlined: Chip.Outlined };
const CHIP_BUTTON_VARIANT = {
  primary: ChipButton.Primary,
  secondary: ChipButton.Secondary,
  outlined: ChipButton.Outlined,
};

const INITIAL_SLIDER_BY_SIZE: Record<DesignSize, number> = {
  large: 3,
  medium: 3,
  small: 3,
};

const STACK_DIRECTIONS: StackDirection[] = ['horizontal', 'vertical'];
const STACK_GAPS: StackGap[] = ['none', 'small', 'medium', 'large'];
const STACK_ALIGNS: StackAlign[] = ['start', 'center', 'end', 'stretch'];
const STACK_JUSTIFIES: StackJustify[] = ['start', 'center', 'end', 'spaceBetween'];
const STACK_WRAPS: StackWrap[] = ['nowrap', 'wrap'];

const SEGMENTED_BUTTON_OPTIONS = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

const CYCLE_ICON_BUTTON_OPTIONS = [
  { value: 'recent', iconName: 'sort-recent', ariaLabel: 'recent' },
  { value: 'oldest', iconName: 'sort-oldest', ariaLabel: 'oldest' },
  { value: 'status', iconName: 'sort-status', ariaLabel: 'status' },
];

const FIELD_CARD_EXAMPLES = [
  { iconName: 'document', label: 'Spec', value: 'onboarding-flow.md' },
  { iconName: 'deploy', label: 'Deploy', value: 'staging-ready' },
  { iconName: 'person', label: 'Owner', value: 'Mina Park' },
  { iconName: 'settings', label: 'Mode', value: 'manual review' },
];

const GALLERY_BOOSTCAMP = ExperienceModel.fromJson(
  ((koExperiences as ExperienceModelInput[]).find((item) => item.id === 'naver-boostcamp')
    ?? koExperiences[koExperiences.length - 1]) as ExperienceModelInput
);

const GALLERY_PS_STUDIO = ProjectModel.fromJson(
  ((koProjects as ProjectModelInput[]).find((item) => item.id === 'ps-studio')
    ?? koProjects[0]) as ProjectModelInput
);

interface SectionEntry {
  body: ReactNode;
  trailing?: ReactNode;
  /** 큰 매트릭스·아이콘 격자 — 그룹 안 풀폭 */
  fullWidth?: boolean;
}

function PropGroup({ label, children }: { label: string; children: ReactNode }): ReactNode {
  return (
    <div className={styles.matrixGroup}>
      <p className={styles.matrixGroupLabel}>{label}</p>
      {children}
    </div>
  );
}

function PropCell({
  label,
  children,
  fullWidth = false,
  code,
}: {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
  code?: string;
}): ReactNode {
  return (
    <div className={buildCls(styles.variantCell, fullWidth && styles.variantCellFullWidth)}>
      <span className={styles.variantCellLabel}>{label}</span>
      <ComponentPreview fullWidth={fullWidth} code={code}>
        {children}
      </ComponentPreview>
    </div>
  );
}

function Section({
  id,
  view,
  trailing,
  fullWidth = false,
  children,
}: {
  id: string;
  view: GalleryViewMode;
  trailing?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}): ReactNode {
  const item = getCatalogItem(id);
  const title = item?.title ?? id;
  const suffix = item ? getComplementLabel(item, view) : undefined;
  return (
    <section
      id={id}
      className={buildCls(styles.section, fullWidth && styles.sectionFullWidth)}
    >
      <div className={styles.sectionTitleRow}>
        <GalleryTitle as="h2" className={styles.sectionTitle} title={title} suffix={suffix} />
        {trailing ? <div className={styles.sectionTitleTrailing}>{trailing}</div> : null}
      </div>
      {children}
      <ComponentRelations componentId={id} />
    </section>
  );
}

function formatSegmentedButtonCode(value: string): string {
  const options = SEGMENTED_BUTTON_OPTIONS.map(
    (option) => `    { value: "${option.value}", label: "${option.label}" }`
  ).join(',\n');

  return `<SegmentedButton value="${value}" options={[\n${options}\n  ]} />`;
}

function formatToggleIconButtonCode(pressed: boolean): string {
  const name = pressed ? 'eye-off' : 'eye-open';
  return `<ToggleIconButton name="${name}" pressed={${pressed}} />`;
}

function formatCycleIconButtonCode(value: string): string {
  const options = CYCLE_ICON_BUTTON_OPTIONS.map(
    (option) =>
      `    { value: "${option.value}", iconName: "${option.iconName}", ariaLabel: "${option.ariaLabel}" }`
  ).join(',\n');

  return `<CycleIconButton value="${value}" options={[\n${options}\n  ]} onChange={handleChange} />`;
}

function escapeCodeString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function ControlWidthPreviews({
  renderCode,
  renderPreview,
}: {
  renderCode: (width: LayoutWidth) => string;
  renderPreview: (width: LayoutWidth) => ReactNode;
}): ReactNode {
  return (
    <PropGroup label="width">
      <div className={styles.col}>
        {LAYOUT_WIDTHS.map((width) => (
          <PropCell
            key={width}
            label={width}
            fullWidth={width === 'stretch'}
            code={renderCode(width)}
          >
            {renderPreview(width)}
          </PropCell>
        ))}
      </div>
    </PropGroup>
  );
}

function LayoutBoxContent({ label = 'Content' }: { label?: string }): ReactNode {
  return (
    <div className={styles.layoutBoxContent}>
      <Text.Primary size="small">{label}</Text.Primary>
    </div>
  );
}

function StackItems(): ReactNode {
  return (
    <>
      <div className={styles.layoutStackItem}>A</div>
      <div className={buildCls(styles.layoutStackItem, styles.layoutStackItemTall)}>B</div>
      <div className={styles.layoutStackItem}>C</div>
    </>
  );
}

export function GalleryShowcase(): ReactNode {
  const a11y = useA11y();
  const { bucket = 'design' } = useParams();
  const { hash } = useLocation();
  const [params] = useSearchParams();
  const view: GalleryViewMode = params.get('view') === 'domain' ? 'domain' : 'role';
  const tocGroups = useMemo(() => buildTocGroups(view, bucket), [view, bucket]);
  const visible = useMemo(
    () => new Set(filterCatalog(view, bucket).map((item) => item.id)),
    [view, bucket]
  );

  const [iconKind, setIconKind] = useState<'outline' | 'fill'>('outline');
  const icons = listIconNames();
  const brandIcons = listBrandIconNames();
  const logoIcons = listLogoIconNames();
  const stackChips = listStackChipItems();
  const skillChips = listSkillChipItems();
  const [segment, setSegment] = useState('a');
  const [togglePressed, setTogglePressed] = useState(false);
  const [cycleSort, setCycleSort] = useState('recent');
  const [searchDemo, setSearchDemo] = useState('');
  const [codeDemo, setCodeDemo] = useState(
    `<Stack width="stretch" gap="medium">\n  <Card>A</Card>\n</Stack>`
  );
  const [sliderBySize, setSliderBySize] = useState(INITIAL_SLIDER_BY_SIZE);
  const [columnValue, setColumnValue] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<'default' | 'compact'>('compact');

  useEffect(() => {
    const id = hash.replace(/^#/, '');
    if (!id || !visible.has(id)) return;
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [hash, visible, bucket]);

  const sectionEntries: Record<string, SectionEntry> = {
    box: {
      fullWidth: true,
      body: (
        <PropGroup label="width">
          <div className={styles.col}>
            {LAYOUT_WIDTHS.map((width) => (
              <PropCell
                key={width}
                label={width}
                fullWidth={width === 'stretch'}
                code={`<Box width="${width}">
  <Card>Content</Card>
</Box>`}
              >
                <Box width={width}>
                  <LayoutBoxContent />
                </Box>
              </PropCell>
            ))}
          </div>
        </PropGroup>
      ),
    },
    stack: {
      fullWidth: true,
      body: (
        <div className={styles.matrixPair}>
          <PropGroup label="direction">
            <div className={styles.col}>
              {STACK_DIRECTIONS.map((direction) => (
                <PropCell
                  key={direction}
                  label={direction}
                  code={`<Stack direction="${direction}" gap="medium">
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
</Stack>`}
                >
                  <Stack direction={direction} gap="medium">
                    <StackItems />
                  </Stack>
                </PropCell>
              ))}
            </div>
          </PropGroup>
          <PropGroup label="gap">
            <div className={styles.col}>
              {STACK_GAPS.map((gap) => (
                <PropCell
                  key={gap}
                  label={gap}
                  code={`<Stack direction="horizontal" gap="${gap}">
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
</Stack>`}
                >
                  <Stack direction="horizontal" gap={gap}>
                    <StackItems />
                  </Stack>
                </PropCell>
              ))}
            </div>
          </PropGroup>
          <PropGroup label="align">
            <div className={styles.col}>
              {STACK_ALIGNS.map((align) => (
                <PropCell
                  key={align}
                  label={align}
                  fullWidth
                  code={`<Stack direction="horizontal" align="${align}" width="stretch">
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
</Stack>`}
                >
                  <div className={styles.layoutStackFrame}>
                    <Stack direction="horizontal" align={align} width="stretch">
                      <StackItems />
                    </Stack>
                  </div>
                </PropCell>
              ))}
            </div>
          </PropGroup>
          <PropGroup label="justify">
            <div className={styles.col}>
              {STACK_JUSTIFIES.map((justify) => (
                <PropCell
                  key={justify}
                  label={justify}
                  fullWidth
                  code={`<Stack direction="horizontal" justify="${justify}" width="stretch">
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
</Stack>`}
                >
                  <div className={styles.layoutStackFrame}>
                    <Stack direction="horizontal" justify={justify} width="stretch">
                      <StackItems />
                    </Stack>
                  </div>
                </PropCell>
              ))}
            </div>
          </PropGroup>
          <PropGroup label="wrap">
            <div className={styles.col}>
              {STACK_WRAPS.map((wrap) => (
                <PropCell
                  key={wrap}
                  label={wrap}
                  fullWidth
                  code={`<Stack direction="horizontal" wrap="${wrap}" width="stretch">
  <Card>A</Card>
  <Card>B</Card>
  <Card>C</Card>
</Stack>`}
                >
                  <div className={styles.layoutStackNarrowFrame}>
                    <Stack direction="horizontal" wrap={wrap} width="stretch">
                      <StackItems />
                    </Stack>
                  </div>
                </PropCell>
              ))}
            </div>
          </PropGroup>
        </div>
      ),
    },
    icons: {
      fullWidth: true,
      trailing: (
        <SegmentedButton
          ariaLabel="icon kind"
          value={iconKind}
          onChange={(value) => setIconKind(value === 'fill' ? 'fill' : 'outline')}
          options={[
            { value: 'outline', label: 'outline' },
            { value: 'fill', label: 'fill' },
          ]}
        />
      ),
      body: (
        <div className={styles.block}>
          <div className={styles.iconGrid}>
            {icons.map((name) => (
              <div key={`${iconKind}-${name}`} className={styles.iconItem}>
                <ComponentPreview code={`<Icon name="${name}" kind="${iconKind}" />`}>
                  <div className={styles.iconBox}>
                    <Icon.Primary name={name} kind={iconKind} size="large" />
                  </div>
                </ComponentPreview>
                <span className={styles.iconLabel}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    'brand-icons': {
      fullWidth: true,
      body: (
        <div className={styles.block}>
          <div className={styles.iconGrid}>
            {brandIcons.map((name) => (
              <div key={name} className={styles.iconItem}>
                <ComponentPreview code={`<Icon name="${name}" />`}>
                  <div className={styles.iconBox}>
                    <Icon.Primary name={name} size="large" />
                  </div>
                </ComponentPreview>
                <span className={styles.iconLabel}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    'logo-icons': {
      fullWidth: true,
      body: (
        <div className={styles.block}>
          <div className={styles.iconGrid}>
            {logoIcons.map((name) => (
              <div key={name} className={styles.iconItem}>
                <ComponentPreview code={`<Icon name="${name}" />`}>
                  <div className={styles.iconBox}>
                    <Icon.Primary name={name} size="large" />
                  </div>
                </ComponentPreview>
                <span className={styles.iconLabel}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    icon: {
      fullWidth: true,
      body: (
        <div className={styles.matrixSplit}>
          <PropGroup label="variant">
            <div className={styles.variantTable}>
              {DESIGN_VARIANTS.map((variant) => {
                const IconVariant = ICON_VARIANT[variant];
                return (
                  <div key={variant} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{variant}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_SIZES.map((size) => (
                        <PropCell
                          key={`${variant}-${size}`}
                          label={size}
                          code={`<Icon name="settings" variant="${variant}" size="${size}" />`}
                        >
                          <IconVariant name="settings" size={size} alt="settings" />
                        </PropCell>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </PropGroup>
          <div className={styles.col}>
            <PropGroup label="kind">
              <div className={styles.opacityRow}>
                {(['outline', 'fill'] as const).map((k) => (
                  <PropCell
                    key={k}
                    label={k}
                    code={`<Icon name="settings" kind="${k}" size="large" variant="primary" />`}
                  >
                    <Icon.Primary name="settings" kind={k} size="large" alt={k} />
                  </PropCell>
                ))}
              </div>
            </PropGroup>
            <PropGroup label="opacity">
              <div className={styles.opacityRow}>
                {DESIGN_OPACITIES.map((opacity) => (
                  <PropCell
                    key={opacity}
                    label={opacity}
                    code={`<Icon name="settings" size="medium" variant="primary" opacity="${opacity}" />`}
                  >
                    <Icon.Primary name="settings" size="medium" opacity={opacity} alt={opacity} />
                  </PropCell>
                ))}
              </div>
            </PropGroup>
            <PropGroup label="shape">
              <div className={styles.opacityRow}>
                {DESIGN_SHAPES.map((shape) => (
                  <PropCell
                    key={shape}
                    label={shape}
                    code={`<Icon name="settings" size="medium" variant="secondary" shape="${shape}" />`}
                  >
                    <Icon.Secondary name="settings" size="medium" shape={shape} alt={shape} />
                  </PropCell>
                ))}
              </div>
            </PropGroup>
          </div>
        </div>
      ),
    },
    'icon-button': {
      fullWidth: true,
      body: (
        <div className={styles.matrixSplit}>
          <PropGroup label="variant">
            <div className={styles.variantTable}>
              {DESIGN_VARIANTS.map((variant) => {
                const IconButtonVariant = ICON_BUTTON_VARIANT[variant];
                return (
                  <div key={variant} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{variant}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_SIZES.map((size) => (
                        <PropCell
                          key={`${variant}-${size}`}
                          label={size}
                          code={`<IconButton name="settings" variant="${variant}" size="${size}" />`}
                        >
                          <IconButtonVariant name="settings" size={size} ariaLabel={`${variant} ${size}`} />
                        </PropCell>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </PropGroup>
          <PropGroup label="shape">
            <div className={styles.opacityRow}>
              {DESIGN_SHAPES.map((shape) => (
                <PropCell
                  key={shape}
                  label={shape}
                  code={`<IconButton name="settings" variant="secondary" size="medium" shape="${shape}" />`}
                >
                  <IconButton.Secondary name="settings" size="medium" shape={shape} ariaLabel={shape} />
                </PropCell>
              ))}
            </div>
          </PropGroup>
        </div>
      ),
    },
    'toggle-icon-button': {
      body: (
        <ComponentPreview code={formatToggleIconButtonCode(togglePressed)}>
          <ToggleIconButton
            name={togglePressed ? 'eye-off' : 'eye-open'}
            pressed={togglePressed}
            onClick={() => setTogglePressed((v) => !v)}
            ariaLabel="toggle demo"
          />
        </ComponentPreview>
      ),
    },
    'cycle-icon-button': {
      body: (
        <ComponentPreview
          code={formatCycleIconButtonCode(cycleSort)}
        >
          <CycleIconButton
            value={cycleSort}
            options={CYCLE_ICON_BUTTON_OPTIONS}
            onChange={setCycleSort}
          />
        </ComponentPreview>
      ),
    },
    'theme-toggle-button': {
      body: (
        <ComponentPreview code={`<ThemeToggleButton />`}>
          <ThemeToggleButton />
        </ComponentPreview>
      ),
    },
    'project-sort-button': {
      body: (
        <ComponentPreview code={`<ProjectSortButton />`}>
          <ProjectSortButton />
        </ComponentPreview>
      ),
    },
    'copy-icon-button': {
      body: (
        <ComponentPreview
          code={`<CopyIconButton text="hello@example.com" />`}
        >
          <CopyIconButton text="hello@example.com" />
        </ComponentPreview>
      ),
    },
    'settings-button': {
      body: (
        <ComponentPreview code={`<SettingsButton />`}>
          <SettingsButton />
        </ComponentPreview>
      ),
    },
    text: {
      fullWidth: true,
      body: (
        <>
          <div className={styles.matrixPair}>
            <PropGroup label="label / size × variant">
              <div className={styles.variantTable}>
                {DESIGN_SIZES.map((size) => (
                  <div key={`text-label-${size}`} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{size}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_VARIANTS.map((variant) => {
                        const TextVariant = TEXT_VARIANT[variant];
                        return (
                          <PropCell
                            key={`${size}-${variant}`}
                            label={variant}
                            code={`<Text variant="${variant}" size="${size}">${variant}</Text>`}
                          >
                            <TextVariant size={size}>{variant}</TextVariant>
                          </PropCell>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </PropGroup>
            <PropGroup label="icon + label / size × variant">
              <div className={styles.variantTable}>
                {DESIGN_SIZES.map((size) => (
                  <div key={`text-icon-${size}`} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{size}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_VARIANTS.map((variant) => {
                        const TextVariant = TEXT_VARIANT[variant];
                        return (
                          <PropCell
                            key={`${size}-${variant}`}
                            label={variant}
                            code={`<Text variant="${variant}" size="${size}" iconName="github">${variant}</Text>`}
                          >
                            <TextVariant size={size} iconName="github">
                              {variant}
                            </TextVariant>
                          </PropCell>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </PropGroup>
          </div>
          <div className={styles.block}>
            <div className={styles.matrixSplit}>
              <PropGroup label="shape">
                <div className={styles.opacityRow}>
                  {DESIGN_SHAPES.map((shape) => (
                    <PropCell
                      key={shape}
                      label={shape}
                      code={`<Text variant="secondary" size="medium" shape="${shape}">${shape}</Text>`}
                    >
                      <Text.Secondary size="medium" shape={shape}>
                        {shape}
                      </Text.Secondary>
                    </PropCell>
                  ))}
                </div>
              </PropGroup>
              <PropGroup label="opacity">
                <div className={styles.opacityRow}>
                  {DESIGN_OPACITIES.map((opacity) => (
                    <PropCell
                      key={opacity}
                      label={opacity}
                      code={`<Text variant="secondary" size="medium" opacity="${opacity}">${opacity}</Text>`}
                    >
                      <Text.Secondary size="medium" opacity={opacity}>
                        {opacity}
                      </Text.Secondary>
                    </PropCell>
                  ))}
                </div>
              </PropGroup>
            </div>
          </div>
        </>
      ),
    },
    heading: {
      fullWidth: true,
      body: (
        <PropGroup label="align">
          <div className={styles.colStretch}>
            <PropCell
              label="left"
              fullWidth
              code={`<Heading text="Section Title" align="left" />`}
            >
              <Heading text="Section Title" align="left" />
            </PropCell>
            <PropCell
              label="center"
              fullWidth
              code={`<Heading text="Centered Title" align="center" />`}
            >
              <Heading text="Centered Title" align="center" />
            </PropCell>
          </div>
        </PropGroup>
      ),
    },
    'code-block': {
      fullWidth: true,
      body: (
        <PropGroup label="syntaxHighlight">
          <div className={styles.colStretch}>
            <PropCell
              label="true (default)"
              fullWidth
              code={`<CodeBlock code={sample} language="tsx" />`}
            >
              <CodeBlock
                code={`<IconButton.Outlined
  name="settings"
  ariaLabel="설정 열기"
/>`}
                language="tsx"
              />
            </PropCell>
            <PropCell
              label="false + highlightWords"
              fullWidth
              code={`<CodeBlock
  code={sample}
  syntaxHighlight={false}
  highlightWords={['IconButton', 'Icon']}
/>`}
            >
              <CodeBlock
                code={`function IconButton({ name, ariaLabel }) {
  return (
    <button aria-label={ariaLabel}>
      <Icon.Primary name={name} />
    </button>
  );
}`}
                syntaxHighlight={false}
                highlightWords={['IconButton', 'Icon']}
              />
            </PropCell>
          </div>
        </PropGroup>
      ),
    },
    'text-button': {
      fullWidth: true,
      body: (
        <>
          <div className={styles.matrixPair}>
            <div className={styles.matrixGroup}>
              <p className={styles.matrixGroupLabel}>label</p>
              <div className={styles.variantTable}>
                {DESIGN_SIZES.map((size) => (
                  <div key={`tb-label-${size}`} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{size}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_VARIANTS.map((variant) => {
                        const TextButtonVariant = TEXT_BUTTON_VARIANT[variant];
                        return (
                          <div key={`${size}-${variant}`} className={styles.variantCell}>
                            <span className={styles.variantCellLabel}>{variant}</span>
                            <div className={styles.variantStack}>
                              <ComponentPreview
                                code={`<TextButton variant="${variant}" size="${size}">${variant}</TextButton>`}
                              >
                                <TextButtonVariant size={size} ariaLabel={`${size} ${variant}`}>
                                  {variant}
                                </TextButtonVariant>
                              </ComponentPreview>
                              <ComponentPreview
                                code={`<TextButton variant="${variant}" size="${size}" disabled>${variant}</TextButton>`}
                              >
                                <TextButtonVariant size={size} disabled ariaLabel={`${size} ${variant} disabled`}>
                                  {variant}
                                </TextButtonVariant>
                              </ComponentPreview>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.matrixGroup}>
              <p className={styles.matrixGroupLabel}>icon + label</p>
              <div className={styles.variantTable}>
                {DESIGN_SIZES.map((size) => (
                  <div key={`tb-icon-${size}`} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{size}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_VARIANTS.map((variant) => {
                        const TextButtonVariant = TEXT_BUTTON_VARIANT[variant];
                        return (
                          <div key={`${size}-${variant}`} className={styles.variantCell}>
                            <span className={styles.variantCellLabel}>{variant}</span>
                            <div className={styles.variantStack}>
                              <ComponentPreview
                                code={`<TextButton variant="${variant}" size="${size}" iconName="github">${variant}</TextButton>`}
                              >
                                <TextButtonVariant size={size} iconName="github" ariaLabel={`${size} ${variant} icon`}>
                                  {variant}
                                </TextButtonVariant>
                              </ComponentPreview>
                              <ComponentPreview
                                code={`<TextButton variant="${variant}" size="${size}" iconName="github" disabled>${variant}</TextButton>`}
                              >
                                <TextButtonVariant
                                  size={size}
                                  iconName="github"
                                  disabled
                                  ariaLabel={`${size} ${variant} icon disabled`}
                                >
                                  {variant}
                                </TextButtonVariant>
                              </ComponentPreview>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.block}>
            <PropGroup label="shape">
              <div className={styles.opacityRow}>
                {DESIGN_SHAPES.map((shape) => (
                  <PropCell
                    key={shape}
                    label={shape}
                    code={`<TextButton variant="secondary" size="medium" shape="${shape}">${shape}</TextButton>`}
                  >
                    <TextButton.Secondary size="medium" shape={shape} ariaLabel={shape}>
                      {shape}
                    </TextButton.Secondary>
                  </PropCell>
                ))}
              </div>
            </PropGroup>
          </div>
        </>
      ),
    },
    'goto-button': {
      body: (
        <div className={styles.opacityRow}>
          <PropCell label="text hug" code={`<GotoButton>Go to projects</GotoButton>`}>
            <GotoButton ariaLabel="Go to projects" onClick={() => undefined}>
              Go to projects
            </GotoButton>
          </PropCell>
          <PropCell
            label="text stretch"
            code={`<GotoButton width="stretch">Very long document title for stretch</GotoButton>`}
          >
            <div style={{ width: 220 }}>
              <GotoButton ariaLabel="Doc title" width="stretch" onClick={() => undefined}>
                Very long document title for stretch
              </GotoButton>
            </div>
          </PropCell>
        </div>
      ),
    },
    'typed-external-link': {
      body: (
        <ComponentPreview
          code={`<TypedExternalLink typeLabel="GitHub" title="portfolio" href="https://github.com" />`}
        >
          <TypedExternalLink typeLabel="GitHub" title="portfolio" href="https://github.com" />
        </ComponentPreview>
      ),
    },
    'nav-button': {
      body: (
        <div className={styles.row}>
          <ComponentPreview code={`<NavButton href="#education">Education</NavButton>`}>
            <NavButton href="#education" ariaLabel="Education">
              Education
            </NavButton>
          </ComponentPreview>
          <ComponentPreview code={`<NavButton href="#main" iconName="pano" />`}>
            <NavButton href="#main" ariaLabel="Main" iconName="pano" />
          </ComponentPreview>
        </div>
      ),
    },
    tag: {
      body: (
        <PropGroup label="underline">
          <div className={styles.opacityRow}>
            <PropCell label="false" code={`<Tag name="web" />`}>
              <Tag name="web" />
            </PropCell>
            <PropCell label="true" code={`<Tag name="ai-usage" underline />`}>
              <Tag name="ai-usage" underline />
            </PropCell>
          </div>
        </PropGroup>
      ),
    },
    'tag-button': {
      body: (
        <div className={styles.row}>
          {['maintenance', 'in-production'].map((name) => (
            <ComponentPreview key={name} code={`<TagButton name="${name}" />`}>
              <TagButton name={name} ariaLabel={name} onClick={() => undefined} />
            </ComponentPreview>
          ))}
        </div>
      ),
    },
    chip: {
      fullWidth: true,
      body: (
        <>
          <div className={styles.matrixPair}>
            <PropGroup label="label / size × variant">
              <div className={styles.variantTable}>
                {DESIGN_SIZES.map((size) => (
                  <div key={`chip-label-${size}`} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{size}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_VARIANTS.map((variant) => {
                        const ChipVariant = CHIP_VARIANT[variant];
                        return (
                          <PropCell
                            key={`${size}-${variant}`}
                            label={variant}
                            code={`<Chip label="${variant}" variant="${variant}" size="${size}" />`}
                          >
                            <ChipVariant label={variant} size={size} />
                          </PropCell>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </PropGroup>
            <PropGroup label="icon + label / size × variant">
              <div className={styles.variantTable}>
                {DESIGN_SIZES.map((size) => (
                  <div key={`chip-icon-${size}`} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{size}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_VARIANTS.map((variant) => {
                        const ChipVariant = CHIP_VARIANT[variant];
                        return (
                          <PropCell
                            key={`${size}-${variant}`}
                            label={variant}
                            code={`<Chip label="${variant}" iconName="react" variant="${variant}" size="${size}" />`}
                          >
                            <ChipVariant label={variant} iconName="react" size={size} />
                          </PropCell>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </PropGroup>
          </div>
          <div className={styles.block}>
            <div className={styles.matrixSplit}>
              <PropGroup label="shape">
                <div className={styles.opacityRow}>
                  {DESIGN_SHAPES.map((shape) => (
                    <PropCell
                      key={shape}
                      label={shape}
                      code={`<Chip label="React" variant="outlined" size="medium" shape="${shape}" />`}
                    >
                      <Chip.Outlined label="React" size="medium" shape={shape} />
                    </PropCell>
                  ))}
                </div>
              </PropGroup>
              <PropGroup label="opacity">
                <div className={styles.opacityRow}>
                  {DESIGN_OPACITIES.map((opacity) => (
                    <PropCell
                      key={opacity}
                      label={opacity}
                      code={`<Chip label="React" variant="secondary" size="medium" opacity="${opacity}" />`}
                    >
                      <Chip.Secondary label="React" size="medium" opacity={opacity} />
                    </PropCell>
                  ))}
                </div>
              </PropGroup>
            </div>
          </div>
        </>
      ),
    },
    'chip-button': {
      fullWidth: true,
      body: (
        <>
          <div className={styles.matrixPair}>
            <div className={styles.matrixGroup}>
              <p className={styles.matrixGroupLabel}>label</p>
              <div className={styles.variantTable}>
                {DESIGN_SIZES.map((size) => (
                  <div key={`cb-label-${size}`} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{size}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_VARIANTS.map((variant) => {
                        const ChipButtonVariant = CHIP_BUTTON_VARIANT[variant];
                        return (
                          <div key={`${size}-${variant}`} className={styles.variantCell}>
                            <span className={styles.variantCellLabel}>{variant}</span>
                            <div className={styles.variantStack}>
                              <ComponentPreview
                                code={`<ChipButton label="React" variant="${variant}" size="${size}" />`}
                              >
                                <ChipButtonVariant
                                  label="React"
                                  size={size}
                                  ariaLabel={`${size} ${variant}`}
                                  onClick={() => undefined}
                                />
                              </ComponentPreview>
                              <ComponentPreview
                                code={`<ChipButton label="React" variant="${variant}" size="${size}" disabled />`}
                              >
                                <ChipButtonVariant
                                  label="React"
                                  size={size}
                                  disabled
                                  ariaLabel={`${size} ${variant} disabled`}
                                  onClick={() => undefined}
                                />
                              </ComponentPreview>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.matrixGroup}>
              <p className={styles.matrixGroupLabel}>icon + label</p>
              <div className={styles.variantTable}>
                {DESIGN_SIZES.map((size) => (
                  <div key={`cb-icon-${size}`} className={styles.variantRow}>
                    <div className={styles.variantRowLabel}>{size}</div>
                    <div className={styles.variantCells}>
                      {DESIGN_VARIANTS.map((variant) => {
                        const ChipButtonVariant = CHIP_BUTTON_VARIANT[variant];
                        return (
                          <div key={`${size}-${variant}`} className={styles.variantCell}>
                            <span className={styles.variantCellLabel}>{variant}</span>
                            <div className={styles.variantStack}>
                              <ComponentPreview
                                code={`<ChipButton label="React" iconName="react" variant="${variant}" size="${size}" />`}
                              >
                                <ChipButtonVariant
                                  label="React"
                                  iconName="react"
                                  size={size}
                                  ariaLabel={`${size} ${variant} icon`}
                                  onClick={() => undefined}
                                />
                              </ComponentPreview>
                              <ComponentPreview
                                code={`<ChipButton label="React" iconName="react" variant="${variant}" size="${size}" disabled />`}
                              >
                                <ChipButtonVariant
                                  label="React"
                                  iconName="react"
                                  size={size}
                                  disabled
                                  ariaLabel={`${size} ${variant} icon disabled`}
                                  onClick={() => undefined}
                                />
                              </ComponentPreview>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.block}>
            <PropGroup label="shape">
              <div className={styles.opacityRow}>
                {DESIGN_SHAPES.map((shape) => (
                  <PropCell
                    key={shape}
                    label={shape}
                    code={`<ChipButton label="React" variant="outlined" size="medium" shape="${shape}" />`}
                  >
                    <ChipButton.Outlined
                      label="React"
                      size="medium"
                      shape={shape}
                      ariaLabel={shape}
                      onClick={() => undefined}
                    />
                  </PropCell>
                ))}
              </div>
            </PropGroup>
          </div>
        </>
      ),
    },
    'status-chip': {
      body: (
        <PropGroup label="type">
          <div className={styles.opacityRow}>
            <PropCell
              label={PROJECT_STATUS.LIVE}
              code={`<StatusChip type="${PROJECT_STATUS.LIVE}" />`}
            >
              <StatusChip type={PROJECT_STATUS.LIVE} />
            </PropCell>
            <PropCell
              label={PROJECT_STATUS.MAINTAINED}
              code={`<StatusChip type="${PROJECT_STATUS.MAINTAINED}" />`}
            >
              <StatusChip type={PROJECT_STATUS.MAINTAINED} />
            </PropCell>
            <PropCell
              label={PROJECT_STATUS.ENDED}
              code={`<StatusChip type="${PROJECT_STATUS.ENDED}" />`}
            >
              <StatusChip type={PROJECT_STATUS.ENDED} />
            </PropCell>
          </div>
        </PropGroup>
      ),
    },
    'stack-chip-button': {
      body: (
        <div className={styles.row}>
          {stackChips.map(({ label, iconName }) => (
            <ComponentPreview
              key={label}
              code={
                iconName
                  ? `<StackChipButton label="${label}" iconName="${iconName}" />`
                  : `<StackChipButton label="${label}" />`
              }
            >
              <StackChipButton
                label={label}
                {...(iconName ? { iconName } : {})}
                ariaLabel={label}
                onClick={() => undefined}
              />
            </ComponentPreview>
          ))}
        </div>
      ),
    },
    'skill-chip-button': {
      body: (
        <div className={styles.row}>
          {skillChips.map(({ label, iconName }) => (
            <ComponentPreview
              key={label}
              code={
                iconName
                  ? `<SkillChipButton label="${label}" iconName="${iconName}" />`
                  : `<SkillChipButton label="${label}" />`
              }
            >
              <SkillChipButton
                label={label}
                {...(iconName ? { iconName } : {})}
                ariaLabel={label}
                onClick={() => undefined}
              />
            </ComponentPreview>
          ))}
        </div>
      ),
    },
    'relation-chip-button': {
      body: (
        <PropGroup label="type">
          <div className={styles.opacityRow}>
            <PropCell
              label="inner"
              code={`<RelationChipButton type="inner" label="Icon" href="#icon" />`}
            >
              <RelationChipButton type="inner" label="Icon" href="#icon" />
            </PropCell>
            <PropCell
              label="outer"
              code={`<RelationChipButton type="outer" label="Nav" href="#nav" />`}
            >
              <RelationChipButton type="outer" label="Nav" href="#nav" />
            </PropCell>
          </div>
        </PropGroup>
      ),
    },
    'search-chip-button': {
      body: (
        <ComponentPreview code={`<SearchChipButton label="Mock Project" />`}>
          <SearchChipButton
            label="Mock Project"
            ariaLabel="Mock search chip"
            onClick={() => undefined}
          />
        </ComponentPreview>
      ),
    },
    'search-shortcut-chip-button': {
      body: (
        <ComponentPreview code={`<SearchShortcutChipButton type="extify" />`}>
          <SearchShortcutChipButton type="extify" />
        </ComponentPreview>
      ),
    },
    'search-field': {
      body: (
        <ComponentPreview
          code={`<SearchField value="${escapeCodeString(searchDemo)}" onChange={handleChange} width="stretch" />`}
        >
          <SearchField
            value={searchDemo}
            onChange={setSearchDemo}
            ariaLabel="search demo"
            width="stretch"
          />
        </ComponentPreview>
      ),
    },
    'code-field': {
      fullWidth: true,
      body: (
        <ComponentPreview
          code={`<CodeField
  value={code}
  onChange={setCode}
  ariaLabel="code"
  width="stretch"
  language="tsx"
  showLine
/>`}
        >
          <CodeField
            value={codeDemo}
            onChange={setCodeDemo}
            ariaLabel="code demo"
            width="stretch"
            rows={8}
            language="tsx"
            showLine
          />
        </ComponentPreview>
      ),
    },
    'project-search-field': {
      body: (
        <ComponentPreview
          code={`<ProjectSearchField showResultCount matchedCount={0} totalCount={0} />`}
        >
          <ProjectSearchField showResultCount matchedCount={0} totalCount={0} />
        </ComponentPreview>
      ),
    },
    'segmented-button': {
      body: (
        <ComponentPreview code={formatSegmentedButtonCode(segment)}>
          <SegmentedButton
            ariaLabel="demo segment"
            value={segment}
            onChange={setSegment}
            options={SEGMENTED_BUTTON_OPTIONS}
          />
        </ComponentPreview>
      ),
    },
    'language-segmented-button': {
      fullWidth: true,
      body: (
        <PropGroup label="width">
          <div className={styles.col}>
            {LAYOUT_WIDTHS.map((width) => (
              <PropCell
                key={width}
                label={width}
                fullWidth={width === 'stretch'}
                code={`<LanguageSegmentedButton width="${width}" />`}
              >
                <LanguageSegmentedButton width={width} />
              </PropCell>
            ))}
          </div>
        </PropGroup>
      ),
    },
    'control-slider': {
      fullWidth: true,
      body: (
        <div className={styles.matrixPair}>
          <PropGroup label="width">
            <div className={styles.col}>
              {LAYOUT_WIDTHS.map((width) => {
                const value = sliderBySize.medium;
                return (
                  <PropCell
                    key={width}
                    label={width}
                    fullWidth={width === 'stretch'}
                    code={`<ControlSlider legend="Columns" value={${value}} min={1} max={5} width="${width}" />`}
                  >
                    <ControlSlider
                      legend="Columns"
                      value={value}
                      min={1}
                      max={5}
                      width={width}
                      onChange={(next) =>
                        setSliderBySize((prev) => ({ ...prev, medium: next }))
                      }
                      displayValue={String(value)}
                      ariaLabel={`columns ${width}`}
                      ariaValueText={`${value}`}
                      decreaseLabel="decrease"
                      increaseLabel="increase"
                    />
                  </PropCell>
                );
              })}
            </div>
          </PropGroup>
          <PropGroup label="size">
            <div className={styles.sizeMatrix}>
              {DESIGN_SIZES.map((size) => {
                const value = sliderBySize[size];
                return (
                  <div key={size} className={styles.matrixGroup}>
                    <p className={styles.matrixGroupLabel}>{size}</p>
                    <ComponentPreview
                      fullWidth
                      code={`<ControlSlider legend="Columns" value={${value}} min={1} max={5} size="${size}" />`}
                    >
                      <ControlSlider
                        legend="Columns"
                        value={value}
                        min={1}
                        max={5}
                        size={size}
                        onChange={(next) =>
                          setSliderBySize((prev) => ({ ...prev, [size]: next }))
                        }
                        displayValue={String(value)}
                        ariaLabel={`columns ${size}`}
                        ariaValueText={`${value}`}
                        decreaseLabel="decrease"
                        increaseLabel="increase"
                      />
                    </ComponentPreview>
                  </div>
                );
              })}
            </div>
          </PropGroup>
        </div>
      ),
    },
    'speed-control-slider': {
      body: (
        <ControlWidthPreviews
          renderCode={(width) => `<SpeedControlSlider width="${width}" />`}
          renderPreview={(width) => <SpeedControlSlider width={width} />}
        />
      ),
    },
    'font-scale-control-slider': {
      body: (
        <ControlWidthPreviews
          renderCode={(width) => `<FontScaleControlSlider width="${width}" />`}
          renderPreview={(width) => <FontScaleControlSlider width={width} />}
        />
      ),
    },
    'column-control-slider': {
      body: (
        <ControlWidthPreviews
          renderCode={(width) =>
            `<ColumnControlSlider value={${columnValue}} min={1} max={5} width="${width}" />`
          }
          renderPreview={(width) => (
            <ColumnControlSlider
              value={columnValue}
              min={1}
              max={5}
              width={width}
              onChange={setColumnValue}
            />
          )}
        />
      ),
    },
    modal: {
      body: (
        <>
          <PropGroup label="size">
            <div className={styles.opacityRow}>
              <PropCell
                label="default"
                code={`<Modal title="Gallery Modal" size="default" onClose={handleClose}><p>Content</p></Modal>`}
              >
                <TextButton.Outlined
                  onClick={() => {
                    setModalSize('default');
                    setModalOpen(true);
                  }}
                  ariaLabel={a11y('components.openModal')}
                >
                  default
                </TextButton.Outlined>
              </PropCell>
              <PropCell
                label="compact"
                code={`<Modal title="Gallery Modal" size="compact" onClose={handleClose}><p>Content</p></Modal>`}
              >
                <TextButton.Outlined
                  onClick={() => {
                    setModalSize('compact');
                    setModalOpen(true);
                  }}
                  ariaLabel={`${a11y('components.openModal')} compact`}
                >
                  compact
                </TextButton.Outlined>
              </PropCell>
            </div>
          </PropGroup>
          {modalOpen && (
            <Modal
              titleId="gallery-modal-title"
              title="Gallery Modal"
              onClose={() => setModalOpen(false)}
              size={modalSize}
              titleVisible
            >
              <p>Modal 샘플 콘텐츠입니다. size={modalSize}</p>
            </Modal>
          )}
        </>
      ),
    },
    'settings-modal': {
      fullWidth: true,
      body: (
        <ComponentPreview code={`<SettingsModal onClose={handleClose} />`}>
          <SettingsModal embedded onClose={() => undefined} />
        </ComponentPreview>
      ),
    },
    card: {
      body: (
        <div className={styles.row}>
          <ComponentPreview
            code={`<Card>
  <Text.Primary size="small">Card</Text.Primary>
</Card>`}
          >
            <Card>
              <Text.Primary size="small">Card</Text.Primary>
            </Card>
          </ComponentPreview>
          <ComponentPreview
            code={`<Card>
  <Icon name="settings" size="medium" variant="primary" />
  <Text.Secondary size="small">Settings</Text.Secondary>
</Card>`}
          >
            <Card>
              <Icon.Primary name="settings" size="medium" />
              <Text.Secondary size="small">Settings</Text.Secondary>
            </Card>
          </ComponentPreview>
          <ComponentPreview
            code={`<Card>
  <Text.Primary size="small">React</Text.Primary>
  <Chip.Outlined label="Stable" size="small" />
</Card>`}
          >
            <Card>
              <Text.Primary size="small">React</Text.Primary>
              <Chip.Outlined label="Stable" size="small" />
            </Card>
          </ComponentPreview>
        </div>
      ),
    },
    'cursor-ring': {
      fullWidth: true,
      body: (
        <>
          <CursorRing />
          <div className={styles.row}>
            <CursorRing.Target>
              <div className={styles.demoCard}>
              Interactive card
              </div>
            </CursorRing.Target>
          </div>
        </>
      ),
    },
    'flip-card': {
      body: (
        <ComponentPreview
          code={`<FlipCard
  front={<Text.Primary>Front</Text.Primary>}
  back={<Text.Primary>Back</Text.Primary>}
  onOpen={handleOpen}
  ariaLabel="Open preview"
/>`}
        >
          <div className={styles.flipCardDemo}>
            <FlipCard
              front={<Text.Primary>Front</Text.Primary>}
              back={<Text.Primary>Back</Text.Primary>}
              onOpen={() => undefined}
              ariaLabel="Open preview"
            />
          </div>
        </ComponentPreview>
      ),
    },
    'field-card': {
      fullWidth: true,
      body: (
        <div className={styles.cardPreviewList}>
          {FIELD_CARD_EXAMPLES.map((field) => (
            <ComponentPreview
              key={field.iconName}
              code={`<FieldCard
  iconName="${field.iconName}"
  label="${field.label}"
  value="${field.value}"
/>`}
            >
              <FieldCard
                iconName={field.iconName}
                label={field.label}
                value={field.value}
              />
            </ComponentPreview>
          ))}
        </div>
      ),
    },
    'contact-field-card': {
      fullWidth: true,
      body: (
        <div className={styles.cardPreviewList}>
          {CONTACT_FIELD_KEYS.map((key) => (
            <ComponentPreview key={key} code={`<ContactFieldCard field="${key}" />`}>
              <ul className={styles.cardPreviewItemList}>
                <ContactFieldCard field={key} />
              </ul>
            </ComponentPreview>
          ))}
        </div>
      ),
    },
    'experience-slot-card': {
      body: (
        <ComponentPreview
          code={`<ExperienceSlotCard
  media={<div>Thumbnail</div>}
  title="Company"
  meta={
    <>
      <span>Backend Engineer</span>
      <span>2023. 03 ~ 2025. 02</span>
    </>
  }
  content={
    <ul>
      <li>Payment pipeline redesign</li>
      <li>Search latency -40%</li>
    </ul>
  }
  footer={<GotoButton onClick={handleClick}>Go to projects</GotoButton>}
/>`}
        >
          <div className={styles.experienceSlotCardDemo}>
            <ExperienceSlotCard
              media={<div className={slotStyles.placeholderImage}>Thumbnail</div>}
              title="Company"
              meta={
                <>
                  <span className={slotStyles.position}>Backend Engineer</span>
                  <span className={slotStyles.duration}>2023. 03 ~ 2025. 02</span>
                </>
              }
              content={
                <ul className={slotStyles.sectionTitles}>
                  <li>
                    <TwoLineText text="Payment pipeline redesign" />
                  </li>
                  <li>
                    <TwoLineText text="Search latency -40%" />
                  </li>
                </ul>
              }
              footer={
                <GotoButton ariaLabel="Go to projects" onClick={() => undefined}>
                  Go to projects
                </GotoButton>
              }
            />
          </div>
        </ComponentPreview>
      ),
    },
    'experience-card': {
      body: (
        <ComponentPreview code={`<ExperienceCard experience={boostcamp} />`}>
          <div className={styles.experienceSlotCardDemo}>
            <ExperienceCard experience={GALLERY_BOOSTCAMP} />
          </div>
        </ComponentPreview>
      ),
    },
    'project-slot-card': {
      body: (
        <ComponentPreview
          code={`<ProjectSlotCard
  media={<div>Slot cover</div>}
  title="Slot Demo App"
  year="2024"
  tags={[<TagButton name="demo" />]}
  stacks={[<StackChipButton label="React" />]}
  back={<Text.Primary>Slot back face</Text.Primary>}
  onOpen={handleOpen}
/>`}
        >
          <div className={styles.projectSlotCardDemo}>
            <ProjectSlotCard
              media={<div className={styles.slotDemoProjectMedia}>Slot cover</div>}
              title="Slot Demo App"
              year="2024"
              tags={[
                <TagButton key="demo" name="demo" onClick={() => undefined} ariaLabel="demo" />,
                <TagButton key="slot" name="slot" onClick={() => undefined} ariaLabel="slot" />,
              ]}
              stacks={[
                <StackChipButton key="React" label="React" onClick={() => undefined} ariaLabel="React" />,
              ]}
              back={<Text.Primary>Slot back face</Text.Primary>}
              onOpen={() => undefined}
              ariaLabel="Project slot card demo"
            />
          </div>
        </ComponentPreview>
      ),
    },
    'project-card': {
      body: (
        <ComponentPreview code={`<ProjectCard project={psStudio} />`}>
          <div className={styles.projectSlotCardDemo}>
            <ProjectCard project={GALLERY_PS_STUDIO} />
          </div>
        </ComponentPreview>
      ),
    },
    'doc-row': {
      body: (
        <ComponentPreview code={`<DocRow doc={doc} onChipClick={handleChipClick} onNavigate={trackDocClick} />`}>
          <DocRow
            doc={{
              id: 'doc-row-demo',
              title: 'Fitween 릴리즈 노트',
              link: '#',
              chipLabel: 'Fitween',
              source: { searchQuery: 'Fitween' },
            }}
            onChipClick={(e) => e.preventDefault()}
            onNavigate={() => undefined}
          />
        </ComponentPreview>
      ),
    },
  };

  return (
    <div className={styles.contentWithToc}>
      <div className={styles.galleryBody}>
        {tocGroups.map((group) => (
          <div key={group.heading} className={styles.masonryGroup}>
            <h3 className={styles.masonryGroupHeading}>{group.heading}</h3>
            <div className={styles.masonryColumns}>
              {group.sections.map((section) => {
                const entry = sectionEntries[section.id];
                if (!entry) return null;
                return (
                  <Section
                    key={section.id}
                    id={section.id}
                    view={view}
                    trailing={entry.trailing}
                    fullWidth={entry.fullWidth}
                  >
                    {entry.body}
                  </Section>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <TableOfContents groups={tocGroups} />
    </div>
  );
}
