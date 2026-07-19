// Intro 텍스트의 인라인 마커(@link, highlight) 파싱과 staged reveal
import { Fragment, type ReactNode } from 'react';
import styles from './introduction.module.css';
import { buildCls } from '@utils/cssUtil';
import { renderRichText } from '../projects/utils/richText';
import { IntroLinkTrigger } from './IntroLinkTrigger';
import { useStagedReveal } from '@hooks/useStagedReveal';

const INTRO_REVEAL_DELAYS_MS = [1500, 2300];
const STAGE_CLASS_BY_INDEX = ['', styles.fadeIn, styles.noTransition] as const;

const pushRichChunk = (parts: ReactNode[], chunk: string, key: string) => {
  if (!chunk) return;
  const rendered = renderRichText(chunk);
  if (typeof rendered === 'string') {
    parts.push(rendered);
    return;
  }
  parts.push(<Fragment key={key}>{rendered}</Fragment>);
};

function parseInlineMarkers(inputText: string, keyBase: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = /@\((\w+)\)\[([^\]]*)\]|@\[(.*?)\]/g;

  while ((match = regex.exec(inputText)) !== null) {
    const beforeText = inputText.substring(lastIndex, match.index);
    pushRichChunk(parts, beforeText, `${keyBase}-rich-${lastIndex}`);

    if (match[1]) {
      parts.push(
        <IntroLinkTrigger key={`${keyBase}-link-${match.index}`} linkId={match[1]} label={match[2]} />
      );
    } else {
      parts.push(
        <span key={`${keyBase}-hi-${match.index}`} className={styles.highlight}>
          {match[3]}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < inputText.length) {
    pushRichChunk(parts, inputText.substring(lastIndex), `${keyBase}-rich-tail`);
  }

  return parts;
}

interface IntroductionProps {
  text: string | string[];
}

export function Introduction({ text }: IntroductionProps): ReactNode {
  const stage = useStagedReveal({ delaysMs: INTRO_REVEAL_DELAYS_MS });

  const lines = Array.isArray(text) ? text : text.split('\n').filter(Boolean);
  const introLines: string[] = [];
  const bulletItems: string[] = [];
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) bulletItems.push(trimmed.slice(2));
    else introLines.push(line);
  });

  const stageClass = STAGE_CLASS_BY_INDEX[stage] ?? STAGE_CLASS_BY_INDEX[STAGE_CLASS_BY_INDEX.length - 1];
  const introContainerCls = buildCls(styles.introContainer, stageClass);

  return (
    <div className={introContainerCls}>
      {introLines.map((paragraph, i) => {
        const introLineCls = buildCls(styles.intro, i >= 2 && styles.introSecondary);
        return (
          <p key={i} className={introLineCls}>
            {parseInlineMarkers(paragraph, `intro-p-${i}`)}
          </p>
        );
      })}
      {bulletItems.length > 0 && (
        <ul className={styles.introList}>
          {bulletItems.map((item, i) => (
            <li key={i} className={styles.introListItem}>
              {parseInlineMarkers(item, `intro-li-${i}`)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Introduction;
