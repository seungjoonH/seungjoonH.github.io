// Main 타이틀의 지연 fade-in
import { Fragment, type ReactNode } from 'react';
import styles from './title.module.css';
import { buildCls } from '@utils/cssUtil';
import { useStagedReveal } from '@hooks/useStagedReveal';

const TITLE_REVEAL_DELAYS_MS = [1000];

interface TitleProps {
  text: string;
}

export function Title({ text }: TitleProps): ReactNode {
  const stage = useStagedReveal({ delaysMs: TITLE_REVEAL_DELAYS_MS });
  const show = stage > 0;

  const lines = text.split('\\n');
  const titleContainerCls = buildCls(styles.titleContainer, show && styles.fadeIn);

  return (
    <div className={titleContainerCls}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line}
          <br />
        </Fragment>
      ))}
    </div>
  );
}

export default Title;
