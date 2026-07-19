// 앞뒷면 슬롯을 회전시키고 열기 제스처를 전달하는 카드 셸
import {
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { onActivateKeyDown } from '@hooks/onActivateKeyDown';
import { buildCls } from '@utils/cssUtil';
import styles from './flipCard.module.css';

export interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  onOpen: () => void;
  ariaLabel: string;
  flipped?: boolean;
  onFlippedChange?: (flipped: boolean) => void;
  surface?: boolean;
  onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
}

export const FlipCard = forwardRef<HTMLDivElement, FlipCardProps>(function FlipCard(
  {
    front,
    back,
    onOpen,
    ariaLabel,
    flipped,
    onFlippedChange,
    surface = true,
    onContextMenu,
  },
  ref
): ReactNode {
  const isControlled = flipped !== undefined;

  const open = () => {
    onOpen();
    if (isControlled) onFlippedChange?.(false);
  };

  const handleClick = () => {
    if (isControlled && !flipped) {
      onFlippedChange?.(true);
      return;
    }
    open();
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target;
    if (
      target instanceof Element &&
      target !== e.currentTarget &&
      target.closest('button,a,input,textarea,select')
    ) {
      return;
    }
    e.preventDefault();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onActivateKeyDown(e, open);
  };

  return (
    <div
      ref={ref}
      data-flip-card=""
      data-flip-mode={isControlled ? 'click' : 'hover'}
      data-flipped={flipped === true ? 'true' : undefined}
      className={buildCls(styles.root, surface && styles.surface)}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onContextMenu={onContextMenu}
    >
      <div className={styles.inner}>
        <div className={styles.front}>{front}</div>
        <div className={styles.back}>{back}</div>
      </div>
    </div>
  );
});
