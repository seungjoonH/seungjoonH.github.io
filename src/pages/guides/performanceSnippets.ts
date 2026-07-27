// /performance 페이지 데이터 — 리소스 타입별 요청 실측치, Before/After 코드
// 출처: docs/measurements/2026-07-25-baseline (Lighthouse 12.8.2, mobile 시뮬레이션, 3회 median)

export const REQUEST_TOTAL_BEFORE = 254;
export const REQUEST_TOTAL_AFTER = 69;

export interface RequestTypeCount {
  type: string;
  before: number;
  after: number;
  /** 실제 network-requests 감사에서 확인한 대표 파일 예시 */
  example: string;
}

/**
 * 리소스 타입별 요청 수 — network-requests 감사 원본을 그대로 집계, before 기준 내림차순.
 * 아이콘은 resourceType이 Fetch/Image로 나뉘어 찍히므로(147+15=162) 별도 행으로 합산하고,
 * 남은 Fetch/Image는 아이콘과 무관한 나머지(프로젝트·경력 썸네일, 배경 삽화)만 남긴다.
 * Document/Preflight/Other는 개수가 작고 아이콘 이야기와 무관해 'Others'로 합침.
 */
export const REQUEST_BREAKDOWN: RequestTypeCount[] = [
  { type: 'Icons', before: 162, after: 0, example: '34종 SVG의 중복 요청 포함' },
  { type: 'Script', before: 41, after: 26, example: 'index.js, Main.js 등' },
  { type: 'Stylesheet', before: 22, after: 14, example: 'index.css, pretendard.min.css' },
  { type: 'Fetch', before: 18, after: 17, example: '프로젝트·경력 썸네일 SVG' },
  { type: 'Font', before: 5, after: 5, example: 'NeueHaasDisplay*.ttf' },
  { type: 'Image', before: 3, after: 3, example: 'pano.svg 등 배경 삽화' },
  { type: 'Others', before: 3, after: 4, example: 'HTML 문서, CORS preflight 등' },
];

export const REQUEST_BREAKDOWN_MAX = 162;

export interface MeasuredComparison {
  label: string;
  icon: 'link' | 'play' | 'check' | 'document';
  before: string;
  after: string;
  delta: string;
  outcome: 'improved' | 'regressed';
}

/** 모바일 제한 환경에서 Before v1.0.9와 현재 버전을 각각 5회 실행한 중앙값 */
export const MEASURED_COMPARISONS: MeasuredComparison[] = [
  {
    label: '아이콘 요청',
    icon: 'link',
    before: '162건',
    after: '0건',
    delta: '162건 제거',
    outcome: 'improved',
  },
  {
    label: '첫 아이콘 표시',
    icon: 'play',
    before: '5.42초',
    after: '6.18초',
    delta: '0.76초 느림',
    outcome: 'regressed',
  },
  {
    label: '전체 아이콘 표시 완료',
    icon: 'check',
    before: '11.79초',
    after: '9.76초',
    delta: '2.03초 단축',
    outcome: 'improved',
  },
  {
    label: 'JS gzip',
    icon: 'document',
    before: '239KB',
    after: '344KB',
    delta: '105KB 증가',
    outcome: 'regressed',
  },
];

export const CODE_ICON_FETCH_BEFORE = `function SvgInlineSpan({ resolvedSrc, ... }) {
  const [svgContent, setSvgContent] = useState(null);
  useEffect(() => {
    fetchSvgContent(resolvedSrc).then((text) => setSvgContent(text));
  }, [resolvedSrc]);
  if (!svgContent) return null;
  return <span dangerouslySetInnerHTML={{ __html: svgContent }} />;
}

export function Icon({ name, ...rest }) {
  const resolvedSrc = Paths.icons(name); // public/assets/icons/{name}.svg
  return <SvgInlineSpan resolvedSrc={resolvedSrc} {...rest} />;
}`;

export const CODE_ICON_GLOB_AFTER = `const UI_ICONS = {
  outline: import.meta.glob('/src/assets/icons/ui/outline/*.svg', {
    eager: true, query: '?react', import: 'default',
  }),
  fill: import.meta.glob('/src/assets/icons/ui/fill/*.svg', {
    eager: true, query: '?react', import: 'default',
  }),
};

function IconRoot({ name, kind = 'outline' }) {
  const SvgComponent = UI_ICONS[kind][\`/src/assets/icons/ui/\${kind}/\${name}.svg\`];
  return <span className={styles.shell}><SvgComponent /></span>;
}
export const Icon = { Primary: IconRoot, ... };`;

export const CODE_BUNDLE_OUTPUT_BEFORE = `const r="/assets/icons/"+e+".svg";
fetch(r).then(e=>e.text()).then(e=>t(e));
return p.jsx("span",{dangerouslySetInnerHTML:{__html:n}})`;

/** npm run build 로 만든 index.js 발췌 — sun.svg의 path 데이터가 문자열로 박혀 있다 */
export const CODE_BUNDLE_OUTPUT_AFTER = `p.createElement("path",{d:"M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41",stroke:"currentColor",strokeWidth:1.5,...})`;
