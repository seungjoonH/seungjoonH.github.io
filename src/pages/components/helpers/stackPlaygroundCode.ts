// Layout Playground용 Stack 스니펫 format/parse (props + 허용 children)
import type {
  StackAlign,
  StackDirection,
  StackGap,
  StackJustify,
} from '@components/layout/stack/Stack';
import type { DesignSize, LayoutWidth } from '@components/design/designTokens';
import { DESIGN_SIZES } from '@components/design/designTokens';

export interface StackPlaygroundProps {
  direction: StackDirection;
  justify: StackJustify;
  align: StackAlign;
  gap: StackGap;
  width: LayoutWidth;
}

/** 네임스페이스 variant — Icon.Primary / Chip.Outlined */
export type PlaygroundVariantName = 'Primary' | 'Secondary' | 'Outlined';

export type PlaygroundChild =
  | { kind: 'icon'; variant: PlaygroundVariantName; name: string; size: DesignSize }
  | { kind: 'card'; text: string }
  | { kind: 'chip'; variant: PlaygroundVariantName; label: string; size: DesignSize };

export interface ParseStackSnippetResult {
  props: StackPlaygroundProps;
  children: PlaygroundChild[];
  errors: string[];
}

const DIRECTIONS = new Set<StackDirection>(['horizontal', 'vertical']);
const JUSTIFIES = new Set<StackJustify>(['start', 'center', 'end', 'spaceBetween']);
const ALIGNS = new Set<StackAlign>(['start', 'center', 'end', 'stretch']);
const GAPS = new Set<StackGap>(['none', 'small', 'medium', 'large']);
const WIDTHS = new Set<LayoutWidth>(['hug', 'stretch']);
const VARIANTS = new Set<PlaygroundVariantName>(['Primary', 'Secondary', 'Outlined']);
const SIZES = new Set<string>(DESIGN_SIZES);

export const DEFAULT_PLAYGROUND_CHILDREN: PlaygroundChild[] = [
  { kind: 'icon', variant: 'Outlined', name: 'settings', size: 'medium' },
  { kind: 'card', text: 'Card' },
  { kind: 'chip', variant: 'Outlined', label: 'chip', size: 'small' },
];

function formatChild(child: PlaygroundChild): string {
  if (child.kind === 'icon') {
    return `  <Icon.${child.variant} name="${child.name}" size="${child.size}" />`;
  }
  if (child.kind === 'chip') {
    return `  <Chip.${child.variant} label="${child.label}" size="${child.size}" />`;
  }
  return `  <Card>${child.text}</Card>`;
}

export function formatChildren(children: PlaygroundChild[]): string {
  return children.map(formatChild).join('\n');
}

export function formatStackSnippet(
  props: StackPlaygroundProps,
  children: PlaygroundChild[] = DEFAULT_PLAYGROUND_CHILDREN
): string {
  const { direction, justify, align, gap, width } = props;
  return `<Stack
  width="${width}"
  direction="${direction}"
  justify="${justify}"
  align="${align}"
  gap="${gap}"
>
${formatChildren(children)}
</Stack>`;
}

function readProp(code: string, name: string): string | undefined {
  const re = new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`);
  const match = code.match(re);
  return match?.[1];
}

function readAttr(attrs: string, name: string): string | undefined {
  const re = new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`);
  return attrs.match(re)?.[1];
}

/** 허용 토큰만 반영. 잘못된 키는 prev 유지 */
export function parseStackProps(
  code: string,
  prev: StackPlaygroundProps
): StackPlaygroundProps {
  const next = { ...prev };

  const direction = readProp(code, 'direction');
  if (direction && DIRECTIONS.has(direction as StackDirection)) {
    next.direction = direction as StackDirection;
  }

  const justify = readProp(code, 'justify');
  if (justify && JUSTIFIES.has(justify as StackJustify)) {
    next.justify = justify as StackJustify;
  }

  const align = readProp(code, 'align');
  if (align && ALIGNS.has(align as StackAlign)) {
    next.align = align as StackAlign;
  }

  const gap = readProp(code, 'gap');
  if (gap && GAPS.has(gap as StackGap)) {
    next.gap = gap as StackGap;
  }

  const width = readProp(code, 'width');
  if (width && WIDTHS.has(width as LayoutWidth)) {
    next.width = width as LayoutWidth;
  }

  return next;
}

function parseSize(raw: string | undefined, fallback: DesignSize): DesignSize {
  if (raw && SIZES.has(raw)) return raw as DesignSize;
  return fallback;
}

/** Stack 본문에서 Icon/Card/Chip만 순서대로 파싱. 모르는 variant는 errors */
export function parsePlaygroundChildren(
  code: string,
  prev: PlaygroundChild[]
): { children: PlaygroundChild[]; errors: string[] } {
  const body = code.match(/<Stack\b[^>]*>([\s\S]*?)<\/Stack>/i)?.[1];
  if (body === undefined) {
    return { children: prev, errors: ['</Stack>로 닫힌 Stack 본문이 필요합니다'] };
  }

  const errors: string[] = [];
  const children: PlaygroundChild[] = [];
  const tagRe =
    /<(Icon|Chip)\.(\w+)\s*([^/>]*)\/>|<Card>([\s\S]*?)<\/Card>/g;

  for (const match of body.matchAll(tagRe)) {
    if (match[4] !== undefined) {
      const text = match[4].replace(/\s+/g, ' ').trim() || 'Card';
      children.push({ kind: 'card', text });
      continue;
    }

    const comp = match[1] as 'Icon' | 'Chip';
    const variantRaw = match[2] ?? '';
    const attrs = match[3] ?? '';

    if (!VARIANTS.has(variantRaw as PlaygroundVariantName)) {
      const allowed = [...VARIANTS].join(' | ');
      errors.push(`Unknown ${comp}.${variantRaw} (use ${allowed})`);
      continue;
    }

    const variant = variantRaw as PlaygroundVariantName;

    if (comp === 'Icon') {
      const name = readAttr(attrs, 'name') ?? 'settings';
      const size = parseSize(readAttr(attrs, 'size'), 'medium');
      children.push({ kind: 'icon', variant, name, size });
      continue;
    }

    const label = readAttr(attrs, 'label') ?? 'chip';
    const size = parseSize(readAttr(attrs, 'size'), 'small');
    children.push({ kind: 'chip', variant, label, size });
  }

  if (errors.length > 0) {
    return { children: prev, errors };
  }

  if (children.length === 0) {
    return {
      children: prev,
      errors: ['Icon / Card / Chip 자식을 하나 이상 넣어 주세요'],
    };
  }

  return { children, errors: [] };
}

export function parseStackSnippet(
  code: string,
  prevProps: StackPlaygroundProps,
  prevChildren: PlaygroundChild[]
): ParseStackSnippetResult {
  const props = parseStackProps(code, prevProps);
  const { children, errors } = parsePlaygroundChildren(code, prevChildren);
  return { props, children, errors };
}
