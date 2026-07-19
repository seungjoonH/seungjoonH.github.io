// Docs 트리의 문서 한 줄 — 아이콘 + 소스 칩 + 이동 버튼을 조합한다
import type { MouseEvent, ReactNode } from 'react';
import { Icon } from '@components/design/icon/Icon';
import { GotoButton } from '@components/interactive/button/GotoButton';
import { SearchChipButton } from '@components/composed/chip/SearchChipButton';
import { useA11y } from '@hooks/useA11y';
import type { DocItem } from '@sections/docs/getDocById';
import styles from '@sections/docs.module.css';

export interface DocRowProps {
  doc: DocItem;
  onChipClick: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>, doc: DocItem) => void;
  onNavigate: (docId: string) => void;
}

export function DocRow({ doc, onChipClick, onNavigate }: DocRowProps): ReactNode {
  const a11y = useA11y();

  return (
    <div id={`doc-row-${doc.id}`} className={styles.docRow}>
      <span className={styles.docIcon} aria-hidden="true">
        <Icon.Primary name="document" embedded />
      </span>
      {doc.source && doc.chipLabel && (
        <SearchChipButton
          label={doc.chipLabel}
          onClick={(e) => onChipClick(e, doc)}
          ariaLabel={a11y('docs.chipNavigate', { chip: doc.chipLabel })}
        />
      )}
      <GotoButton
        href={doc.link}
        external={doc.external ?? true}
        width="stretch"
        size="large"
        ariaLabel={doc.title ?? doc.id}
        onClick={() => onNavigate(doc.id)}
      >
        {doc.title}
      </GotoButton>
    </div>
  );
}
