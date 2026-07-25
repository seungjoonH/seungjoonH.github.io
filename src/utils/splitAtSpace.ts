// 공백 분할: 폭 우선 → L1≥L2(50~70%) → 불가 시 multi 모드

export type SplitAtSpaceMode = 'single' | 'double' | 'multi';

export interface SplitAtSpaceResult {
  mode: SplitAtSpaceMode;
  first: string;
  second?: string;
}

function collectSpaceIndices(text: string): number[] {
  const spaces: number[] = [];
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === ' ') spaces.push(i);
  }
  return spaces;
}

type SpaceCandidate = { first: string; second: string; ratio: number };

/** L1 글자수 ≥ L2 (최소 50:50) 인 공백 분할만 */
function candidatesWithLongerOrEqualFirst(trimmed: string): SpaceCandidate[] {
  const spaces = collectSpaceIndices(trimmed);
  const total = trimmed.length;
  const out: SpaceCandidate[] = [];
  for (const idx of spaces) {
    const first = trimmed.slice(0, idx).trimEnd();
    const second = trimmed.slice(idx + 1).trimStart();
    if (!first || !second) continue;
    if (first.length < second.length) continue;
    out.push({ first, second, ratio: first.length / total });
  }
  return out;
}

function pickClosestRatio(cands: SpaceCandidate[], preferRatio: number): SplitAtSpaceResult {
  let best = cands[0];
  let bestDist = Math.abs(best.ratio - preferRatio);
  for (const c of cands) {
    const dist = Math.abs(c.ratio - preferRatio);
    if (dist < bestDist) {
      best = c;
      bestDist = dist;
    }
  }
  return { mode: 'double', first: best.first, second: best.second };
}

/**
 * 공백에서만 끊고, 전체 길이의 `ratio`에 가장 가까운 공백으로 2줄 분할한다.
 * L1 ≥ L2 후보가 있으면 그걸 쓰고, 없으면 일반 최근접 공백.
 */
export function splitAtSpaceNearRatio(text: string, ratio = 0.65): SplitAtSpaceResult {
  const trimmed = text.trim();
  if (!trimmed) return { mode: 'single', first: '' };

  const longer = candidatesWithLongerOrEqualFirst(trimmed);
  if (longer.length > 0) return pickClosestRatio(longer, ratio);

  const spaces = collectSpaceIndices(trimmed);
  if (spaces.length === 0) return { mode: 'single', first: trimmed };

  const clamped = Math.min(0.9, Math.max(0.1, ratio));
  const target = trimmed.length * clamped;
  let best = spaces[0];
  let bestDist = Math.abs(best - target);
  for (const idx of spaces) {
    const dist = Math.abs(idx - target);
    if (dist < bestDist) {
      best = idx;
      bestDist = dist;
    }
  }

  const first = trimmed.slice(0, best).trimEnd();
  const second = trimmed.slice(best + 1).trimStart();
  if (!first || !second) return { mode: 'single', first: trimmed };
  return { mode: 'double', first, second };
}

/**
 * 공백 기준 그리디 줄바꿈으로, 이 텍스트가 maxWidth에서 자연스럽게 몇 줄이 되는지 센다.
 * 잘림 없이 "몇 줄이 필요한가"만 알고 싶을 때 사용 (예: 정확히 2줄일 때만 비율 분할 적용).
 */
export function countNaturalWrapLines(
  text: string,
  measure: (s: string) => number,
  maxWidth: number,
): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;

  let lines = 1;
  let currentLine = words[0]!;
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${currentLine} ${words[i]}`;
    if (measure(candidate) <= maxWidth) {
      currentLine = candidate;
    } else {
      lines += 1;
      currentLine = words[i]!;
    }
  }
  return lines;
}

/**
 * 우선순위
 * 1. 카드 폭 — L1(또는 1줄 전체)이 maxWidth를 넘기면 안 됨
 * 2. 1줄로 충분하면 single
 * 3. 넘치면 공백 분할. L1≥L2, 목표는 preferRatio(±5%p 대역). 폭이 줄면 50:50까지 허용
 * 4. L1≥50% 이면서 폭에 들어가는 분할이 없으면 multi (CSS wrap + line-clamp)
 */
export function splitAtSpaceFittingWidth(
  text: string,
  measure: (s: string) => number,
  maxWidth: number,
  preferRatio = 0.65,
): SplitAtSpaceResult {
  const trimmed = text.trim();
  if (!trimmed) return { mode: 'single', first: '' };
  if (maxWidth <= 0) return { mode: 'multi', first: trimmed };

  // 1줄로 충분
  if (measure(trimmed) <= maxWidth) return { mode: 'single', first: trimmed };

  const longer = candidatesWithLongerOrEqualFirst(trimmed);
  // 폭에 들어가는 L1≥L2 만 (카드 폭 최우선)
  const fitting = longer.filter((c) => measure(c.first) <= maxWidth);

  if (fitting.length === 0) {
    // 50:50조차 폭에 못 넣음 → 일반 줄바꿈 + line-clamp
    return { mode: 'multi', first: trimmed };
  }

  // preferRatio 대역(±5%p) 우선, 없으면 50%~대역 상단에서 preferRatio에 가깝게
  const clampedRatio = Math.min(0.95, Math.max(0.5, preferRatio));
  const bandLow = Math.max(0.5, clampedRatio - 0.05);
  const bandHigh = clampedRatio + 0.05;

  const inBand = fitting.filter((c) => c.ratio >= bandLow && c.ratio <= bandHigh);
  if (inBand.length > 0) return pickClosestRatio(inBand, clampedRatio);

  const towardHalf = fitting.filter((c) => c.ratio >= 0.5 && c.ratio <= bandHigh);
  if (towardHalf.length > 0) return pickClosestRatio(towardHalf, clampedRatio);

  return pickClosestRatio(fitting, clampedRatio);
}
