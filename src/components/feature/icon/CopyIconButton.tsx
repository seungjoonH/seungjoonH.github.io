// 클립보드 복사 후 check 피드백 — Feature가 a11y 라벨 소유
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useA11y } from '@hooks/useA11y';
import { IconButton } from '@components/interactive/icon/IconButton';
import type { DesignSize } from '@components/design/designTokens';

export interface CopyIconButtonProps {
  text: string;
  /** a11y 문맥 (예: Email) — 있으면 contact.copy/copied, 없으면 common.copy/copied */
  label?: string;
  size?: DesignSize;
  disabled?: boolean;
  feedbackMs?: number;
}

export function CopyIconButton({
  text,
  label,
  size = 'small',
  disabled,
  feedbackMs = 1500,
}: CopyIconButtonProps): ReactNode {
  const a11y = useA11y();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const handleClick = () => {
    if (!text) return;
    void navigator.clipboard?.writeText(text).then(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCopied(true);
      timerRef.current = setTimeout(() => setCopied(false), feedbackMs);
    });
  };

  const ariaLabel = label
    ? copied
      ? a11y('contact.copied', { label })
      : a11y('contact.copy', { label })
    : copied
      ? a11y('common.copied')
      : a11y('common.copy');

  return (
    <IconButton.Primary
      name={copied ? 'check' : 'copy'}
      size={size}
      onClick={handleClick}
      disabled={disabled || !text}
      ariaLabel={ariaLabel}
      title={ariaLabel}
    />
  );
}
