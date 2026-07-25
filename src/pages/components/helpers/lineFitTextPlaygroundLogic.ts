// LineFitText 갤러리 플레이그라운드용 순수 로직 — 샘플 문장, lineCount 파싱, 사용 코드 문자열 생성
export const LINE_FIT_TEXT_SAMPLES = [
  { value: 'short', label: '짧은 문장', text: 'Lorem ipsum dolor sit amet' },
  {
    value: 'mid',
    label: '중간 문장',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do',
  },
  {
    value: 'long',
    label: '긴 문장',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam',
  },
] as const;

export const LINE_FIT_TEXT_MIN_LINE_COUNT = 0;
export const LINE_FIT_TEXT_MAX_LINE_COUNT = 5;

export function parseLineCount(raw: string): number | null {
  if (raw.trim() === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < LINE_FIT_TEXT_MIN_LINE_COUNT) return null;
  return Math.floor(n);
}

function escapeForCodeString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export interface LineFitTextUsageCodeInput {
  text: string;
  lineCount: number;
  splitRatio?: number;
}

export function buildLineFitTextUsageCode({
  text,
  lineCount,
  splitRatio,
}: LineFitTextUsageCodeInput): string {
  const lines = [`<LineFitText`, `  text="${escapeForCodeString(text)}"`, `  lineCount={${lineCount}}`];
  if (lineCount === 2 && splitRatio != null) {
    lines.push(`  splitRatio={${splitRatio}}`);
  }
  lines.push('/>');
  return lines.join('\n');
}
