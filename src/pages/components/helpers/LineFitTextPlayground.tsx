// LineFitText 갤러리 카드 전용 — lineCount/splitRatio/샘플 문장을 직접 조작하는 플레이그라운드
import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import CodeBlock from '@components/design/codeBlock/CodeBlock';
import { Icon } from '@components/design/icon/Icon';
import { ControlSlider } from '@components/interactive/controlSlider/ControlSlider';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';
import { LineFitText } from '@components/composed/text/LineFitText';
import { buildCls } from '@utils/cssUtil';
import {
  LINE_FIT_TEXT_MAX_LINE_COUNT,
  LINE_FIT_TEXT_MIN_LINE_COUNT,
  LINE_FIT_TEXT_SAMPLES,
  buildLineFitTextUsageCode,
  parseLineCount,
} from './lineFitTextPlaygroundLogic';
import styles from './lineFitTextPlayground.module.css';

const SAMPLE_OPTIONS = LINE_FIT_TEXT_SAMPLES.map(({ value, label }) => ({ value, label }));
const SPLIT_RATIO_MIN = 0.5;
const SPLIT_RATIO_MAX = 0.9;
const SPLIT_RATIO_STEP = 0.05;
const DEFAULT_SPLIT_RATIO = 0.65;
const DEFAULT_LINE_COUNT = 2;

const MIN_PREVIEW_W = 140;
const MIN_PREVIEW_H = 48;
const MAX_PREVIEW_H = 320;
const INITIAL_PREVIEW_W = 240;
const INITIAL_PREVIEW_H = 96;

export function LineFitTextPlayground(): ReactNode {
  const [text, setText] = useState<string>(
    LINE_FIT_TEXT_SAMPLES.find((s) => s.value === 'long')?.text ?? LINE_FIT_TEXT_SAMPLES[0].text,
  );
  const [lineCount, setLineCount] = useState(DEFAULT_LINE_COUNT);
  const [lineDraft, setLineDraft] = useState(String(DEFAULT_LINE_COUNT));
  const [splitRatio, setSplitRatio] = useState(DEFAULT_SPLIT_RATIO);
  const [previewWidth, setPreviewWidth] = useState(INITIAL_PREVIEW_W);
  const [previewHeight, setPreviewHeight] = useState(INITIAL_PREVIEW_H);
  const previewStageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  } | null>(null);
  const selectedSample = LINE_FIT_TEXT_SAMPLES.find((s) => s.text === text)?.value ?? '';

  const commitLineCount = (next: number) => {
    const clamped = Math.max(
      LINE_FIT_TEXT_MIN_LINE_COUNT,
      Math.min(LINE_FIT_TEXT_MAX_LINE_COUNT, Math.floor(next)),
    );
    setLineCount(clamped);
    setLineDraft(String(clamped));
  };

  const effectiveSplitRatio = lineCount === 2 ? splitRatio : undefined;

  const onResizePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const el = previewRef.current;
    if (!el) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: el.offsetWidth,
      startH: el.offsetHeight,
    };
  };

  const onResizePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const stage = previewStageRef.current;
    const drag = dragRef.current;
    if (!stage || !drag) return;

    const maxW = stage.clientWidth;
    const nextW = Math.min(maxW, Math.max(MIN_PREVIEW_W, drag.startW + (e.clientX - drag.startX)));
    const nextH = Math.min(
      MAX_PREVIEW_H,
      Math.max(MIN_PREVIEW_H, drag.startH + (e.clientY - drag.startY)),
    );

    setPreviewWidth(Math.round(nextW));
    setPreviewHeight(Math.round(nextH));
  };

  const onResizePointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    }
  };

  return (
    <div className={styles.playground}>
      <div className={styles.samples}>
        <SegmentedButton
          ariaLabel="Sample presets"
          width="stretch"
          value={selectedSample}
          options={SAMPLE_OPTIONS}
          onChange={(value) => {
            const sample = LINE_FIT_TEXT_SAMPLES.find((s) => s.value === value);
            if (sample) setText(sample.text);
          }}
        />
      </div>
      <div className={styles.textAndControls}>
        <textarea
          className={styles.textInput}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          aria-label="Sample text"
        />

        <div className={styles.controlsColumn}>
          <div className={styles.controls}>
            <ControlSlider
              size="small"
              legend="lineCount"
              value={lineCount}
              min={LINE_FIT_TEXT_MIN_LINE_COUNT}
              max={LINE_FIT_TEXT_MAX_LINE_COUNT}
              step={1}
              onChange={commitLineCount}
              ariaLabel="lineCount"
              ariaValueText={`${lineCount}`}
              decreaseLabel="lineCount 감소"
              increaseLabel="lineCount 증가"
            />
            <input
              className={styles.numberInput}
              type="number"
              min={LINE_FIT_TEXT_MIN_LINE_COUNT}
              step={1}
              value={lineDraft}
              onChange={(e) => {
                const raw = e.target.value;
                setLineDraft(raw);
                const parsed = parseLineCount(raw);
                if (parsed != null) commitLineCount(parsed);
              }}
              onBlur={() => {
                const parsed = parseLineCount(lineDraft);
                commitLineCount(parsed ?? lineCount);
              }}
              aria-label="lineCount value"
            />
          </div>

          <div
            className={buildCls(styles.controls, lineCount !== 2 && styles.controlsHidden)}
            aria-hidden={lineCount !== 2}
          >
            <ControlSlider
              size="small"
              legend="splitRatio"
              value={splitRatio}
              min={SPLIT_RATIO_MIN}
              max={SPLIT_RATIO_MAX}
              step={SPLIT_RATIO_STEP}
              onChange={setSplitRatio}
              displayValue={splitRatio.toFixed(2)}
              ariaLabel="splitRatio"
              ariaValueText={`${splitRatio}`}
              decreaseLabel="splitRatio 감소"
              increaseLabel="splitRatio 증가"
            />
          </div>
        </div>
      </div>

      <div ref={previewStageRef} className={styles.previewStage}>
        <div className={styles.previewWrap}>
          <div
            ref={previewRef}
            className={styles.preview}
            style={{ width: previewWidth, height: previewHeight }}
          >
            <LineFitText text={text} lineCount={lineCount} splitRatio={effectiveSplitRatio} />
          </div>
          <button
            type="button"
            className={styles.resizeHandle}
            aria-label="Resize preview"
            onPointerDown={onResizePointerDown}
            onPointerMove={onResizePointerMove}
            onPointerUp={onResizePointerUp}
            onPointerCancel={onResizePointerUp}
          >
            <span className={styles.resizeArrow}>
              <Icon.Outlined name="resize-corner" size="medium" embedded />
            </span>
          </button>
        </div>
      </div>

      <CodeBlock
        code={buildLineFitTextUsageCode({ text, lineCount, splitRatio: effectiveSplitRatio })}
        language="tsx"
      />
    </div>
  );
}
