// 프로젝트 카드의 미디어·제목·태그·스택·뒷면 슬롯만 배치하는 조합 컴포넌트
import { forwardRef, type MouseEvent, type ReactNode } from 'react';
import { FlipCard } from '@components/interactive/card/FlipCard';
import { CursorRing } from '@components/interactive/cursor/CursorRing';
import { buildCls } from '@utils/cssUtil';
import { useStackChipsOverflow } from '@sections/projects/hooks/useStackChipsOverflow';
import styles from './projectCard.module.css';

export interface ProjectSlotCardProps {
  media?: ReactNode;
  title?: ReactNode;
  year?: ReactNode;
  tags?: ReactNode[];
  stacks?: ReactNode[];
  back?: ReactNode;
  badge?: ReactNode;
  status?: ReactNode;
  onOpen: () => void;
  ariaLabel: string;
  flipped?: boolean;
  onFlippedChange?: (flipped: boolean) => void;
  onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void;
  surface?: boolean;
}

export const ProjectSlotCard = forwardRef<HTMLDivElement, ProjectSlotCardProps>(function ProjectSlotCard(
  {
    media,
    title,
    year,
    tags,
    stacks = [],
    back,
    badge,
    status,
    onOpen,
    ariaLabel,
    flipped,
    onFlippedChange,
    onContextMenu,
    surface = false,
  },
  ref
): ReactNode {
  const { useEvenSplit, lineRef, chipsContainerRef } = useStackChipsOverflow(stacks.length);
  const tagsWrapCls = buildCls(styles.tagsWrap, styles.frontTagsWrap);
  const twoRows = useEvenSplit && stacks.length >= 2;
  const row1 = twoRows ? stacks.slice(0, Math.floor(stacks.length / 2)) : stacks;
  const row2 = twoRows ? stacks.slice(Math.floor(stacks.length / 2)) : [];

  let stackChipsLine: ReactNode;
  if (stacks.length === 0) {
    stackChipsLine = <span className={styles.languageStacks}>-</span>;
  } else if (twoRows) {
    stackChipsLine = (
      <span className={styles.languageStacksTwoRows}>
        <span className={styles.languageStacksRow}>{row1}</span>
        <span className={styles.languageStacksRow}>{row2}</span>
      </span>
    );
  } else {
    stackChipsLine = (
      <span ref={chipsContainerRef} className={styles.languageStacks}>
        {row1}
      </span>
    );
  }

  const front = (
    <div className={styles.cardFront}>
      {badge}
      <div className={styles.thumbnailWrap}>
        {status}
        {media}
      </div>
      <div className={styles.frontMeta}>
        <div className={styles.titleRow}>
          <h3>{title}</h3>
          <span>{year}</span>
        </div>
        {tags != null && tags.length > 0 ? (
          <div className={tagsWrapCls}>
            <div className={styles.tagsScroll}>{tags}</div>
          </div>
        ) : null}
        <div className={styles.languageLine} ref={lineRef}>
          {stackChipsLine}
        </div>
      </div>
    </div>
  );

  const backFace = <div className={styles.cardBack}>{back}</div>;

  return (
    <div className={styles.card}>
      <CursorRing.Target>
        <FlipCard
          ref={ref}
          front={front}
          back={backFace}
          onOpen={onOpen}
          flipped={flipped}
          onFlippedChange={onFlippedChange}
          surface={surface}
          ariaLabel={ariaLabel}
          onContextMenu={onContextMenu}
        />
      </CursorRing.Target>
    </div>
  );
});
