// catalog children SSOT 기반 컴포넌트 관계 그래프 (디자인/인터랙티브/사용 3계층 + SVG 연결선)
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { buildCls } from '@utils/cssUtil';
import { Card } from '@components/design/card/Card';
import {
  componentRelations,
  getCategoryPath,
  getComplementLabel,
  type ComponentRelation,
  type GalleryViewMode,
} from './catalog';
import { GalleryTitle } from './GalleryTitle';
import { structurePreview, type StructurePreviewState } from './structurePreviews';
import styles from './gallery.module.css';

type EdgeKind = 'wrap' | 'embed' | 'compose' | 'context';

interface Edge {
  from: string;
  to: string;
  kind: EdgeKind;
}

interface Point {
  x: number;
  y: number;
}

interface NodeAnchors {
  top: Point;
  bottom: Point;
  left: Point;
  right: Point;
}

/** 컴포넌트 위계: 0 Design / 1 Interactive / 2 Composed / 3 Feature */
const TIER: Record<string, number> = {
  icon: 0,
  text: 0,
  chip: 0,
  tag: 0,
  'icon-button': 1,
  'text-button': 1,
  'goto-button': 1,
  'chip-button': 1,
  'tag-button': 1,
  'toggle-icon-button': 1,
  'cycle-icon-button': 1,
  'search-field': 1,
  'control-slider': 1,
  'segmented-button': 1,
  modal: 1,
  'flip-card': 1,
  'cursor-ring': 1,
  'status-chip': 2,
  'stack-chip-button': 2,
  'skill-chip-button': 2,
  'relation-chip-button': 2,
  'nav-button': 2,
  'speed-control-slider': 3,
  'font-scale-control-slider': 3,
  'column-control-slider': 3,
  'settings-modal': 3,
  'settings-button': 3,
  'theme-toggle-button': 3,
  'project-sort-button': 3,
  'copy-icon-button': 3,
  'search-chip-button': 2,
  'search-shortcut-chip-button': 3,
  'project-search-field': 3,
  'typed-external-link': 2,
  'field-card': 2,
  'contact-field-card': 3,
  'experience-slot-card': 2,
  'experience-card': 3,
  'project-slot-card': 2,
  'project-card': 3,
  'language-segmented-button': 3,
  'doc-row': 3,
};

const TIER_LABEL: Record<number, string> = {
  0: 'Design',
  1: 'Interactive',
  2: 'Composed',
  3: 'Feature',
};

/** 같은 레벨 안에서의 좌우 배치 순서 */
const NODE_ORDER = [
  'icon',
  'text',
  'chip',
  'tag',
  'icon-button',
  'toggle-icon-button',
  'cycle-icon-button',
  'text-button',
  'goto-button',
  'chip-button',
  'tag-button',
  'search-field',
  'control-slider',
  'segmented-button',
  'modal',
  'flip-card',
  'cursor-ring',
  'status-chip',
  'stack-chip-button',
  'skill-chip-button',
  'relation-chip-button',
  'search-chip-button',
  'nav-button',
  'typed-external-link',
  'field-card',
  'experience-slot-card',
  'project-slot-card',
  'theme-toggle-button',
  'project-sort-button',
  'copy-icon-button',
  'settings-modal',
  'settings-button',
  'language-segmented-button',
  'search-shortcut-chip-button',
  'project-search-field',
  'contact-field-card',
  'experience-card',
  'project-card',
  'speed-control-slider',
  'font-scale-control-slider',
  'column-control-slider',
  'doc-row',
];

/** from = 의존 대상(더 원시적인 컴포넌트), to = 그 의존을 사용/구성하는 컴포넌트 */
const EDGES: Edge[] = [
  { from: 'icon', to: 'icon-button', kind: 'wrap' },
  { from: 'icon-button', to: 'toggle-icon-button', kind: 'wrap' },
  { from: 'icon-button', to: 'cycle-icon-button', kind: 'wrap' },
  { from: 'toggle-icon-button', to: 'theme-toggle-button', kind: 'wrap' },
  { from: 'cycle-icon-button', to: 'project-sort-button', kind: 'wrap' },
  { from: 'icon-button', to: 'copy-icon-button', kind: 'wrap' },
  { from: 'icon', to: 'text', kind: 'embed' },
  { from: 'icon', to: 'chip', kind: 'embed' },
  { from: 'text', to: 'text-button', kind: 'wrap' },
  { from: 'text', to: 'goto-button', kind: 'wrap' },
  { from: 'icon', to: 'goto-button', kind: 'embed' },
  { from: 'icon', to: 'typed-external-link', kind: 'embed' },
  { from: 'text', to: 'tag', kind: 'context' },
  { from: 'tag', to: 'tag-button', kind: 'wrap' },
  { from: 'text-button', to: 'segmented-button', kind: 'compose' },
  { from: 'segmented-button', to: 'language-segmented-button', kind: 'wrap' },
  { from: 'chip', to: 'chip-button', kind: 'wrap' },
  { from: 'chip', to: 'status-chip', kind: 'context' },
  { from: 'chip', to: 'stack-chip-button', kind: 'context' },
  { from: 'chip', to: 'skill-chip-button', kind: 'context' },
  { from: 'chip-button', to: 'relation-chip-button', kind: 'wrap' },
  { from: 'chip-button', to: 'search-chip-button', kind: 'wrap' },
  { from: 'search-chip-button', to: 'search-shortcut-chip-button', kind: 'wrap' },
  { from: 'icon-button', to: 'search-field', kind: 'compose' },
  { from: 'search-field', to: 'project-search-field', kind: 'wrap' },
  { from: 'icon-button', to: 'control-slider', kind: 'compose' },
  { from: 'control-slider', to: 'speed-control-slider', kind: 'wrap' },
  { from: 'control-slider', to: 'font-scale-control-slider', kind: 'wrap' },
  { from: 'control-slider', to: 'column-control-slider', kind: 'wrap' },
  { from: 'card', to: 'field-card', kind: 'wrap' },
  { from: 'icon', to: 'field-card', kind: 'embed' },
  { from: 'field-card', to: 'contact-field-card', kind: 'wrap' },
  { from: 'copy-icon-button', to: 'contact-field-card', kind: 'compose' },
  { from: 'card', to: 'experience-slot-card', kind: 'wrap' },
  { from: 'experience-slot-card', to: 'experience-card', kind: 'wrap' },
  { from: 'flip-card', to: 'project-slot-card', kind: 'wrap' },
  { from: 'cursor-ring', to: 'project-slot-card', kind: 'compose' },
  { from: 'project-slot-card', to: 'project-card', kind: 'wrap' },
  { from: 'stack-chip-button', to: 'project-card', kind: 'compose' },
  { from: 'tag-button', to: 'project-card', kind: 'compose' },
  { from: 'icon-button', to: 'modal', kind: 'compose' },
  { from: 'modal', to: 'settings-modal', kind: 'wrap' },
  { from: 'settings-modal', to: 'settings-button', kind: 'compose' },
  { from: 'icon-button', to: 'settings-button', kind: 'wrap' },
  { from: 'text-button', to: 'nav-button', kind: 'wrap' },
  { from: 'icon', to: 'doc-row', kind: 'embed' },
  { from: 'search-chip-button', to: 'doc-row', kind: 'compose' },
  { from: 'goto-button', to: 'doc-row', kind: 'compose' },
];

/** 같은 행 skip 화살표는 높이를 다르게 두어 겹치지 않게 한다 */
const SAME_ROW_ARC_LIFT: Record<string, number> = {
  'icon->chip': 56,
  'text->tag': 36,
};

/** 레벨을 2개 이상 건너뛰는 간선은 중간 행을 관통하지 않도록 옆 차로로 우회시킨다 */
const SKIP_LANES: Record<string, { side: 'left' | 'right'; offset: number }> = {
  'chip->status-chip': { side: 'right', offset: 0 },
  'chip->stack-chip-button': { side: 'right', offset: 1 },
  'chip->skill-chip-button': { side: 'right', offset: 2 },
};

/**
 * UML 유사 매핑 — 실선|점선 × filled|outlined 로만 구분한다.
 *   wrap(확장)     = 실선 outlined  ≈ Generalization
 *   context(구체화) = 점선 outlined  ≈ Realization
 *   compose(조합)  = 실선 filled    ≈ Composition
 *   embed(사용)    = 점선 filled    ≈ Dependency
 */
const ARROW_STYLE: Record<
  EdgeKind,
  { opacity: number; dimOpacity: number; filled: boolean }
> = {
  wrap: { opacity: 1, dimOpacity: 0.12, filled: false },
  context: { opacity: 1, dimOpacity: 0.12, filled: false },
  compose: { opacity: 1, dimOpacity: 0.12, filled: true },
  embed: { opacity: 1, dimOpacity: 0.12, filled: true },
};

/** 범례 — 확장 → 구체화 → 조합 → 사용 */
const EDGE_LEGEND: { kind: EdgeKind; label: string; hint: string }[] = [
  { kind: 'wrap', label: '확장', hint: 'Icon → IconButton' },
  { kind: 'embed', label: '사용', hint: 'Icon → Chip' },
  { kind: 'compose', label: '조합', hint: 'GotoButton → DocRow' },
  { kind: 'context', label: '구체화', hint: 'Chip → StatusChip' },
];

const ARROW_KINDS = EDGE_LEGEND.map((item) => item.kind);

/**
 * 레벨 규칙: tier 0/1은 위계 그대로 고정, tier 2(사용)는 실제 의존 관계에 따라
 * tier 최소값 이상으로 더 깊어질 수 있다 (사용 컴포넌트 간 compose).
 */
interface LevelResult {
  rows: string[][];
  level: Map<string, number>;
}

function computeLevels(edges: Edge[]): LevelResult {
  const nodeIds = Array.from(new Set(edges.flatMap((edge) => [edge.from, edge.to])));
  const incoming = new Map<string, string[]>(nodeIds.map((id) => [id, []]));
  edges.forEach((edge) => incoming.get(edge.to)!.push(edge.from));

  const level = new Map<string, number>();
  function levelOf(id: string): number {
    const cached = level.get(id);
    if (cached !== undefined) return cached;
    const tierMin = TIER[id] ?? 0;
    if (tierMin <= 1) {
      level.set(id, tierMin);
      return tierMin;
    }
    const parents = incoming.get(id)!;
    const depForce = parents.length === 0 ? tierMin : 1 + Math.max(...parents.map(levelOf));
    const value = Math.max(tierMin, depForce);
    level.set(id, value);
    return value;
  }
  nodeIds.forEach(levelOf);

  const maxLevel = Math.max(...level.values());
  const rows: string[][] = Array.from({ length: maxLevel + 1 }, () => []);
  nodeIds.forEach((id) => rows[level.get(id)!]!.push(id));
  rows.forEach((row) => row.sort((a, b) => NODE_ORDER.indexOf(a) - NODE_ORDER.indexOf(b)));
  return { rows, level };
}

function byId(id: string): ComponentRelation {
  const found = componentRelations.find((relation) => relation.id === id);
  if (!found) throw new Error(`missing relation ${id}`);
  return found;
}

function nodeHref(relation: ComponentRelation, view: GalleryViewMode, search: string): string {
  const bucket = view === 'domain' ? relation.domain : relation.layer;
  const q = search.startsWith('?') ? search : search ? `?${search}` : '';
  return `${getCategoryPath(bucket)}${q}#${relation.id}`;
}

function verticalPath(from: Point, to: Point): string {
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  // 끝 컨트롤을 출발 쪽으로 당겨 종료 접선이 곡선 방향과 맞도록 함 (수직 고정 방지)
  const c2x = to.x - dx * 0.35;
  const c2y = to.y - (to.y - from.y) * 0.22;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
}

function sameRowPath(from: Point, to: Point): string {
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
}

/** 같은 행 안에서 다른 노드를 사이에 두고 건너뛸 때 — 카드 위로 아치를 그려 피해간다 */
function sameRowOverArcPath(from: Point, to: Point, riseY: number): string {
  const dx = to.x - from.x;
  const c2x = to.x - dx * 0.22;
  const c2y = riseY + (to.y - riseY) * 0.45;
  return `M ${from.x} ${from.y} C ${from.x} ${riseY}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
}

function lanePath(from: Point, to: Point, laneX: number): string {
  const spanY = to.y - from.y;
  const k = spanY * 0.3;
  const c2x = laneX + (to.x - laneX) * 0.2;
  const c2y = to.y - Math.max(14, spanY * 0.18);
  return `M ${from.x} ${from.y} C ${laneX} ${from.y + k}, ${c2x} ${c2y}, ${to.x} ${to.y}`;
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    !!target.closest('.clickable, input, button, textarea, select, [role="slider"]')
  );
}

/** SVG path 끝에서 px만큼 안쪽 + 접선 수직 오프셋(라벨 겹침 방지) */
function pathLabelPoint(
  d: string,
  end: 'start' | 'finish',
  px: number,
  lateral = 0
): Point {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  el.setAttribute('d', d);
  const len = el.getTotalLength();
  const dist = Math.min(Math.max(px, 12), len * 0.55);
  const at = end === 'start' ? dist : Math.max(0, len - dist);
  const p = el.getPointAtLength(at);
  if (lateral === 0) return { x: p.x, y: p.y };
  const p1 = el.getPointAtLength(Math.max(0, at - 2));
  const p2 = el.getPointAtLength(Math.min(len, at + 2));
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const plen = Math.hypot(dx, dy) || 1;
  return { x: p.x + (-dy / plen) * lateral, y: p.y + (dx / plen) * lateral };
}

function isInViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  const m = 8;
  return r.bottom > m && r.top < window.innerHeight - m && r.right > m && r.left < window.innerWidth - m;
}

type MeasuredEdge = Edge & { d: string };

export function ComponentStructureDiagram(): ReactNode {
  const [segment, setSegment] = useState('a');
  const [speed, setSpeed] = useState(1);
  const previewState: StructurePreviewState = { segment, setSegment, speed, setSpeed };
  const { search } = useLocation();
  const [params] = useSearchParams();
  const view: GalleryViewMode = params.get('view') === 'domain' ? 'domain' : 'role';

  const { rows: levels, level: levelById } = useMemo(() => computeLevels(EDGES), []);

  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    function link(a: string, b: string): void {
      if (!map.has(a)) map.set(a, new Set());
      map.get(a)!.add(b);
    }
    EDGES.forEach((edge) => {
      link(edge.from, edge.to);
      link(edge.to, edge.from);
    });
    return map;
  }, []);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  /** hover 중 scroll/resize 시 오프스크린 라벨 가시성 재평가 */
  const [viewTick, setViewTick] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const [paths, setPaths] = useState<MeasuredEdge[]>([]);

  useEffect(() => {
    if (!hoveredId) return;
    function bump(): void {
      setViewTick((n) => n + 1);
    }
    window.addEventListener('scroll', bump, { passive: true, capture: true });
    window.addEventListener('resize', bump);
    return () => {
      window.removeEventListener('scroll', bump, true);
      window.removeEventListener('resize', bump);
    };
  }, [hoveredId]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function measure(): void {
      const containerRect = container!.getBoundingClientRect();
      const anchors = new Map<string, NodeAnchors>();
      let minLeft = Infinity;
      let maxRight = -Infinity;
      nodeRefs.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        const left = rect.left - containerRect.left;
        const right = rect.right - containerRect.left;
        const top = rect.top - containerRect.top;
        const bottom = rect.bottom - containerRect.top;
        const midX = left + rect.width / 2;
        const midY = top + rect.height / 2;
        anchors.set(id, {
          top: { x: midX, y: top },
          bottom: { x: midX, y: bottom },
          left: { x: left, y: midY },
          right: { x: right, y: midY },
        });
        minLeft = Math.min(minLeft, left);
        maxRight = Math.max(maxRight, right);
      });

      setPaths(
        EDGES.flatMap((edge) => {
          const from = anchors.get(edge.from);
          const to = anchors.get(edge.to);
          if (!from || !to) return [];

          const fromLevel = levelById.get(edge.from) ?? 0;
          const toLevel = levelById.get(edge.to) ?? 0;
          const key = `${edge.from}->${edge.to}`;
          const lane = SKIP_LANES[key];

          if (fromLevel === toLevel) {
            const row = levels[fromLevel] ?? [];
            const indexGap = Math.abs(row.indexOf(edge.from) - row.indexOf(edge.to));
            if (indexGap > 1) {
              const lift = SAME_ROW_ARC_LIFT[key] ?? 28 + indexGap * 12;
              const riseY = Math.min(from.top.y, to.top.y) - lift;
              return [{ ...edge, d: sameRowOverArcPath(from.top, to.top, riseY) }];
            }
            const goingRight = from.bottom.x <= to.bottom.x;
            const src = goingRight ? from.right : from.left;
            const dst = goingRight ? to.left : to.right;
            return [{ ...edge, d: sameRowPath(src, dst) }];
          }

          if (lane) {
            const laneX =
              lane.side === 'left' ? minLeft - 24 - lane.offset * 20 : maxRight + 24 + lane.offset * 20;
            return [{ ...edge, d: lanePath(from.bottom, to.top, laneX) }];
          }

          return [{ ...edge, d: verticalPath(from.bottom, to.top) }];
        })
      );
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [levels, levelById]);

  function isNodeRelated(id: string): boolean {
    if (!hoveredId) return true;
    return id === hoveredId || (adjacency.get(hoveredId)?.has(id) ?? false);
  }

  function isOtherOffscreen(otherId: string): boolean {
    void viewTick;
    const el = nodeRefs.current.get(otherId);
    return !!el && !isInViewport(el);
  }

  const edgeLabels = useMemo(() => {
    if (!hoveredId) return [];
    void viewTick;
    const endOf = (from: string): 'start' | 'finish' =>
      from === hoveredId ? 'start' : 'finish';

    const candidates = paths.flatMap((edge, index) => {
      if (edge.from !== hoveredId && edge.to !== hoveredId) return [];
      const otherId = edge.from === hoveredId ? edge.to : edge.from;
      if (!isOtherOffscreen(otherId)) return [];
      const end = endOf(edge.from);
      // 접근 방향 정렬용 — 끝에서 조금 떨어진 x
      const sortX = pathLabelPoint(edge.d, end, 96).x;
      return [{ index, edge, otherId, end, sortX }];
    });

    candidates.sort((a, b) => a.sortX - b.sortX || a.otherId.localeCompare(b.otherId));
    const count = candidates.length;
    const basePx = 40 + Math.max(0, count - 1) * 10;

    return candidates.map((item, slot) => {
      const lateral = (slot - (count - 1) / 2) * 16;
      const at = pathLabelPoint(item.edge.d, item.end, basePx + slot * 28, lateral);
      return {
        key: item.index,
        title: byId(item.otherId).title,
        x: at.x,
        y: at.y,
      };
    });
    // isOtherOffscreen는 viewTick·nodeRefs에 의존 — hoveredId/paths/viewTick로 충분
    // eslint-disable-next-line react-hooks/exhaustive-deps -- viewTick이 가시성 재평가 트리거
  }, [hoveredId, paths, viewTick]);

  return (
    <section className={styles.structure} aria-labelledby="structure-heading">
      <div className={styles.structureHead}>
        <h2 id="structure-heading" className={styles.structureTitle}>
          Component Structure
        </h2>
        <ul className={styles.edgeLegend} aria-label="화살표 종류">
          {EDGE_LEGEND.map(({ kind, label, hint }) => {
            const { opacity, filled } = ARROW_STYLE[kind];
            return (
              <li key={kind} className={styles.edgeLegendItem} title={hint}>
                <svg
                  className={styles.edgeLegendSample}
                  viewBox="0 0 40 12"
                  aria-hidden="true"
                >
                  <line
                    x1="2"
                    y1="6"
                    x2="28"
                    y2="6"
                    className={`${styles.edge} ${styles[`edge_${kind}`]}`}
                    style={{
                      stroke: 'var(--color-text)',
                      opacity,
                    }}
                  />
                  <path
                    d="M28,2 L38,6 L28,10 Z"
                    fill={filled ? 'var(--color-text)' : 'var(--color-bg)'}
                    stroke={filled ? 'none' : 'var(--color-text)'}
                    strokeWidth={filled ? undefined : 1.25}
                    strokeLinejoin="round"
                    opacity={opacity}
                  />
                </svg>
                <span className={styles.edgeLegendLabel}>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.structureGraph} ref={containerRef}>
        <svg className={styles.structureEdges} aria-hidden="true">
          <defs>
            {ARROW_KINDS.map((kind) => {
              const filled = ARROW_STYLE[kind].filled;
              return (
                <marker
                  key={kind}
                  id={`structure-arrow-${kind}`}
                  markerWidth="9"
                  markerHeight="9"
                  refX={filled ? 8 : 7.5}
                  refY="4.5"
                  orient="auto-start-reverse"
                  markerUnits="userSpaceOnUse"
                >
                  <path
                    d="M0.75,0.75 L8.25,4.5 L0.75,8.25 Z"
                    fill={filled ? 'var(--color-text)' : 'var(--color-bg)'}
                    stroke={filled ? 'none' : 'var(--color-text)'}
                    strokeWidth={filled ? undefined : 1.25}
                    strokeLinejoin="round"
                  />
                </marker>
              );
            })}
          </defs>
          {paths.map(({ kind, d, from, to }, index) => {
            const related =
              hoveredId !== null && (from === hoveredId || to === hoveredId);
            const { opacity, dimOpacity } = ARROW_STYLE[kind];
            return (
              <path
                key={index}
                d={d}
                className={`${styles.edge} ${styles[`edge_${kind}`]}`}
                style={{
                  stroke: 'var(--color-text)',
                  opacity: related ? opacity : dimOpacity,
                }}
                markerEnd={`url(#structure-arrow-${kind})`}
              />
            );
          })}
        </svg>

        <svg className={styles.structureEdgeLabels} aria-hidden="true">
          {edgeLabels.map(({ key, title, x, y }) => (
            <text
              key={key}
              className={styles.edgeLabel}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {title}
            </text>
          ))}
        </svg>

        {levels.map((ids, index) => {
          const tier = Math.min(TIER[ids[0]!] ?? 0, 3);
          return (
            <div
              key={index}
              className={buildCls(styles.structureRow, styles[`structureRowTier${tier}`])}
            >
              <p className={styles.structureRowLabel}>{TIER_LABEL[tier]}</p>
              <div className={styles.structureLevel}>
                {ids.map((id) => {
                  const relation = byId(id);
                  const href = nodeHref(relation, view, search);
                  const related = isNodeRelated(id);
                  return (
                    <div
                      key={id}
                      className={buildCls(
                        styles.structureNode,
                        !related && styles.structureNodeDimmed,
                        id === hoveredId && styles.structureNodeActive
                      )}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
                      ref={(el) => {
                        if (el) nodeRefs.current.set(id, el);
                        else nodeRefs.current.delete(id);
                      }}
                    >
                      <Card>
                        <Link to={href} className={styles.structureNameLink}>
                          <GalleryTitle
                            className={styles.structureName}
                            title={relation.title}
                            suffix={getComplementLabel(relation, view)}
                          />
                        </Link>
                        <div
                          className={styles.structurePreview}
                          onPointerDown={(e) => {
                            if (isInteractiveTarget(e.target)) e.stopPropagation();
                          }}
                          onClick={(e) => {
                            if (isInteractiveTarget(e.target)) e.stopPropagation();
                          }}
                        >
                          {structurePreview(id, previewState)}
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
