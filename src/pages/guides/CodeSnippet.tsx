// 가이드 코드 스니펫 — syntax highlight 없이 주석/일반/반응형 밝기만 구분
import type { ReactNode } from 'react';
import styles from './responsive.module.css';

type GuideCodeKind = 'comment' | 'plain' | 'responsive';

interface GuideCodeToken {
  kind: GuideCodeKind;
  text: string;
}

/** 반응형 관련 식별자·키워드 (CSS / TS 공통) */
const RESPONSIVE_RE =
  /@media\b|min-width|max-width|\d+px\b|\d+(?:\.\d+)?vw\b|(?<=repeat\()\d+(?=,)|(?<=grid-template-columns:\s)\d+fr\b|useResponsive\b|useProjectsGrid\b|useExperienceScroll\b|useExperienceSection\b|isMobile\b|isTablet\b|isDesktop\b|isWide\b|projectsGrid\b|columnBounds\b|effectiveBounds\b|handleChangeColumn\b|ColumnControlSlider\b|columns\b|gap\b|mobileHovered\b|mobileHoveredCardIndex\b|flipProps\b|handleFlippedChange\b|isThisCardFlipped\b|--project-columns\b|--project-gap\b|--experience-card-width\b|experience-card-width|padding-inline|data-breakpoint\b|breakpoints\b|pano-line-[\w.-]+/y;

/** 접근성 관련 식별자·키워드 */
const A11Y_RE =
  /aria-label\b|aria-hidden\b|ariaLabel\b|aria-pressed\b|aria-valuetext\b|useA11y\b|IconButton\b|alt\b|::before\b|--font-scale\b|font-scale\b|\d+px\b|calc\([^)]+\)/y;

/** Layout/Design 계약 — className·style 외부 주입 강조 */
const CONTRACT_RE =
  /style=\{\{\s*width:\s*"100%"\s*\}\}|className=\{styles\.card\}|className\b|style\b|CSSProperties\b/y;

function tokenizeGuideCode(code: string, highlightRe: RegExp | null): GuideCodeToken[] {
  const tokens: GuideCodeToken[] = [];
  let i = 0;
  let plainStart = 0;

  const flushPlain = (end: number) => {
    if (end > plainStart) {
      tokens.push({ kind: 'plain', text: code.slice(plainStart, end) });
    }
  };

  while (i < code.length) {
    if (code.startsWith('//', i)) {
      flushPlain(i);
      let j = i + 2;
      while (j < code.length && code[j] !== '\n') j += 1;
      tokens.push({ kind: 'comment', text: code.slice(i, j) });
      i = j;
      plainStart = i;
      continue;
    }

    if (code.startsWith('/*', i)) {
      flushPlain(i);
      let j = i + 2;
      while (j < code.length && !code.startsWith('*/', j)) j += 1;
      if (code.startsWith('*/', j)) j += 2;
      tokens.push({ kind: 'comment', text: code.slice(i, j) });
      i = j;
      plainStart = i;
      continue;
    }

    if (highlightRe) {
      highlightRe.lastIndex = i;
      const match = highlightRe.exec(code);
      if (match && match.index === i) {
        flushPlain(i);
        tokens.push({ kind: 'responsive', text: match[0] });
        i += match[0].length;
        plainStart = i;
        continue;
      }
    }

    i += 1;
  }

  flushPlain(code.length);
  return tokens;
}

const TOKEN_CLASS: Record<GuideCodeKind, string> = {
  comment: styles.codeComment,
  plain: styles.codePlain,
  responsive: styles.codeResponsive,
};

export type CodeSnippetMode = 'responsive' | 'a11y' | 'contract' | 'plain';

interface CodeSnippetProps {
  code: string;
  mode?: CodeSnippetMode;
}

function highlightReFor(mode: CodeSnippetMode): RegExp | null {
  if (mode === 'a11y') return A11Y_RE;
  if (mode === 'contract') return CONTRACT_RE;
  if (mode === 'plain') return null;
  return RESPONSIVE_RE;
}

export function CodeSnippet({ code, mode = 'responsive' }: CodeSnippetProps): ReactNode {
  const tokens = tokenizeGuideCode(code, highlightReFor(mode));
  return (
    <pre className={styles.codeLine}>
      {tokens.map((token, i) => (
        <span key={`${token.kind}-${i}`} className={TOKEN_CLASS[token.kind]}>
          {token.text}
        </span>
      ))}
    </pre>
  );
}
