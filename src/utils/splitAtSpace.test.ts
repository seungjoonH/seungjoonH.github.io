// splitAtSpace 단위 테스트
import { describe, expect, it } from 'vitest';
import { splitAtSpaceFittingWidth, splitAtSpaceNearRatio } from './splitAtSpace';

describe('splitAtSpaceNearRatio', () => {
  it('공백이 없으면 한 줄만 반환한다', () => {
    expect(splitAtSpaceNearRatio('선언적렌더링')).toEqual({ mode: 'single', first: '선언적렌더링' });
  });

  it('공백에서만 자르고 L1이 L2보다 길거나 같다', () => {
    const text =
      'Vanilla JS 의 명령형 DOM 조작부터 React 의 선언적 렌더링까지 이어지는 DOM 렌더링 흐름 이해';
    const { mode, first, second } = splitAtSpaceNearRatio(text, 0.65);
    expect(mode).toBe('split');
    expect(second).toBeTruthy();
    expect(`${first} ${second}`).toBe(text);
    expect(first.length).toBeGreaterThanOrEqual(second!.length);
  });
});

describe('splitAtSpaceFittingWidth', () => {
  const measure = (s: string) => s.length;

  it('1줄로 들어가면 single', () => {
    expect(splitAtSpaceFittingWidth('short title here', measure, 100, 0.65)).toEqual({
      mode: 'single',
      first: 'short title here',
    });
  });

  it('폭이 넉넉하면 L1 60~70% split', () => {
    const text =
      'Vanilla JS 의 명령형 DOM 조작부터 React 의 선언적 렌더링까지 이어지는 DOM 렌더링 흐름 이해';
    // L1이 폭에 들어가도록 넉넉한 maxWidth
    const { mode, first, second } = splitAtSpaceFittingWidth(text, measure, 50, 0.65);
    expect(mode).toBe('split');
    expect(first.length).toBeGreaterThanOrEqual(second!.length);
    const ratio = first.length / text.length;
    expect(ratio).toBeGreaterThanOrEqual(0.6);
    expect(ratio).toBeLessThanOrEqual(0.7);
  });

  it('폭이 줄면 50:50에 가까운 fitting split', () => {
    const text = 'aaaa bbbb cccc dddd eeee ffff';
    // total 29. half≈14.5. maxWidth 15 → L1≈"aaaa bbbb cccc"(14) ratio≈0.48? 
    // "aaaa bbbb cccc dddd" = 19 > 15. "aaaa bbbb cccc" = 14 <= 15, vs rest "dddd eeee ffff"=14 → 50:50
    const { mode, first, second } = splitAtSpaceFittingWidth(text, measure, 15, 0.65);
    expect(mode).toBe('split');
    expect(measure(first)).toBeLessThanOrEqual(15);
    expect(first.length).toBeGreaterThanOrEqual(second!.length);
  });

  it('L1≥50% 가 폭에 안 들어가면 wrap', () => {
    const text = 'toolongworda toolongwordb toolongwordc';
    // any L1≥50% is longer than 10
    const result = splitAtSpaceFittingWidth(text, measure, 10, 0.65);
    expect(result).toEqual({ mode: 'wrap', first: text });
  });

  it('L1은 절대 maxWidth를 넘지 않는다 (split)', () => {
    const text =
      'Vanilla JS Store 부터 Zustand 까지 이어지는 상태 관리 흐름 이해';
    for (const w of [12, 18, 24, 30]) {
      const r = splitAtSpaceFittingWidth(text, measure, w, 0.65);
      if (r.mode === 'split') {
        expect(measure(r.first)).toBeLessThanOrEqual(w);
        expect(r.first.length).toBeGreaterThanOrEqual(r.second!.length);
      }
    }
  });
});
