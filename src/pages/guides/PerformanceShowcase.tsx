// /performance — 아이콘 로딩을 런타임 fetch에서 빌드타임 번들로 바꾼 변화를 Before/After로 묶어 보여준다
import { useEffect, useState, type ReactNode } from 'react';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';
import { Icon } from '@components/design/icon/Icon';
import { CodeSnippet } from './CodeSnippet';
import { scaleWidthPercent } from './buildBarScale';
import {
  CODE_BUNDLE_OUTPUT_AFTER,
  CODE_BUNDLE_OUTPUT_BEFORE,
  CODE_ICON_FETCH_BEFORE,
  CODE_ICON_GLOB_AFTER,
  MEASURED_COMPARISONS,
  REQUEST_BREAKDOWN,
  REQUEST_BREAKDOWN_MAX,
  REQUEST_TOTAL_AFTER,
  REQUEST_TOTAL_BEFORE,
} from './performanceSnippets';
import { buildCls } from '@utils/cssUtil';
import shell from './responsive.module.css';
import styles from './performance.module.css';

type PerformancePhase = 'before' | 'after';

const PHASE_OPTIONS = [
  { value: 'before', label: 'Before' },
  { value: 'after', label: 'After' },
];

const MEASUREMENT_GROUPS = [
  { outcome: 'regressed', label: '트레이드오프' },
  { outcome: 'improved', label: '개선' },
] as const;

function Panel({ file, children }: { file: string; children: ReactNode }): ReactNode {
  return (
    <section className={styles.codePanel}>
      <div className={shell.panelHead}>{file}</div>
      {children}
    </section>
  );
}

function RequestBreakdown({
  grown,
  pick,
  phase,
}: {
  grown: boolean;
  pick: (row: (typeof REQUEST_BREAKDOWN)[number]) => number;
  phase: PerformancePhase;
}): ReactNode {
  return (
    <section
      className={styles.breakdownBox}
      aria-label={`${phase === 'before' ? 'Before' : 'After'} 요청 수 그래프`}
    >
      <div
        className={styles.phaseSummary}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`${phase === 'before' ? 'Before, 런타임 요청, 254건' : 'After, 번들에 포함, 69건, 73% 감소'}`}
      >
        <span className={styles.strategyTag}>
          {phase === 'before' ? '런타임 요청' : '번들에 포함'}
        </span>
        <span className={styles.comparison}>
          <strong
            className={buildCls(
              styles.comparisonValue,
              phase === 'before' && styles.comparisonValueActive,
            )}
          >
            {REQUEST_TOTAL_BEFORE}건
          </strong>
          <span aria-hidden="true">→</span>
          <strong
            className={buildCls(
              styles.comparisonValue,
              phase === 'after' && styles.comparisonValueActive,
            )}
          >
            {REQUEST_TOTAL_AFTER}건
          </strong>
          <span>(73% 감소)</span>
        </span>
      </div>
      <div className={styles.breakdownHead}>
        <span className={styles.breakdownTitle}>요청 수</span>
        <span className={styles.breakdownScale}>(건)</span>
      </div>
      <ul className={styles.breakdownList}>
        {REQUEST_BREAKDOWN.map((row) => {
          const value = pick(row);
          return (
            <li key={row.type} className={styles.breakdownRow}>
              <span className={styles.breakdownLabelCol}>
                <span className={styles.breakdownLabel}>{row.type}</span>
                <span className={styles.breakdownExample}>{row.example}</span>
              </span>
              <span className={styles.breakdownBarTrack} aria-hidden="true">
                <span
                  className={buildCls(
                    styles.breakdownBarFill,
                    phase === 'after' && styles.breakdownBarFillAfter,
                  )}
                  style={{ width: `${grown ? scaleWidthPercent(value, REQUEST_BREAKDOWN_MAX) : 0}%` }}
                />
              </span>
              <span className={styles.breakdownValue} aria-label={`${value}건`}>
                {value}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function PerformanceShowcase(): ReactNode {
  const [grown, setGrown] = useState(false);
  const [phase, setPhase] = useState<PerformancePhase>('before');

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <h1 className={shell.title}>아이콘 로딩 아키텍처 변경</h1>

      <div className={styles.phaseTabs}>
        <SegmentedButton
          ariaLabel="Before / After"
          value={phase}
          options={PHASE_OPTIONS}
          onChange={(value) => setPhase(value as PerformancePhase)}
        />
      </div>

      <section className={styles.measurementSection} aria-labelledby="performance-measurement-title">
        <div className={styles.measurementHead}>
          <h2 id="performance-measurement-title" className={styles.measurementTitle}>
            실측 비교
          </h2>
        </div>
        <div className={styles.measurementGrid}>
          {MEASUREMENT_GROUPS.map((group) => (
            <section
              key={group.outcome}
              className={buildCls(
                styles.measurementGroup,
                group.outcome === 'regressed' && styles.measurementGroupRegressed,
              )}
              aria-label={group.label}
            >
              <h3 className={styles.measurementGroupTitle}>{group.label}</h3>
              <ul className={styles.measurementGroupGrid}>
                {MEASURED_COMPARISONS.filter(
                  (metric) => metric.outcome === group.outcome,
                ).map((metric) => (
                  <li key={metric.label} className={styles.measurementCard}>
                    <span className={styles.measurementCardHead}>
                      <span className={styles.measurementIcon} aria-hidden="true">
                        <Icon.Outlined name={metric.icon} size="small" />
                      </span>
                      <span className={styles.measurementLabel}>{metric.label}</span>
                    </span>
                    <span className={styles.measurementValues}>
                      <strong
                        className={buildCls(
                          styles.measurementValue,
                          phase === 'before' && styles.measurementValueActive,
                        )}
                      >
                        {metric.before}
                      </strong>
                      <span aria-hidden="true">→</span>
                      <strong
                        className={buildCls(
                          styles.measurementValue,
                          phase === 'after' && styles.measurementValueActive,
                        )}
                      >
                        {metric.after}
                      </strong>
                    </span>
                    <span
                      className={buildCls(
                        styles.measurementDelta,
                        metric.outcome === 'regressed' && styles.measurementDeltaRegressed,
                      )}
                    >
                      {metric.delta}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <div className={styles.stateGrid}>
        <div className={styles.stateCol}>
          <RequestBreakdown
            grown={grown}
            pick={(row) => row[phase]}
            phase={phase}
          />

          <div className={styles.codeColumn}>
            {phase === 'before' ? (
              <>
                <Panel file="JSX / Icon.jsx">
                  <div className={styles.codeBody}>
                    <CodeSnippet code={CODE_ICON_FETCH_BEFORE} mode="performance" />
                  </div>
                </Panel>
                <Panel file="index.js">
                  <div className={styles.codeBody}>
                    <CodeSnippet code={CODE_BUNDLE_OUTPUT_BEFORE} mode="performance" />
                  </div>
                </Panel>
              </>
            ) : (
              <>
                <Panel file="TSX / Icon.tsx">
                  <div className={styles.codeBody}>
                    <CodeSnippet code={CODE_ICON_GLOB_AFTER} mode="performance" />
                  </div>
                </Panel>
                <Panel file="index.js">
                  <div className={styles.codeBody}>
                    <CodeSnippet code={CODE_BUNDLE_OUTPUT_AFTER} mode="performance" />
                  </div>
                </Panel>
              </>
            )}
          </div>
        </div>
      </div>

    </>
  );
}
