// 코드 편집 — highlight 오버레이 / 줄번호 / 커스텀 resize
import {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type UIEvent,
  useRef,
  useState,
} from 'react';
import { buildCls } from '@utils/cssUtil';
import type { LayoutWidth } from '@components/design/designTokens';
import { Icon } from '@components/design/icon/Icon';
import {
  duplicateSelectedLines,
  indentSelection,
  insertNewlineWithIndent,
  moveSelectedLines,
  outdentSelection,
  type CodeSelectionEdit,
} from './codeFieldKeymap';
import {
  tokenizeCode,
  type CodeFieldLanguage,
  type CodeTokenKind,
} from './codeFieldHighlight';
import styles from './codeField.module.css';

export type { CodeFieldLanguage };

export interface CodeFieldProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  width?: LayoutWidth;
  /** 유효하지 않은 입력(파싱 에러 등) */
  invalid?: boolean;
  disabled?: boolean;
  rows?: number;
  spellCheck?: boolean;
  /** syntax 언어. 기본 tsx */
  language?: CodeFieldLanguage;
  /** 줄 번호 gutter */
  showLine?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
}

const TOKEN_CLASS: Record<CodeTokenKind, string> = {
  tag: styles.tokTag,
  attr: styles.tokAttr,
  equal: styles.tokEqual,
  value: styles.tokValue,
  comment: styles.tokComment,
  plain: styles.tokPlain,
};

function applyEdit(
  el: HTMLTextAreaElement,
  edit: CodeSelectionEdit,
  onChange: (value: string) => void,
): void {
  onChange(edit.value);
  requestAnimationFrame(() => {
    el.selectionStart = edit.selectionStart;
    el.selectionEnd = edit.selectionEnd;
  });
}

function lineCount(value: string): number {
  if (!value) return 1;
  let n = 1;
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] === '\n') n += 1;
  }
  return n;
}

export function CodeField({
  value,
  onChange,
  ariaLabel,
  width = 'stretch',
  invalid = false,
  disabled,
  rows = 12,
  spellCheck = false,
  language = 'tsx',
  showLine = false,
  onKeyDown,
  onFocus,
  onBlur,
}: CodeFieldProps): ReactNode {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);
  const [heightPx, setHeightPx] = useState<number | null>(null);

  const tokens = tokenizeCode(value, language);
  const lines = lineCount(value);

  const syncScroll = () => {
    const input = inputRef.current;
    if (!input) return;
    if (highlightRef.current) {
      highlightRef.current.scrollTop = input.scrollTop;
      highlightRef.current.scrollLeft = input.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = input.scrollTop;
    }
  };

  const handleScroll = (_e: UIEvent<HTMLTextAreaElement>) => {
    syncScroll();
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    if (e.key === 'Tab') {
      e.preventDefault();
      const edit = e.shiftKey
        ? outdentSelection(value, start, end)
        : indentSelection(value, start, end);
      applyEdit(el, edit, onChange);
      return;
    }

    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const direction = e.key === 'ArrowUp' ? 'up' : 'down';
      const edit = e.shiftKey
        ? duplicateSelectedLines(value, start, end, direction)
        : moveSelectedLines(value, start, end, direction);
      if (edit) applyEdit(el, edit, onChange);
      return;
    }

    if ((e.metaKey || e.ctrlKey) && (e.key === ']' || e.key === '[')) {
      e.preventDefault();
      const edit =
        e.key === ']'
          ? indentSelection(value, start, end)
          : outdentSelection(value, start, end);
      applyEdit(el, edit, onChange);
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      applyEdit(el, insertNewlineWithIndent(value, start, end), onChange);
      return;
    }

    onKeyDown?.(e);
  };

  const onResizePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const shell = shellRef.current;
    if (!shell) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startY: e.clientY, startH: shell.getBoundingClientRect().height };
  };

  const onResizePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const next = Math.max(96, Math.round(drag.startH + (e.clientY - drag.startY)));
    setHeightPx(next);
  };

  const onResizePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    }
  };

  const shellStyle = {
    '--code-field-rows': rows,
    ...(heightPx != null ? { '--code-field-height': `${heightPx}px` } : {}),
  } as CSSProperties;

  return (
    <div
      ref={shellRef}
      className={buildCls(
        styles.shell,
        width === 'stretch' ? styles.stretch : styles.hug,
        invalid && styles.invalid,
      )}
      style={shellStyle}
      data-code-field=""
    >
      {showLine ? (
        <div ref={gutterRef} className={styles.gutter} aria-hidden="true">
          <span className={styles.gutterInner}>
            {Array.from({ length: lines }, (_, i) => `${i + 1}`).join('\n')}
          </span>
        </div>
      ) : null}
      <div className={styles.editor}>
        <pre ref={highlightRef} className={styles.highlight} aria-hidden="true">
          {tokens.map((token, index) => (
            <span key={`${index}-${token.kind}`} className={TOKEN_CLASS[token.kind]}>
              {token.text}
            </span>
          ))}
          {value.endsWith('\n') ? '\n' : null}
        </pre>
        <textarea
          ref={inputRef}
          className={styles.input}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          rows={rows}
          spellCheck={spellCheck}
        />
      </div>
      <button
        type="button"
        className={styles.resizeHandle}
        aria-label="높이 조절"
        disabled={disabled}
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
      >
        <span className={styles.resizeIcon}>
          <Icon.Outlined name="resize-corner" size="small" embedded />
        </span>
      </button>
    </div>
  );
}
