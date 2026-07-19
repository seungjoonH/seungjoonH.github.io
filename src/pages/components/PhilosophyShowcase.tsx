// /components/philosophy. 계층/관계/Layout/Feature/토큰화 쇼케이스
import { useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';
import { ChipSelect } from '@components/interactive/chipSelect/ChipSelect';
import CodeBlock from '@components/design/codeBlock/CodeBlock';
import { CodeField } from '@components/interactive/field/CodeField';
import { GotoButton } from '@components/interactive/button/GotoButton';
import { ToggleIconButton } from '@components/interactive/icon/ToggleIconButton';
import { Icon } from '@components/design/icon/Icon';
import { Chip } from '@components/design/chip/Chip';
import { Card } from '@components/design/card/Card';
import { IconButton } from '@components/interactive/icon/IconButton';
import { TextButton } from '@components/interactive/button/TextButton';
import { SettingsButton } from '@components/feature/SettingsButton';
import { StatusChip } from '@components/composed/chip/StatusChip';
import { SearchChipButton } from '@components/composed/chip/SearchChipButton';
import { PROJECT_STATUS } from '@sections/projects/status/projectStatus';
import { Stack, type StackAlign, type StackDirection, type StackGap, type StackJustify } from '@components/layout/stack/Stack';
import type { LayoutWidth } from '@components/design/designTokens';
import { CompareColumn } from '../guides/CompareColumn';
import { buildCls } from '@utils/cssUtil';
import { GalleryTitle } from './helpers/GalleryTitle';
import {
  DEFAULT_PLAYGROUND_CHILDREN,
  formatStackSnippet,
  parseStackSnippet,
  type PlaygroundChild,
  type PlaygroundVariantName,
  type StackPlaygroundProps,
} from './helpers/stackPlaygroundCode';
import a11yStyles from '../guides/accessibility.module.css';
import styles from './helpers/philosophy.module.css';

type PhilFocus = 'layers' | 'relations' | 'layout' | 'feature' | 'tokens';
type EdgeKind = 'wrap' | 'context' | 'compose' | 'embed';

const FOCUS_QUERY = 'focus';
const FOCUS_DEFAULT: PhilFocus = 'layers';
const FOCUS_VALUES: readonly PhilFocus[] = [
  'layers',
  'relations',
  'layout',
  'feature',
  'tokens',
];

function parseFocus(raw: string | null): PhilFocus {
  return FOCUS_VALUES.includes(raw as PhilFocus) ? (raw as PhilFocus) : FOCUS_DEFAULT;
}

const FOCUS_OPTIONS: { value: PhilFocus; label: string }[] = [
  { value: 'layers', label: '계층 구분' },
  { value: 'relations', label: '구성 관계' },
  { value: 'layout', label: '배치 컴포넌트 (Layout)' },
  { value: 'feature', label: '완성형 컴포넌트 (Feature)' },
  { value: 'tokens', label: '디자인 토큰화' },
];

const LAYER_CHAIN = [
  {
    id: 'layout',
    label: 'Layout',
    def: '컴포넌트의 배치를 담당하는 보이지 않는 컴포넌트',
    examples: ['Stack', 'Box'],
  },
  {
    id: 'design',
    label: 'Design',
    def: '가장 근본적인 디자인을 담당하는 컴포넌트',
    examples: ['Icon', 'Chip', 'Card'],
  },
  {
    id: 'interactive',
    label: 'Interactive',
    def: '사용자 인터랙션을 추가한 컴포넌트. 단독 사용은 지양',
    examples: ['IconButton', 'TextButton', 'CodeField'],
  },
  {
    id: 'composed',
    label: 'Composed',
    def: '여러 컴포넌트를 조합해 의미를 부여한 컴포넌트. 화면 비종속',
    examples: ['StatusChip', 'FieldCard', 'NavButton'],
  },
  {
    id: 'feature',
    label: 'Feature',
    def: '특정 화면과 도메인 맥락에 묶인 완결 컴포넌트',
    examples: ['SettingsButton', 'ProjectSearchField'],
  },
] as const;

const LAYER_INVISIBLE = LAYER_CHAIN.filter((layer) => layer.id === 'layout');
const LAYER_VISIBLE = LAYER_CHAIN.filter((layer) => layer.id !== 'layout');


/** Structure와 동일 표준. 설명 순서: 확장 → 사용 → 조합 → 구체화 */
const EDGE_LEGEND: {
  kind: EdgeKind;
  label: string;
  title: string;
  hint: string;
  dashed: boolean;
  filled: boolean;
}[] = [
  {
    kind: 'wrap',
    label: '확장',
    title: '확장 (Expand)',
    hint: 'Icon → IconButton',
    dashed: false,
    filled: false,
  },
  {
    kind: 'embed',
    label: '사용',
    title: '사용 (Use)',
    hint: 'Icon → Chip',
    dashed: true,
    filled: true,
  },
  {
    kind: 'compose',
    label: '조합',
    title: '조합 (Compose)',
    hint: 'GotoButton → DocRow',
    dashed: false,
    filled: true,
  },
  {
    kind: 'context',
    label: '구체화',
    title: '구체화 (Specify)',
    hint: 'Chip → StatusChip',
    dashed: true,
    filled: false,
  },
];

const EDGE_BY_KIND = Object.fromEntries(EDGE_LEGEND.map((item) => [item.kind, item])) as Record<
  EdgeKind,
  (typeof EDGE_LEGEND)[number]
>;

const STACK_DIRECTIONS: StackDirection[] = ['horizontal', 'vertical'];
const STACK_JUSTIFIES: StackJustify[] = ['start', 'center', 'end', 'spaceBetween'];
const STACK_ALIGNS: StackAlign[] = ['start', 'center', 'end', 'stretch'];
const STACK_GAPS: StackGap[] = ['none', 'small', 'medium', 'large'];
const STACK_WIDTHS: LayoutWidth[] = ['hug', 'stretch'];

const INITIAL_STACK_PROPS: StackPlaygroundProps = {
  direction: 'horizontal',
  justify: 'start',
  align: 'stretch',
  gap: 'medium',
  width: 'stretch',
};

const ICON_BY_VARIANT = {
  Primary: Icon.Primary,
  Secondary: Icon.Secondary,
  Outlined: Icon.Outlined,
} as const satisfies Record<PlaygroundVariantName, typeof Icon.Primary>;

const CHIP_BY_VARIANT = {
  Primary: Chip.Primary,
  Secondary: Chip.Secondary,
  Outlined: Chip.Outlined,
} as const satisfies Record<PlaygroundVariantName, typeof Chip.Primary>;

function renderPlaygroundChild(child: PlaygroundChild, index: number): ReactNode {
  if (child.kind === 'icon') {
    const IconVariant = ICON_BY_VARIANT[child.variant];
    return <IconVariant key={index} name={child.name} size={child.size} />;
  }
  if (child.kind === 'chip') {
    const ChipVariant = CHIP_BY_VARIANT[child.variant];
    return <ChipVariant key={index} label={child.label} size={child.size} />;
  }
  return (
    <Card key={index}>
      <span className={styles.playItem}>{child.text}</span>
    </Card>
  );
}

function EdgeLegend(): ReactNode {
  return (
    <ul className={styles.edgeLegend} aria-label="화살표 종류">
      {EDGE_LEGEND.map(({ kind, label, hint, dashed, filled }) => (
        <li key={kind} className={styles.edgeLegendItem} title={hint}>
          <svg className={styles.edgeLegendSample} viewBox="0 0 40 12" aria-hidden="true">
            <line
              x1="2"
              y1="6"
              x2="28"
              y2="6"
              stroke="var(--color-text)"
              strokeWidth="1.5"
              strokeDasharray={dashed ? '5 4' : undefined}
            />
            <path
              d="M28,2 L38,6 L28,10 Z"
              fill={filled ? 'var(--color-text)' : 'var(--color-bg)'}
              stroke={filled ? 'none' : 'var(--color-text)'}
              strokeWidth={filled ? undefined : 1.25}
              strokeLinejoin="round"
            />
          </svg>
          <span className={styles.edgeLegendLabel}>{label}</span>
        </li>
      ))}
    </ul>
  );
}

function RelationArrow({ kind }: { kind: EdgeKind }): ReactNode {
  const { dashed, filled, label } = EDGE_BY_KIND[kind];
  return (
    <svg
      className={styles.relationArrow}
      viewBox="0 0 48 16"
      aria-hidden="true"
      data-kind={kind}
      data-label={label}
    >
      <line
        x1="2"
        y1="8"
        x2="34"
        y2="8"
        stroke="var(--color-text)"
        strokeWidth="1.5"
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <path
        d="M34,3 L46,8 L34,13 Z"
        fill={filled ? 'var(--color-text)' : 'var(--color-bg)'}
        stroke={filled ? 'none' : 'var(--color-text)'}
        strokeWidth={filled ? undefined : 1.25}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RelationNode({
  title,
  suffix,
  preview,
}: {
  title: string;
  suffix?: string;
  preview: ReactNode;
}): ReactNode {
  return (
    <div className={styles.relationNode}>
      <Card>
        <GalleryTitle className={styles.relationNodeName} title={title} suffix={suffix} />
        <div className={styles.relationNodePreview}>{preview}</div>
      </Card>
    </div>
  );
}

function RelationMiniGraph({
  kind,
  from,
  to,
}: {
  kind: EdgeKind;
  from: { title: string; suffix?: string; preview: ReactNode };
  to: { title: string; suffix?: string; preview: ReactNode };
}): ReactNode {
  const { label } = EDGE_BY_KIND[kind];
  return (
    <div
      className={styles.relationGraph}
      aria-label={`${from.title} ${label} ${to.title}`}
    >
      <RelationNode {...from} />
      <RelationArrow kind={kind} />
      <RelationNode {...to} />
    </div>
  );
}

function LayerChainRow({
  layer,
}: {
  layer: (typeof LAYER_CHAIN)[number];
}): ReactNode {
  return (
    <div className={styles.layerChainRow}>
      <div className={styles.layerChainCard}>
        <p className={styles.layerChainName}>{layer.label}</p>
      </div>
      <p className={styles.layerChainDef}>{layer.def}</p>
      <ul className={styles.layerExamples} aria-label={`${layer.label} 예시`}>
        {layer.examples.map((name) => (
          <li key={name} className={styles.layerExample}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LayerChainConnector(): ReactNode {
  return (
    <div className={styles.layerChainConnector} aria-hidden="true">
      <svg className={styles.layerChainArrow} viewBox="0 0 12 20">
        <line x1="6" y1="1" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2,12 L6,19 L10,12 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

function LayerChainMini(): ReactNode {
  return (
    <div className={styles.layerMap} aria-label="계층 스펙트럼">
      <section className={styles.layerBand}>
        <p className={styles.layerBandLabel}>Invisible</p>
        <div className={styles.layerBandMain}>
          {LAYER_INVISIBLE.map((layer) => (
            <LayerChainRow key={layer.id} layer={layer} />
          ))}
        </div>
      </section>

      <div className={styles.layerBandDivider} role="separator" aria-hidden="true" />

      <section className={styles.layerBand}>
        <p className={styles.layerBandLabel}>Visible</p>
        <div className={styles.layerBandMain}>
          <div className={styles.layerAbsSpec} aria-hidden="true">
            <span>Abstract</span>
            <div className={styles.layerAbsSpecArrows}>
              <svg className={styles.layerAbsSpecHead} viewBox="0 0 16 12" aria-hidden="true">
                <path d="M8,1 L14,11 L2,11 Z" fill="currentColor" />
              </svg>
              <span className={styles.layerAbsSpecShaft} />
              <svg className={styles.layerAbsSpecHead} viewBox="0 0 16 12" aria-hidden="true">
                <path d="M2,1 L14,1 L8,11 Z" fill="currentColor" />
              </svg>
            </div>
            <span>Specific</span>
          </div>
          <ol className={styles.layerChain}>
            {LAYER_VISIBLE.map((layer, index) => (
              <li key={layer.id} className={styles.layerChainStep}>
                {index > 0 ? <LayerChainConnector /> : null}
                <LayerChainRow layer={layer} />
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

function LayoutPlayground(): ReactNode {
  const [stackProps, setStackProps] = useState<StackPlaygroundProps>(INITIAL_STACK_PROPS);
  const [children, setChildren] = useState<PlaygroundChild[]>(DEFAULT_PLAYGROUND_CHILDREN);
  const [code, setCode] = useState(() =>
    formatStackSnippet(INITIAL_STACK_PROPS, DEFAULT_PLAYGROUND_CHILDREN)
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(true);

  const applyProps = (next: StackPlaygroundProps) => {
    setStackProps(next);
    setCode(formatStackSnippet(next, children));
    setErrors([]);
  };

  const patchProp = <K extends keyof StackPlaygroundProps>(
    key: K,
    value: StackPlaygroundProps[K]
  ) => {
    applyProps({ ...stackProps, [key]: value });
  };

  /** 코드 입력 → props·children 즉시 반영. 에러 시 children은 직전 유효 상태 유지 */
  const onCodeChange = (nextCode: string) => {
    setCode(nextCode);
    const parsed = parseStackSnippet(nextCode, stackProps, children);
    setStackProps(parsed.props);
    setErrors(parsed.errors);
    if (parsed.errors.length === 0) {
      setChildren(parsed.children);
    }
  };

  const onCodeBlur = () => {
    const parsed = parseStackSnippet(code, stackProps, children);
    setStackProps(parsed.props);
    setErrors(parsed.errors);
    if (parsed.errors.length === 0) {
      setChildren(parsed.children);
      setCode(formatStackSnippet(parsed.props, parsed.children));
    }
  };

  return (
    <div className={styles.playground}>
      <div className={styles.playgroundHead}>
        <p className={styles.sectionLead}>Layout Playground</p>
        <GotoButton href="/components/layout" size="small" ariaLabel="Gallery Layout 바로가기">
          Gallery Layout
        </GotoButton>
      </div>
      <div className={styles.playgroundControls}>
        <div className={styles.playgroundControlRow}>
          <ChipSelect
            ariaLabel="width"
            value={stackProps.width}
            options={STACK_WIDTHS.map((value) => ({ value, label: value }))}
            onChange={(value) => patchProp('width', value as LayoutWidth)}
          />
          <ToggleIconButton
            name="grid"
            pressed={showGuide}
            ariaLabel="그리드 가이드"
            title="그리드 가이드"
            size="medium"
            onClick={() => setShowGuide((prev) => !prev)}
          />
        </div>
        <ChipSelect
          ariaLabel="direction"
          value={stackProps.direction}
          options={STACK_DIRECTIONS.map((value) => ({ value, label: value }))}
          onChange={(value) => patchProp('direction', value as StackDirection)}
        />
        <ChipSelect
          ariaLabel="justify"
          value={stackProps.justify}
          options={STACK_JUSTIFIES.map((value) => ({ value, label: value }))}
          onChange={(value) => patchProp('justify', value as StackJustify)}
        />
        <ChipSelect
          ariaLabel="align"
          value={stackProps.align}
          options={STACK_ALIGNS.map((value) => ({ value, label: value }))}
          onChange={(value) => patchProp('align', value as StackAlign)}
        />
        <ChipSelect
          ariaLabel="gap"
          value={stackProps.gap}
          options={STACK_GAPS.map((value) => ({ value, label: value }))}
          onChange={(value) => patchProp('gap', value as StackGap)}
        />
      </div>
      <div className={styles.playgroundBody}>
        <div className={styles.playgroundCodePane}>
          <CodeField
            ariaLabel="Stack 코드"
            value={code}
            onChange={onCodeChange}
            onBlur={onCodeBlur}
            invalid={errors.length > 0}
            width="stretch"
            rows={12}
            language="tsx"
            showLine
          />
          {errors.length > 0 ? (
            <ul className={styles.playgroundErrors} aria-live="polite">
              {errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div
          className={buildCls(styles.playgroundStage, showGuide && styles.playgroundStageGuide)}
        >
          <div
            className={buildCls(
              styles.playgroundStackShell,
              stackProps.width === 'stretch'
                ? styles.playgroundStackShellStretch
                : styles.playgroundStackShellHug
            )}
          >
            <Stack
              direction={stackProps.direction}
              justify={stackProps.justify}
              align={stackProps.align}
              gap={stackProps.gap}
              width={stackProps.width}
            >
              {children.map(renderPlaygroundChild)}
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
}

function LayersTab(): ReactNode {
  return (
    <div className={a11yStyles.exampleStack}>
      <LayerChainMini />
    </div>
  );
}

function LayoutTab(): ReactNode {
  return (
    <div className={a11yStyles.exampleStack}>
      <div className={a11yStyles.compareRow}>
        <CompareColumn
          title="className/style을 props로 노출"
          description="호출부마다 다르게 꾸밀 수 있어 디자인이 갈라짐"
          preview={
            <div className={styles.stackPreview}>
              <div className={styles.leakyCardWide}>A</div>
              <div className={styles.leakyCardCustom}>B</div>
            </div>
          }
          codeLayout="stack"
          highlightWords={['className', 'style', 'CSSProperties']}
          codeSections={[
            {
              label: 'CARD.TSX',
              code: `type CardProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

function Card({ children, className, style }: CardProps) {
  return <div className={className} style={style}>{children}</div>
}`,
            },
            {
              label: '사용부',
              code: `<Card style={{ width: "100%" }}>A</Card>
<Card className={styles.card}>B</Card>`,
            },
          ]}
        />
        <CompareColumn
          title="className/style 없이 디자인 내부 확정"
          description="어디서 써도 같은 모양 보장"
          recommended
          preview={
            <div className={styles.stackPreview}>
              <Card>
                <span className={styles.playItem}>A</span>
              </Card>
              <Card>
                <span className={styles.playItem}>B</span>
              </Card>
            </div>
          }
          codeLayout="stack"
          highlightWords={['styles.card']}
          codeSections={[
            {
              label: 'CARD.TSX',
              code: `type CardProps = {
  // className, style 없음
  children?: ReactNode
}

function Card({ children }: CardProps) {
  return <div className={styles.card}>{children}</div>
}`,
            },
            {
              label: '사용부',
              code: `<Card>A</Card>
<Card>B</Card>`,
            },
          ]}
        />
      </div>
      <LayoutPlayground />
    </div>
  );
}

function FeatureTab(): ReactNode {
  return (
    <div className={a11yStyles.exampleStack}>
      <div className={styles.featureStackHero} aria-label="계층 쌓기 예시">
        <div className={styles.featureStackStep}>
          <p className={styles.featureStackLabel}>Design</p>
          <Icon.Outlined name="settings" size="large" />
        </div>
        <span className={styles.stackPreviewSep} aria-hidden="true">
          →
        </span>
        <div className={styles.featureStackStep}>
          <p className={styles.featureStackLabel}>Interactive</p>
          <IconButton.Outlined
            name="settings"
            size="large"
            ariaLabel="설정 열기"
            onClick={() => undefined}
          />
        </div>
        <span className={styles.stackPreviewSep} aria-hidden="true">
          →
        </span>
        <div className={styles.featureStackStep}>
          <p className={styles.featureStackLabel}>Feature</p>
          <SettingsButton />
        </div>
      </div>
      <div className={a11yStyles.compareRow}>
        <CompareColumn
          title="아래 층 건너뛰고 새로 구현"
          description={
            <>
              <InlineCode>IconButton</InlineCode> 디자인을{' '}
              <InlineCode>styles.iconButton</InlineCode>에서 중복 정의함
            </>
          }
          preview={
            <button
              type="button"
              className={styles.rawIconButton}
              aria-label="설정"
              onClick={() => undefined}
            >
              <Icon.Primary name="settings" size="large" />
            </button>
          }
          highlightWords={['styles.iconButton', 'Icon']}
          code={`function SettingsButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className={styles.iconButton} onClick={() => setOpen(true)}>
        <Icon name="settings" />
      </button>
      {open && <SettingsModal onClose={...} />}
    </>
  )
}`}
        />
        <CompareColumn
          title="아래 층을 재사용해 완제품으로"
          description={
            <>
              <InlineCode>IconButton</InlineCode> 재사용, 디자인은 한 곳에서만 관리
            </>
          }
          recommended
          preview={<SettingsButton />}
          highlightWords={['IconButton.Secondary']}
          code={`{/* Design → Interactive → Feature */}
function SettingsButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton.Secondary
        name="settings"
        shape="full"
        size="large"
        onClick={() => setOpen(true)}
      />
      {open && <SettingsModal onClose={...} />}
    </>
  )
}`}
        />
      </div>
    </div>
  );
}

function Highlight({ children }: { children: ReactNode }): ReactNode {
  return <span className={styles.highlight}>{children}</span>;
}

function InlineCode({ children }: { children: ReactNode }): ReactNode {
  return <code className={styles.inlineCode}>{children}</code>;
}

function RelationExample({
  title,
  points,
  graph,
  code,
  highlightWords,
}: {
  title: string;
  points: ReactNode[];
  graph: ReactNode;
  code: string;
  highlightWords: string[];
}): ReactNode {
  return (
    <article className={styles.relationExample}>
      <h3 className={styles.relationExampleTitle}>{title}</h3>
      <ul className={styles.relationExampleList}>
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <div className={styles.relationExampleGraph}>{graph}</div>
      <CodeBlock
        code={code}
        language="tsx"
        height="stretch"
        syntaxHighlight={false}
        highlightWords={highlightWords}
        aria-label={`${title} 예제 코드`}
      />
    </article>
  );
}

function RelationsTab(): ReactNode {
  const points: Record<EdgeKind, ReactNode[]> = {
    wrap: [
      <>같은 디자인 역할을 부여</>,
      <>
        <InlineCode>Icon</InlineCode>을 클릭 가능한 <InlineCode>IconButton</InlineCode>으로{' '}
        <Highlight>확장</Highlight>
      </>,
    ],
    embed: [
      <>정체성은 그대로 둔 채 다른 컴포넌트를 내부 부품으로 활용</>,
      <>
        <InlineCode>Chip</InlineCode>이 <InlineCode>Icon</InlineCode>을{' '}
        <Highlight>사용</Highlight>해도 여전히 <InlineCode>Chip</InlineCode> 정체성 유지
      </>,
    ],
    compose: [
      <>서로 다른 컴포넌트를 엮어 제3의 맥락 생성</>,
      <>
        <InlineCode>Icon</InlineCode>과 <InlineCode>SearchChipButton</InlineCode>과{' '}
        <InlineCode>GotoButton</InlineCode>이 <Highlight>조합</Highlight>된{' '}
        <InlineCode>DocRow</InlineCode>
      </>,
    ],
    context: [
      <>파라미터를 좁혀 범용 컴포넌트를 특정 용도 전용으로 특수화</>,
      <>
        범용 <InlineCode>Chip</InlineCode>이 프로젝트 상태 의미만 가지도록{' '}
        <Highlight>구체화</Highlight>한 <InlineCode>StatusChip</InlineCode>
      </>,
    ],
  };

  const examples: Record<EdgeKind, { graph: ReactNode; code: string; highlightWords: string[] }> = {
    wrap: {
      graph: (
        <RelationMiniGraph
          kind="wrap"
          from={{
            title: 'Icon',
            suffix: 'Icon',
            preview: (
              <span className={styles.relationPreviewGroup}>
                <Icon.Outlined name="settings" size="medium" />
                <Icon.Primary name="settings" size="medium" />
              </span>
            ),
          }}
          to={{
            title: 'IconButton',
            suffix: 'Icon',
            preview: (
              <span className={styles.relationPreviewGroup}>
                <IconButton.Primary
                  name="settings"
                  ariaLabel="설정"
                  onClick={() => undefined}
                />
                <IconButton.Outlined
                  name="settings"
                  ariaLabel="설정"
                  onClick={() => undefined}
                />
              </span>
            ),
          }}
        />
      ),
      code: `function IconButton({ name, iconKind, size, shape, ariaLabel }) {
  return (
    <button aria-label={ariaLabel}>
      <Icon.Primary
        name={name} kind={iconKind} size={size} shape={shape}
      />
    </button>
  );
}`,
      highlightWords: ['Icon.Primary'],
    },
    embed: {
      graph: (
        <RelationMiniGraph
          kind="embed"
          from={{
            title: 'Icon',
            suffix: 'Icon',
            preview: (
              <span className={styles.relationPreviewGroup}>
                <Icon.Outlined name="settings" size="medium" />
                <Icon.Primary name="settings" size="medium" />
              </span>
            ),
          }}
          to={{
            title: 'Chip',
            suffix: 'Chip',
            preview: <Chip.Outlined label="React" iconName="react" size="medium" />,
          }}
        />
      ),
      code: `function Chip({ label, iconName }) {
  return (
    <span>
      {iconName && <Icon.Primary name={iconName} embedded />}
      <span>{label}</span>
    </span>
  );
}`,
      highlightWords: ['Icon.Primary'],
    },
    compose: {
      graph: (
        <RelationMiniGraph
          kind="compose"
          from={{
            title: 'GotoButton',
            suffix: 'Text',
            preview: (
              <GotoButton ariaLabel="문서 열기" onClick={() => undefined} size="small">
                노트
              </GotoButton>
            ),
          }}
          to={{
            title: 'DocRow',
            suffix: 'Feature',
            preview: (
              <span className={styles.docRowFake}>
                <Icon.Primary name="document" size="small" />
                <SearchChipButton
                  label="Fitween"
                  ariaLabel="Fitween"
                  onClick={() => undefined}
                />
                <GotoButton ariaLabel="문서 열기" onClick={() => undefined} size="small">
                  Fitween 릴리즈 노트
                </GotoButton>
              </span>
            ),
          }}
        />
      ),
      code: `function DocRow({ doc, onChipClick, onNavigate }) {
  return (
    <div>
      <Icon.Primary name="document" embedded />
      <SearchChipButton
        label={doc.chipLabel} onClick={(e) => onChipClick(e, doc)}
      />
      <GotoButton href={doc.link} onClick={() => onNavigate(doc.id)}>
        {doc.title}
      </GotoButton>
    </div>
  );
}`,
      highlightWords: ['Icon.Primary', 'SearchChipButton', 'GotoButton'],
    },
    context: {
      graph: (
        <RelationMiniGraph
          kind="context"
          from={{
            title: 'Chip',
            suffix: 'Chip',
            preview: <Chip.Outlined label="status" size="small" shape="full" />,
          }}
          to={{
            title: 'StatusChip',
            suffix: 'Chip',
            preview: (
              <span className={styles.relationPreviewGroup}>
                <StatusChip type={PROJECT_STATUS.LIVE} />
                <StatusChip type={PROJECT_STATUS.ENDED} />
              </span>
            ),
          }}
        />
      ),
      code: `function StatusChip({ type }) {
  const ChipVariant = statusChipVariant(type);
  return (
    <ChipVariant
      label={t(projectStatusTranslationKey(type))}
      size="small"
      shape="full"
    />
  );
}`,
      highlightWords: ['ChipVariant'],
    },
  };

  return (
    <div className={a11yStyles.exampleStack}>
      <EdgeLegend />
      <div className={styles.relationExampleGrid}>
        {EDGE_LEGEND.map(({ kind, title }) => (
          <RelationExample
            key={kind}
            title={title}
            points={points[kind]}
            graph={examples[kind].graph}
            code={examples[kind].code}
            highlightWords={examples[kind].highlightWords}
          />
        ))}
      </div>
    </div>
  );
}

function TokensTab(): ReactNode {
  const rawIconSizes = [23, 24, 25] as const;
  const rawColorButtons = [
    { color: 'black', backgroundColor: 'white' },
    { color: '#000', backgroundColor: '#eee' },
    { color: '#010101', backgroundColor: '#efefef' },
  ] as const;

  return (
    <div className={a11yStyles.exampleStack}>
      <div className={a11yStyles.compareRow}>
        <CompareColumn
          title={
            <>
              <InlineCode>size</InlineCode>를 픽셀 값으로 직접 지정
            </>
          }
          description="23px, 24px, 25px 같은 임의 값이 컴포넌트마다 다르게 쓰일 수 있음"
          preview={
            <div className={styles.stackPreview}>
              {rawIconSizes.map((px) => (
                <button
                  key={px}
                  type="button"
                  className={styles.rawPxIcon}
                  style={{ width: px, height: px }}
                  aria-label={`설정 ${px}px`}
                  onClick={() => undefined}
                >
                  <Icon.Primary name="settings" size="small" embedded />
                </button>
              ))}
            </div>
          }
          highlightWords={['"23px"', '"24px"', '"25px"']}
          code={`<IconButton size="23px" />
<IconButton size="24px" />
<IconButton size="25px" />`}
        />
        <CompareColumn
          title={
            <>
              <InlineCode>size</InlineCode>를 정의된 토큰으로 지정
            </>
          }
          description={
            <>
              <InlineCode>small</InlineCode>, <InlineCode>medium</InlineCode>,{' '}
              <InlineCode>large</InlineCode> 중에서만 선택 가능
            </>
          }
          recommended
          preview={
            <IconButton.Primary
              name="settings"
              size="large"
              ariaLabel="설정"
              onClick={() => undefined}
            />
          }
          highlightWords={['size', '"large"']}
          code={`<IconButton size="large" />`}
        />
      </div>
      <div className={a11yStyles.compareRow}>
        <CompareColumn
          title="색을 hex 값으로 직접 지정"
          description="어떤 의미의 색인지, 다른 곳과 같은 색인지 알 수 없음"
          preview={
            <div className={styles.stackPreview}>
              {rawColorButtons.map((tone) => (
                <button
                  key={`${tone.color}-${tone.backgroundColor}`}
                  type="button"
                  className={styles.rawColorButton}
                  style={{ color: tone.color, backgroundColor: tone.backgroundColor }}
                  onClick={() => undefined}
                >
                  Button
                </button>
              ))}
            </div>
          }
          highlightWords={['"black"', '"white"', '"#000"', '"#eee"', '"#010101"', '"#efefef"']}
          code={`<TextButton color="black" backgroundColor="white" />
<TextButton color="#000" backgroundColor="#eee" />
<TextButton color="#010101" backgroundColor="#efefef" />`}
        />
        <CompareColumn
          title={
            <>
              색 대신 <InlineCode>variant</InlineCode>로 지정
            </>
          }
          description="색상이 아니라 의미와 역할을 지정"
          recommended
          preview={
            <TextButton.Secondary size="medium" ariaLabel="Button" onClick={() => undefined}>
              Button
            </TextButton.Secondary>
          }
          highlightWords={['"secondary"']}
          code={`<TextButton variant="secondary" />`}
        />
      </div>
    </div>
  );
}

export function PhilosophyShowcase(): ReactNode {
  const [params, setParams] = useSearchParams();
  const focus = parseFocus(params.get(FOCUS_QUERY));

  const setFocus = (value: PhilFocus) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === FOCUS_DEFAULT) next.delete(FOCUS_QUERY);
        else next.set(FOCUS_QUERY, value);
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className={styles.pageBody}>
      <div className={styles.focusBar}>
        <SegmentedButton
          ariaLabel="컴포넌트 철학"
          value={focus}
          options={FOCUS_OPTIONS}
          onChange={(value) => setFocus(value as PhilFocus)}
        />
      </div>
      <div className={styles.scroll}>
        {focus === 'layers' ? <LayersTab /> : null}
        {focus === 'relations' ? <RelationsTab /> : null}
        {focus === 'layout' ? <LayoutTab /> : null}
        {focus === 'feature' ? <FeatureTab /> : null}
        {focus === 'tokens' ? <TokensTab /> : null}
      </div>
    </div>
  );
}
