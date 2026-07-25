// splitAtSpace 단위 테스트
import { describe, expect, it } from 'vitest';
import { countNaturalWrapLines, splitAtSpaceFittingWidth, splitAtSpaceNearRatio } from './splitAtSpace';

describe('splitAtSpaceNearRatio', () => {
  it('공백이 없으면 한 줄만 반환한다', () => {
    expect(splitAtSpaceNearRatio('선언적렌더링')).toEqual({ mode: 'single', first: '선언적렌더링' });
  });

  it('공백에서만 자르고 L1이 L2보다 길거나 같다', () => {
    const text =
      'Vanilla JS 의 명령형 DOM 조작부터 React 의 선언적 렌더링까지 이어지는 DOM 렌더링 흐름 이해';
    const { mode, first, second } = splitAtSpaceNearRatio(text, 0.65);
    expect(mode).toBe('double');
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

  it('폭이 넉넉하면 L1 60~70% double', () => {
    const text =
      'Vanilla JS 의 명령형 DOM 조작부터 React 의 선언적 렌더링까지 이어지는 DOM 렌더링 흐름 이해';
    // L1이 폭에 들어가도록 넉넉한 maxWidth
    const { mode, first, second } = splitAtSpaceFittingWidth(text, measure, 50, 0.65);
    expect(mode).toBe('double');
    expect(first.length).toBeGreaterThanOrEqual(second!.length);
    const ratio = first.length / text.length;
    expect(ratio).toBeGreaterThanOrEqual(0.6);
    expect(ratio).toBeLessThanOrEqual(0.7);
  });

  it('폭이 줄면 50:50에 가까운 fitting double', () => {
    const text = 'aaaa bbbb cccc dddd eeee ffff';
    // total 29. half≈14.5. maxWidth 15 → L1≈"aaaa bbbb cccc"(14) ratio≈0.48?
    // "aaaa bbbb cccc dddd" = 19 > 15. "aaaa bbbb cccc" = 14 <= 15, vs rest "dddd eeee ffff"=14 → 50:50
    const { mode, first, second } = splitAtSpaceFittingWidth(text, measure, 15, 0.65);
    expect(mode).toBe('double');
    expect(measure(first)).toBeLessThanOrEqual(15);
    expect(first.length).toBeGreaterThanOrEqual(second!.length);
  });

  it('L1≥50% 가 폭에 안 들어가면 multi', () => {
    const text = 'toolongworda toolongwordb toolongwordc';
    // any L1≥50% is longer than 10
    const result = splitAtSpaceFittingWidth(text, measure, 10, 0.65);
    expect(result).toEqual({ mode: 'multi', first: text });
  });

  it('preferRatio가 다르면 후보가 여러 개일 때 다른 지점에서 분할한다', () => {
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do';
    const width = 52; // 39자·50자 후보는 들어가고 55자·59자 후보는 안 들어가는 폭

    const near65 = splitAtSpaceFittingWidth(text, measure, width, 0.65);
    expect(near65.first).toBe('Lorem ipsum dolor sit amet, consectetur');

    const near80 = splitAtSpaceFittingWidth(text, measure, width, 0.8);
    expect(near80.first).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing');
  });

  it('L1은 절대 maxWidth를 넘지 않는다 (double)', () => {
    const text =
      'Vanilla JS Store 부터 Zustand 까지 이어지는 상태 관리 흐름 이해';
    for (const w of [12, 18, 24, 30]) {
      const r = splitAtSpaceFittingWidth(text, measure, w, 0.65);
      if (r.mode === 'double') {
        expect(measure(r.first)).toBeLessThanOrEqual(w);
        expect(r.first.length).toBeGreaterThanOrEqual(r.second!.length);
      }
    }
  });
});

describe('countNaturalWrapLines', () => {
  const measure = (s: string) => s.length;

  it('한 줄에 다 들어가면 1', () => {
    expect(countNaturalWrapLines('short title here', measure, 100)).toBe(1);
  });

  it('그리디 줄바꿈으로 정확히 2줄이 되는 경우를 센다', () => {
    const text = 'aaaa bbbb cccc dddd';
    // "aaaa bbbb cccc"(14) <= 15, "aaaa bbbb cccc dddd"(19) > 15 → 2줄
    expect(countNaturalWrapLines(text, measure, 15)).toBe(2);
  });

  it('폭이 더 좁으면 3줄 이상도 센다', () => {
    const text = 'aaaa bbbb cccc dddd eeee ffff';
    expect(countNaturalWrapLines(text, measure, 10)).toBeGreaterThanOrEqual(3);
  });

  it('빈 문자열은 1줄로 취급한다', () => {
    expect(countNaturalWrapLines('   ', measure, 100)).toBe(1);
  });
});
