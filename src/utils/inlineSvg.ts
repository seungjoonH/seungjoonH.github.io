// SVG URL fetch 캐시 및 인라인 렌더용 size 스타일 주입
const svgContentCache = new Map<string, string>();

/**
 * SVG URL을 fetch해 텍스트로 반환한다. 같은 src는 메모리 캐시를 쓴다.
 * @param src - `.svg`로 끝나는 URL
 * @returns SVG 원문 문자열
 * @throws src가 유효하지 않거나 HTTP 응답이 실패하면 Error
 */
export async function fetchSvgContent(src: string): Promise<string> {
  if (!src.toLowerCase().endsWith('.svg')) {
    throw new Error('Invalid SVG src');
  }
  const cached = svgContentCache.get(src);
  if (cached) return cached;

  const res = await fetch(src);
  if (!res.ok) throw new Error(res.statusText);
  const text = await res.text();
  svgContentCache.set(src, text);
  return text;
}

/**
 * SVG 루트에 width/height 100% 인라인 스타일을 주입한다.
 * @param svgText - SVG 원문
 * @returns 스타일이 주입된 SVG 문자열
 */
export function injectSvgSize(svgText: string): string {
  return svgText.replace(
    /<svg(\s[^>]*)?>/i,
    '<svg$1 style="width:100%;height:100%;display:block;vertical-align:middle">'
  );
}
