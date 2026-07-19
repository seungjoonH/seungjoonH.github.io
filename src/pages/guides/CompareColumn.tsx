// 한 열: (화면 | 스크린 리더) 위, 코드 영역(들) 아래
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import CodeBlock from '@components/design/codeBlock/CodeBlock';
import { IconButton } from '@components/interactive/icon/IconButton';
import { CodeSnippet, type CodeSnippetMode } from './CodeSnippet';
import { buildCls } from '@utils/cssUtil';
import styles from './accessibility.module.css';

export interface CodeSection {
  label: string;
  code: string;
}

export interface CompareColumnProps {
  title: ReactNode;
  /** 제목 아래 한 줄 설명 */
  description?: ReactNode;
  recommended?: boolean;
  /** 태그 문구. 없으면 비권장/권장 */
  verdictLabel?: string;
  /** 고정 미리보기, 또는 읽는 줄 인덱스에 따라 하이라이트 */
  preview: ReactNode | ((activeIndex: number | null) => ReactNode);
  /** 한 줄 캡션 (하이라이트 없음) */
  srCaption?: string;
  /** 여러 줄. 재생 시 줄·미리보기 하이라이트 + 줄 사이 휴지 */
  srLines?: string[];
  /** 줄 사이 휴지(ms). 기본 450 */
  srPauseMs?: number;
  /** 음소거일 때 한 줄 하이라이트 유지(ms). 기본 1400 */
  mutedLineMs?: number;
  /** 단일 코드 블록 */
  code?: string;
  /** 라벨별 코드 영역 분리 */
  codeSections?: CodeSection[];
  /**
   * stack: 세로 나열.
   * impl-usage: 왼쪽(정의들) | 오른쪽(마지막=사용부)
   */
  codeLayout?: 'stack' | 'impl-usage';
  /** 코드 하이라이트 모드. 기본 a11y. highlightWords 있으면 CodeBlock word 모드 */
  codeMode?: CodeSnippetMode;
  /** CodeBlock 단어 하이라이트 (있으면 CodeSnippet 대신 CodeBlock) */
  highlightWords?: string[];
}

function hasKoreanVoice(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith('ko'));
}

function VerdictGlyph({ ok }: { ok: boolean }): ReactNode {
  if (ok) {
    return (
      <svg className={styles.colTagGlyph} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className={styles.colTagGlyph} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CompareCode({
  code,
  codeMode,
  highlightWords,
  height,
}: {
  code: string;
  codeMode: CodeSnippetMode;
  highlightWords?: string[];
  height: 'hug' | 'stretch';
}): ReactNode {
  if (highlightWords) {
    return (
      <CodeBlock
        code={code}
        language="tsx"
        syntaxHighlight={false}
        highlightWords={highlightWords}
        height={height}
      />
    );
  }
  return <CodeSnippet code={code} mode={codeMode} />;
}

export function CompareColumn({
  title,
  description,
  recommended = false,
  verdictLabel,
  preview,
  srCaption,
  srLines,
  srPauseMs = 450,
  mutedLineMs = 1400,
  code,
  codeSections,
  codeLayout = 'stack',
  codeMode = 'a11y',
  highlightWords,
}: CompareColumnProps): ReactNode {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [voiceReady, setVoiceReady] = useState(hasKoreanVoice);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const linesKey = srLines?.join('\u0001') ?? srCaption ?? '';
  const lines = useMemo(() => {
    if (srLines) return srLines;
    if (srCaption != null) return [srCaption];
    return null;
  }, [linesKey, srLines, srCaption]);
  const hasCaption = lines != null;
  const isSilent = hasCaption && lines.every((line) => line.trim().length === 0);
  const multiLine = (lines?.length ?? 0) > 1;
  const tagText = verdictLabel ?? (recommended ? '권장' : '비권장');
  const sections =
    codeSections ?? (code != null ? [{ label: '', code }] : []);
  const previewNode = typeof preview === 'function' ? preview(activeIndex) : preview;
  const splitCodes = codeLayout === 'impl-usage' && sections.length >= 2;
  const codeHeight = splitCodes ? 'stretch' : 'hug';

  const clearPause = useCallback(() => {
    if (pauseTimerRef.current != null) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const stopPlayback = useCallback(() => {
    cancelledRef.current = true;
    clearPause();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setActiveIndex(null);
    setPlaying(false);
  }, [clearPause]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return undefined;
    const sync = () => setVoiceReady(hasKoreanVoice());
    sync();
    window.speechSynthesis.addEventListener('voiceschanged', sync);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', sync);
  }, []);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const startPlayback = useCallback(() => {
    if (!lines || isSilent || typeof window === 'undefined') return;

    cancelledRef.current = true;
    clearPause();
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    cancelledRef.current = false;
    setPlaying(true);

    const scheduleNext = (next: number) => {
      if (cancelledRef.current) return;
      if (next >= lines.length) {
        setActiveIndex(null);
        setPlaying(false);
        return;
      }
      setActiveIndex(null);
      pauseTimerRef.current = setTimeout(() => {
        pauseTimerRef.current = null;
        speakAt(next);
      }, srPauseMs);
    };

    const speakAt = (i: number) => {
      if (cancelledRef.current) return;
      if (i >= lines.length) {
        setActiveIndex(null);
        setPlaying(false);
        return;
      }
      setActiveIndex(i);

      const useVoice = voiceReady && window.speechSynthesis;
      if (!useVoice) {
        pauseTimerRef.current = setTimeout(() => {
          pauseTimerRef.current = null;
          scheduleNext(i + 1);
        }, mutedLineMs);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(lines[i]);
      utterance.lang = 'ko-KR';
      utterance.volume = mutedRef.current ? 0 : 1;
      utterance.onend = () => {
        if (cancelledRef.current) return;
        scheduleNext(i + 1);
      };
      utterance.onerror = () => {
        if (cancelledRef.current) return;
        setActiveIndex(null);
        setPlaying(false);
      };
      window.speechSynthesis.speak(utterance);
    };

    speakAt(0);
  }, [lines, isSilent, clearPause, srPauseMs, mutedLineMs, voiceReady]);

  return (
    <article
      className={buildCls(styles.compareCol, recommended && styles.compareColRecommended)}
    >
      <div className={styles.colHead}>
        <div className={styles.colHeadText}>
          <h3 className={styles.colTitle}>{title}</h3>
          {description ? <p className={styles.colDescription}>{description}</p> : null}
        </div>
        <span
          className={buildCls(
            styles.colTag,
            recommended ? styles.colTagOk : styles.colTagBad
          )}
        >
          <VerdictGlyph ok={recommended} />
          <span className={styles.colTagText}>{tagText}</span>
        </span>
      </div>
      {hasCaption ? (
        <div className={styles.topSplit}>
          <div className={styles.previewStage}>{previewNode}</div>
          <div className={styles.captionBlock}>
            <div className={styles.captionHead}>
              <span className={styles.captionLabel}>스크린 리더</span>
              <div className={styles.captionActions}>
                <IconButton.Outlined
                  name={muted ? 'volume-off' : 'volume-on'}
                  size="small"
                  pressed={!muted}
                  disabled={!voiceReady}
                  ariaLabel={
                    voiceReady
                      ? muted
                        ? '음소거 해제'
                        : '음소거'
                      : '음성 없음'
                  }
                  onClick={() => setMuted((prev) => !prev)}
                />
                <IconButton.Outlined
                  name={playing ? 'stop' : 'play'}
                  size="small"
                  pressed={playing}
                  disabled={isSilent}
                  ariaLabel={playing ? '재생 중지' : '자막 재생'}
                  onClick={() => {
                    if (playing) stopPlayback();
                    else startPlayback();
                  }}
                />
              </div>
            </div>
            {isSilent ? (
              <p className={`${styles.captionText} ${styles.captionEmpty}`}>
                (아무 것도 읽히지 않음)
              </p>
            ) : multiLine ? (
              <ul className={styles.captionList}>
                {lines.map((line, index) => (
                  <li
                    key={`${line}-${index}`}
                    className={buildCls(
                      styles.captionLine,
                      activeIndex === index && styles.captionLineActive
                    )}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p
                className={buildCls(
                  styles.captionText,
                  activeIndex === 0 && styles.captionLineActive
                )}
              >
                {lines[0]}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.previewStage}>{previewNode}</div>
      )}
      <div
        className={
          splitCodes
            ? styles.codeSplit
            : styles.codeStack
        }
      >
        {splitCodes ? (
          <>
            <div className={styles.codeSplitLeft}>
              {sections.slice(0, -1).map((section) => (
                <div
                  key={`${section.label}-${section.code.slice(0, 24)}`}
                  className={buildCls(
                    styles.codeBlock,
                    highlightWords && styles.codeBlockEmbed
                  )}
                >
                  {section.label ? (
                    <p className={styles.codeLabel}>{section.label}</p>
                  ) : null}
                  <CompareCode
                    code={section.code}
                    codeMode={codeMode}
                    highlightWords={highlightWords}
                    height={codeHeight}
                  />
                </div>
              ))}
            </div>
            <div className={styles.codeSplitRight}>
              <div
                className={buildCls(
                  styles.codeBlock,
                  highlightWords && styles.codeBlockEmbed
                )}
              >
                {sections[sections.length - 1].label ? (
                  <p className={styles.codeLabel}>{sections[sections.length - 1].label}</p>
                ) : null}
                <CompareCode
                  code={sections[sections.length - 1].code}
                  codeMode={codeMode}
                  highlightWords={highlightWords}
                  height={codeHeight}
                />
              </div>
            </div>
          </>
        ) : (
          sections.map((section) => (
            <div
              key={`${section.label}-${section.code.slice(0, 24)}`}
              className={buildCls(styles.codeBlock, highlightWords && styles.codeBlockEmbed)}
            >
              {section.label ? (
                <p className={styles.codeLabel}>{section.label}</p>
              ) : null}
              <CompareCode
                code={section.code}
                codeMode={codeMode}
                highlightWords={highlightWords}
                height={codeHeight}
              />
            </div>
          ))
        )}
      </div>
    </article>
  );
}
