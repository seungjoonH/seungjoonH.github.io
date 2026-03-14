const svgContentCache = new Map();

export function fetchSvgContent(src) {
  if (!src || !String(src).toLowerCase().endsWith('.svg')) {
    return Promise.reject(new Error('Invalid SVG src'));
  }
  if (svgContentCache.has(src)) {
    return Promise.resolve(svgContentCache.get(src));
  }
  return fetch(src)
    .then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.text();
    })
    .then((text) => {
      svgContentCache.set(src, text);
      return text;
    });
}

export function injectSvgSize(svgText) {
  if (typeof svgText !== 'string') return '';
  return svgText.replace(
    /<svg(\s[^>]*)?>/i,
    '<svg$1 style="width:100%;height:100%;display:block;vertical-align:middle">'
  );
}

export default { fetchSvgContent, injectSvgSize, svgContentCache };
