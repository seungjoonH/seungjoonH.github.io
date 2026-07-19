// 읽기 전용 코드 표시 — syntax / 단어 highlight
import type { ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import styles from './codeBlock.module.css';
import {
  tokenizeCode,
  type CodeLanguage,
  type CodeToken,
} from './codeHighlight';

export type { CodeLanguage as CodeBlockLanguage };

export type CodeBlockProps = {
  code: string;
  language?: CodeLanguage;
  /** hug: 내용만큼 / stretch: 부모 남은 높이 채움 */
  height?: 'hug' | 'stretch';
  width?: string | number;
  showLine?: boolean;
  /**
   * true(기본): language grayscale syntax.
   * false: 본문은 흐리게, `highlightWords`만 흰색.
   */
  syntaxHighlight?: boolean;
  /** `syntaxHighlight={false}`일 때 흰색으로 강조할 단어 (긴 것 우선) */
  highlightWords?: string[];
  className?: string;
  'aria-label'?: string;
};

function tokenClass(kind: CodeToken['kind']): string | undefined {
  switch (kind) {
    case 'tag':
      return styles.tokTag;
    case 'attr':
      return styles.tokAttr;
    case 'equal':
      return styles.tokEqual;
    case 'value':
      return styles.tokValue;
    case 'comment':
      return styles.tokComment;
    default:
      return undefined;
  }
}

function isWordChar(ch: string | undefined): boolean {
  return ch != null && /[A-Za-z0-9_$]/.test(ch);
}

/** 원문 순서를 유지하며 highlightWords만 강조. 긴 단어 우선·식별자 경계. */
export function splitHighlightWords(code: string, words: string[]): { text: string; hit: boolean }[] {
  const sorted = [...new Set(words.filter((w) => w.length > 0))].sort(
    (a, b) => b.length - a.length
  );
  if (sorted.length === 0) return [{ text: code, hit: false }];

  const parts: { text: string; hit: boolean }[] = [];
  let i = 0;
  let plainStart = 0;

  const flushPlain = (end: number) => {
    if (end > plainStart) parts.push({ text: code.slice(plainStart, end), hit: false });
  };

  while (i < code.length) {
    let matched: string | null = null;
    for (const word of sorted) {
      if (!code.startsWith(word, i)) continue;
      if (isWordChar(code[i - 1]) || isWordChar(code[i + word.length])) continue;
      matched = word;
      break;
    }
    if (matched) {
      flushPlain(i);
      parts.push({ text: matched, hit: true });
      i += matched.length;
      plainStart = i;
      continue;
    }
    i += 1;
  }
  flushPlain(code.length);
  return parts;
}

function renderSyntax(code: string, language: CodeLanguage): ReactNode {
  const tokens = tokenizeCode(code, language);
  return tokens.map((t, i) => {
    const cls = tokenClass(t.kind);
    return cls ? (
      <span key={i} className={cls}>
        {t.text}
      </span>
    ) : (
      <span key={i}>{t.text}</span>
    );
  });
}

function renderWordHighlight(code: string, words: string[]): ReactNode {
  return splitHighlightWords(code, words).map((part, i) =>
    part.hit ? (
      <span key={i} className={styles.wordHit}>
        {part.text}
      </span>
    ) : (
      <span key={i} className={styles.wordDim}>
        {part.text}
      </span>
    )
  );
}

export default function CodeBlock({
  code,
  language = 'tsx',
  height = 'hug',
  width = '100%',
  showLine = false,
  syntaxHighlight = true,
  highlightWords,
  className,
  'aria-label': ariaLabel = 'Code',
}: CodeBlockProps) {
  const lines = code.length === 0 ? [''] : code.split('\n');
  const content = syntaxHighlight
    ? renderSyntax(code, language)
    : renderWordHighlight(code, highlightWords ?? []);

  return (
    <pre
      className={buildCls(
        styles.root,
        height === 'stretch' && styles.heightStretch,
        !syntaxHighlight && styles.wordMode,
        className
      )}
      style={{ width }}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {showLine ? (
        <div className={styles.lineGutter} aria-hidden>
          {lines.map((_, i) => (
            <span key={i} className={styles.lineNo}>
              {i + 1}
            </span>
          ))}
        </div>
      ) : null}
      <code className={styles.code}>{content}</code>
    </pre>
  );
}
