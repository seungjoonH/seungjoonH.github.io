// #해시 태그 디자인 (Text 기반, size small·opacity soft 고정)
import type { ReactNode } from 'react';
import { buildCls } from '@utils/cssUtil';
import { Text } from '@components/design/button/Text';
import styles from './tag.module.css';

export interface TagProps {
  name: string;
  /** 기본 false. true면 항상 underline */
  underline?: boolean;
}

export function Tag({ name, underline = false }: TagProps): ReactNode {
  return (
    <span data-tag="" className={buildCls(styles.tag, underline && styles.underline)}>
      <Text.Primary size="small" opacity="soft">
        #{name}
      </Text.Primary>
    </span>
  );
}
