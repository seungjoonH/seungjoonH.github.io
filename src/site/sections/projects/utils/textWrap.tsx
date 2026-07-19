// 공백 단위로 텍스트를 span으로 감싸 줄바꿈·하이라이트 렌더에 사용
import type { ReactNode } from 'react';

export function renderTextWithBreakAtSpaces(
  text: unknown,
  wordClassName: string,
  renderSegment?: (segment: string) => ReactNode
): ReactNode {
  if (text == null || text === '') return null;
  const str = String(text);
  const segments = str.split(/(\s+)/);
  return segments.map((seg, i) => {
    if (/^\s+$/.test(seg)) return seg;
    const content = renderSegment ? renderSegment(seg) : seg;
    return (
      <span key={i} className={wordClassName}>
        {content}
      </span>
    );
  });
}
