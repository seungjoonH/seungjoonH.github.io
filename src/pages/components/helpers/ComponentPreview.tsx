// 갤러리 미리보기 래퍼 — hover 시 크기 + 선택적 사용 코드 툴팁
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './gallery.module.css';
import { buildCls } from '@utils/cssUtil';
import { tokenizeUsageCode, type UsageTokenKind } from './formatUsageCode';

interface ComponentPreviewProps {
  children: ReactNode;
  fullWidth?: boolean;
  /** hover 시 사용 코드 툴팁 (크기 툴팁과 별도) */
  code?: string;
}

interface TooltipPos {
  top: number;
  left: number;
}

const TOKEN_CLASS: Record<UsageTokenKind, string | undefined> = {
  tag: styles.codeTag,
  attr: styles.codeAttr,
  equal: styles.codeEqual,
  value: styles.codeValue,
  comment: styles.codeComment,
  plain: undefined,
};

export function ComponentPreview({
  children,
  fullWidth = false,
  code,
}: ComponentPreviewProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState<TooltipPos>({ top: 0, left: 0 });
  const tokens = code ? tokenizeUsageCode(code) : null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
      setPos({ top: rect.bottom + 8, left: rect.left });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hovered || !tokens) return undefined;
    const sync = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, left: rect.left });
    };
    sync();
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    return () => {
      window.removeEventListener('scroll', sync, true);
      window.removeEventListener('resize', sync);
    };
  }, [hovered, tokens]);

  return (
    <div
      ref={ref}
      className={buildCls(styles.preview, fullWidth && styles.previewFullWidth)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {size.width > 0 && size.height > 0 && (
        <div className={buildCls(styles.dimensionLabel, hovered && styles.dimensionLabelVisible)}>
          {size.width} × {size.height}px
        </div>
      )}
      {hovered &&
        tokens &&
        createPortal(
          <pre
            className={styles.codeLabel}
            style={{ top: pos.top, left: pos.left }}
            aria-hidden="true"
          >
            {tokens.map((token, index) => {
              const cls = TOKEN_CLASS[token.kind];
              return cls ? (
                <span key={index} className={cls}>
                  {token.text}
                </span>
              ) : (
                token.text
              );
            })}
          </pre>,
          document.body
        )}
    </div>
  );
}
