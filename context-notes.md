# Wave 3~5 Context Notes

## Contact field card layering (2026-07-16)

- `design/architecture.md` 기준 Composed는 store/config 없는 의미 래퍼, Feature는 configStore·검색 store·팝업 등 앱 상태나 설정에 바인딩된 완성형이다.
- 값 직접 주입 API(`<FieldCard iconName="email" label="email" value="..." />`)는 config를 읽지 않으므로 Composed가 맞다.
- 기존 `ContactFieldCard field="email"`은 config.contact, i18n 라벨, href, copy 액션을 합치는 앱 기능 래퍼라 Feature에 유지한다.
- 갤러리는 `FieldCard`에서 직접 값 4종을 보여주고, `ContactFieldCard`는 `CONTACT_FIELD_KEYS`를 순회해 config 기반 연락처 4종을 보여준다.
- 검증: `npm run typecheck`, `npm test`, `npm run build`.
- 갤러리의 FieldCard/ContactFieldCard 예시는 폭이 좁아도 세로로 쌓이지 않게 `grid-auto-flow: column` + 가로 스크롤로 배치한다.
- `FieldCard` 예시는 실제 contact 값과 겹치지 않도록 document/deploy/person/settings 기반 더미 데이터로 둔다.
- 각 카드가 하나의 preview로 묶이지 않게 FieldCard/ContactFieldCard 모두 카드별 `ComponentPreview`를 별도로 렌더링한다.
- ContactFieldCard preview에서 URL이 줄바꿈되지 않도록 카드 preview 컬럼 최소 폭을 300px로 늘린다.
- 카드별 실제 폭이 달라지지 않도록 preview 레일 컬럼을 400px 고정폭으로 두고, `ComponentPreview`가 컬럼 폭을 100% 채우게 한다.
- `formatUsageCode`의 attr splitter가 줄바꿈을 공백으로 처리하지 않아 multi-line usage에서 첫 prop만 남는 버그를 수정했다.
- 카드 preview 기본 폭이 과해져 400px의 60% 수준인 240px 고정폭으로 줄인다.
- 카드 preview 폭을 280px로 조정하고, FieldCard label/value 폰트 배율을 1.12에서 기본 clamp로 낮춘다.
- 현재 Card는 `className`을 받지 않으므로 FieldCard는 Card에 class를 넘기지 않고 외부 surface + 내부 layout 래퍼로 구성한다.
- FieldCard label은 기존 크기(`* 1.12`)로 되돌리고 value만 축소 상태를 유지한다.
- 카드 preview 폭을 280px에서 260px로 낮춘다.
- FieldCard preview 폭을 250px로 낮추고, value font-size는 기본 clamp의 0.92배로 줄인다.
- FieldCard/ContactFieldCard preview는 240px 고정 컬럼으로 두고, 가로 스크롤 대신 responsive grid wrap으로 다음 row에 배치한다.

## FlipCard extraction (2026-07-16)

- `ProjectCard`의 검색/칩/analytics/popup 렌더링은 유지하고, flip shell만 `components/interactive/card/FlipCard`로 분리한다.
- `FlipCard` API는 `front`, `back`, `onOpen`, optional `flipped`/`onFlippedChange`를 중심으로 둔다.
- uncontrolled 사용 시 click/Enter/Space는 `onOpen`, hover/focus-within은 CSS flip이다.
- controlled 사용 시 click은 `flipped=false`면 `onFlippedChange(true)`, `flipped=true`면 `onOpen()` 후 `onFlippedChange(false)`로 모바일 2-tap 흐름을 지원한다.
- 마우스 클릭은 root focus를 만들지 않도록 `onMouseDown.preventDefault()`를 적용해 desktop click이 `:focus-within` flip과 섞이지 않게 한다. nested button/link mousedown은 그대로 둔다.
- `ProjectCard`는 desktop에서 uncontrolled `FlipCard`, mobile에서 controlled `FlipCard`로 사용한다.
- 검증: `npm run typecheck`, `npm test`, `npm run build`.

## SegmentedButton visual alignment (2026-07-16)

- `SegmentedButton` 이름은 유지한다. Role/Domain, outline/fill, language처럼 상호 배타 옵션 그룹을 나타내는 UI 패턴명이라 의미가 맞다.
- 탭 컴포넌트(`TabNavigation`)와는 역할이 다르므로 `Tabs`류로 rename하지 않는다.
- `SegmentedButton`은 divider/overflow clip + square 버튼을 제거하고, gap/padding이 있는 outer border 안에서 selected rounded surface만 보이게 맞춘다.
- 검증: `npm run typecheck`, `npm test`.
- `SegmentedButton`은 모든 옵션을 `TextButton.Primary`로 렌더링하고, selected surface만 CSS에서 부여한다.
- 기존 `.segment :global([class*='text'])`는 `textButton` root까지 잡아 모양을 깨뜨려서 `button > span > span`으로 범위를 좁힌다.
- selected/unselected의 글자 굵기 차이를 없애기 위해 selected `font-weight: 500`은 제거한다.

## Chip gallery labels (2026-07-16)

- Chip variant 매트릭스는 Text 섹션처럼 실제 표시 label도 `primary`/`secondary`/`outlined`로 맞춘다.

## FlipCard gallery usage (2026-07-16)

- `FlipCard`는 surface 컴포넌트가 아니라 front/back 슬롯을 회전시키는 interactive shell이다.
- 갤러리 usage에서 `<Card>`를 front/back에 넣는 예시는 의도를 흐리므로 실제 렌더처럼 plain face node 예시로 바꾼다.
- FlipCard 단순 예시는 `Text.Primary`를 사용하고, 복합 예시는 Text/Chip/Icon 조합 face를 사용한다.
- FlipCard 복합 예시는 가짜 `SummaryFace`/`ActionFace` 대신 기존 Composed 컴포넌트인 `FieldCard`와 `TypedExternalLink`를 넣는다.
- 기본 `FlipCard`는 자체 카드 surface를 만들고, `front`/`back` 슬롯은 그 안쪽 content로 들어간다.
- 이미 완성된 카드 surface를 뒤집는 `ProjectCard`는 `surface={false}`로 기존 외형을 유지한다.
- face는 absolute inset으로 같은 컨테이너 크기를 공유하므로 앞뒤 렌더 크기는 항상 같다.
- 검증: `npm run typecheck`, `npm test`, `npm run build`.

## Toggle icon gallery and theme toggle color (2026-07-16)

- `ToggleIconButton` 갤러리는 Feature인 `ThemeToggleButton`과 혼동되지 않게 sun/moon 대신 eye-open/eye-off를 사용한다.
- `ThemeToggleButton`은 Toggle pressed variant에 맡기면 dark theme에서 흰 secondary surface가 나오므로, feature CSS에서 theme 값 기준 색을 고정한다.
- 검증: `npm run typecheck`, `npm test`, `npm run build`.

## ThemeToggleButton shape default (2026-07-16)

- Feature 내부 `shape="rounded"`. size 기본 border-radius(large=8px)가 적용됨.
- 과거: Icon `.primary { border-radius: 0 }`이 rounded를 무시해 square처럼 보임 → primary는 표면만 비우고 모서리는 size/shape에 맡김.
- 검증: `npm run typecheck`, `npm test`.

## ThemeToggleButton props 제거 (2026-07-16)

- Feature는 size/shape를 외부에서 받지 않음. `large` + `rounded` 내부 고정.
- `ThemeToggleButtonProps` 삭제. 사용: `<ThemeToggleButton />`만.

## SegmentedButton stretch fills segments (2026-07-16)

- `Box width=stretch`만으로는 바깥만 늘어남. 세그먼트는 `flex: 0 0 auto`라 hug 유지.
- `width=stretch`일 때 `.stretch .segment` / 내부 TextButton을 `flex: 1 1 0`으로 균등 분할.

## FieldCard fixed typography (2026-07-16)

- FieldCard/ContactFieldCard의 반응형은 카드 레일이 다음 줄로 wrap되는 의미다.
- `FieldCard` 내부 label/value는 viewport 폭에 따라 변하면 안 되므로 `vw` 기반 clamp를 제거하고 `--font-scale`만 반영하는 고정 px 기반 크기로 둔다.
- 검증: `npm run typecheck`, `npm test`.

## Shared shape token (2026-07-16)

- boolean형 둥근 여부 prop은 square/rounded/full 세 상태를 표현하지 못하므로 제거한다.
- 캡슐형과 원형은 컴포넌트 비율에 따른 결과 이름이라 공통 prop 값으로 쓰지 않는다.
- 공통 축은 `shape`, 값은 `square | rounded | full`로 둔다. `full`은 Text/Chip에서는 캡슐형, Icon에서는 원형이 된다.
- 검증: `npm run typecheck`, `npm test`, `npm run build`.

## CursorRing and ProjectCard layering (2026-07-16)

- `CardCursor`는 카드 전용 의미가 강해 `CursorRing`으로 변경한다.
- 실제 감지 기준은 `data-cursor-ring`이며, React 사용부가 명확하도록 `CursorRing.Target` wrapper도 제공한다.
- `FlipCard`는 CursorRing 책임을 갖지 않는다. CursorRing이 필요한 조합에서 `CursorRing.Target`이 `FlipCard`를 감싼다.
- `ProjectCardView`는 project 데이터를 받아 앞면/뒷면 UI와 `FlipCard` 조합만 렌더링한다.
- `ProjectCard`는 search store, analytics, responsive, popup, flip store 정책을 연결하는 Feature로 둔다.
- 검증: `npm run typecheck`, `npm test`, `npm run build`.

## Shape docs update (2026-07-16)

- 현재 시각 토큰 축은 `variant` / `size` / `opacity` / `shape` / `width`다.
- 문서의 checklist와 token 예시는 현재 축인 `shape`/`width`로 표기한다.
- 모서리 형태 token 상수명은 현재 `DESIGN_SHAPES`다.
- 검증: `npm run typecheck`, `npm test`.

## 시작 시점

- 기준 문서: `docs/디자인시스템_리팩토링_현황.md`
- Wave 0~2 완료. Wave 3부터 진행.

## 결정 로그

### Wave 3~5
(이전 세션 완료)

### SSOT / TSX 잔재 정리 (후속)
- JSX/JS dual-path 전부 삭제. glob은 `.tsx`/`.ts`만. `withAltExtension` 삭제.
- `DATA_FILE` 상수로 파일명 관리. `lng` → `lang` (i18next 옵션 `lng`만 예외).
- Shared 컴포넌트에서 `className`/`...rest` 제거. 외관은 variant(SSOT), 배치만 부모 `*Slot` 래퍼.
- IconButton variants: `default | ghost | circle | outlined`.
- Alias: `@hooks` `@utils` `@stores` `@versioning` `@models` `@repositories` `@data`.
- 섹션 hooks를 `experience/hooks`, `main/hooks`, `projects/hooks`로 이동.
### Inline style 제거
- JSX `style={}` 전부 제거.
- 정적 값 → CSS module (`heroStack`, `listColumn`, `historyColumn`, `experienceStack`, `placeholderCursorOn`, `svgFill`).
- 동적 CSS 변수 → `setCssVars` / `useCssVars` 또는 훅 내부 `setProperty`.
- 스크롤 페이드의 `el.style.opacity|transform`만 임피러티브로 유지 (프레임마다 변경, 필수).

### 폴더 구조 정리 (2026-07-14)
- 미사용 `structure/`(Column/Row/Stack), 빈 `src/locales/` 삭제.
- `src/common` → `src/site` (포트폴리오 셸+섹션). `App.tsx` → `PortfolioShell.tsx`로 루트 라우터 App과 구분.
- `CardCursor`/`SettingsPopup` → `components/layout/` (앱 크롬·레이아웃 전용).
- `useDocs` → `site/sections/docs/` (섹션 co-location 규칙에 맞춤).
- `src/hooks/`는 앱 전역 훅만 유지.

### Version 레이어 일관화 (2026-07-14)
- `versioning/utils/` — loadData / loadSection / loadIntroLinks + paths. JSDoc은 util 함수에만.
- `files.ts` / `globs.ts`는 util이 아님 (상수·Vite glob 맵).
- `versioning/providers/` — Provider, `useVersion({ hash })`만, bridges, VersionAppEntry.
- repository: `load({ lang, hash })`. Education/Skills도 data hook으로 통일.

### parse util (2026-07-14)
- `src/utils/parse.ts`: `isRecord` / `parseRecord` / `parseArray`.
- 인라인 `typeof === 'object' && !Array.isArray` 금지 대신 parse* 사용.
- 도메인 AST 분기(`parseQuery` and/or)는 그대로 둠.

### Config soft fallback 제거 + zoom hint persist (2026-07-14)
- config 누락은 silent fallback 대신 throw (getMaxVisibleChips, useResponsive).
- store 값 `??` 이중 기본값 제거 (Nav/MainPano/Contact/useApp) — 초기값은 configStore/SSOT.
- zoom hint: `useZoomHintStore` + zustand persist(`sessionStorage`), `shownThisSession` partialize.
- `zoomDetection`는 감지만, 세션 플래그는 store.
- version loader soft merge/replace는 설계상 유지.

### Dead code 정리 (2026-07-14)
- 삭제: `useDebouncedNormalizedQuery.ts`, `public/assets/styles/global.css`, JetBrains Mono, icons `blog`/`expand`/`pointer`.
- 내부 전용 심볼 `export` 제거, 중복 `export default` 제거 (named만 유지).
- `config` named re-export는 `projectCard`만, `@versioning` barrel에서 `loadIntroLinks`/타입 재export 제거.
- `projectCard.module.css` dead classes + `tagsMarquee` 제거.
- optional 콜백: `typeof === 'function'` → `?.` / `??`.

### utils 도메인 분리 (2026-07-14)
- `src/analytics/` (`@analytics`) — track / siteView / searchMeta.
- `docs/getDocById`, `projects/getMaxVisibleChips`, `projects/utils/textWrap`, `hooks/zoomDetection`.
- `src/utils/` 잔여: `parse`, `cssUtil`, `dateFormat`, `inlineSvg`만.

### 과한 코드 단순화 (2026-07-14)
- `useAnalytics` useCallback 복붙 → send/trackById
- `useIntroLinkPopover` useCallback 제거, `useExperienceLongPress` 이중 커링 제거
- Contact/`useCopyFeedback`/StatusChip/`projectStatus`/`SearchPlaceholder`/dateFormat/inlineSvg 정리
- store·query 쪽 불필요 parseString 제거 (이미 string 타입)
- IntroLinksContext/useApp 이중 useMemo 제거

### 역할 중복·훅 정리 (2026-07-14)
- `useVersionedLoad` — projects/experience/education/skills/docs 데이터 로드 통합
- `viewportFade` (`fadeOpacity` + `useScrollEffect`) — projects/docs/education 스크롤 페이드
- `focusIdStore` — docs/experience 포커스 핸드오프 (`idToFocus`) 한 파일
- 얇은 훅 제거: `useZoomDetection`(→useApp), `useTooltipPosition`/`useCssVars` hook(→Nav+setCssVars), `useCopyFeedback`(→Contact)
- `useExperienceScroll` → fade(`useExperienceCardFade`) + snap(`useExperienceSnap`) 분리
- `ProjectDetailContent` 섹션/링크 헬퍼 → `projectDetailSections.tsx`

### Nav 상수 정리 (2026-07-14)
- `SCROLL_MS` 제거 → `config.animation.nav.clickScrollMs` 사용 (`speedScale`로 나눔)
- `TOOLTIP_GAP` 제거 → `nav.module.css`의 `--nav-tooltip-gap` + `calc(top + gap)`

### Config / 토큰 SSOT (2026-07-14)
- `config.animation.*` → `:root` CSS vars (`--anim-*`)로 주입, pano/card/modal 하드코딩 제거
- `ui.skillsChipBorderRadius` 삭제 (실사용 없음, skills chip은 em 기반)
- typo/speed min·max·step → `config.ts` export, store/Settings/stagedReveal 공유
- intro popover gap/max-width/pad → CSS vars, JS는 getComputedStyle로 읽음
- narrow/zoom `768` → `breakpoints.widths[0]`(860)과 통일

### Components 갤러리 (2026-07-14)
- `/components` → shared/layout 쇼케이스 (2Ryuk 패턴 축소). production 노출.
- Nav/Modal/Settings는 항상 마운트하지 않고 「열기」로 트리거.
- Preview 치수 라벨 + parent/child relations 포함.
- TOC active: `offsetTop` → `getBoundingClientRect` (문서 스크롤과 SSOT)

### Skills 아이콘 (2026-07-14)
- 깨짐 원인: `SkillModel`이 `/assets/icons` (public, 없음)을 `<img>`로 요청.
- 실제 파일은 `src/assets/icons` → `Icon` + `iconName`으로 통일.

### T \| null \| undefined 정리 (2026-07-14)
- 부재는 하나만: 상태 clear → `T | null`, 옵션 필드 → `?: T`. 둘 섞지 않음.
- `setFlippedProjectId(id: string | null)` 등 `?? null` 이중 처리 제거.

### 접근성 일관화 (2026-07-14)
- `useA11y` 유지. SR 문자열은 `a11y.*`만 (`components` 갤러리 TOC/탭/액션 포함).
- `Icon`/`SvgIcon`: `alt` 있으면 의미, 없으면 장식. 죽은 `aria-hidden` prop 제거.
- 부모 `aria-label`이 카드/버튼을 설명하면 안쪽 썸네일·아이콘은 장식.
- 카드는 내부 Chip 때문에 `<button>` 불가 → `onActivateKeyDown`(Enter/Space)으로 통일.

### Docs 포커스/칩 네비 가독성 (2026-07-14)
- `Docs.tsx`의 포커스 `useEffect`·칩 클릭을 `docs/docsNav.ts`로 분리.
- `findCategoryForDoc` / `expandOnly` / `hasAnyDocs` / `scrollToId` / `navigateFromDocSource`.
- `DocSource`는 `getDocById.ts`에 두고 `DocItem.source`에 연결 (캐스트 제거).
- effect 흐름: id 없으면 return → 카테고리 없음+로드됨이면 clear → 있으면 expand·clear·scroll.

### a11y writeup 서사 정리 (2026-07-15)
- `docs/a11y-writeup/01`: 사용부+구현부, 「새 맥락」, 암호성 한줄 bullet 제거.
- `02`: 에셋 SVG에 고정 `<title>` 없음 / 단독만 런타임 `title={alt}` / 버튼 안은 부모 이름.
- `index`: 용어집 SVG title 설명을 에셋≠런타임으로 맞춤. 네비 카드 문구 동기화.

### a11y writeup 문장 톤 (2026-07-15)
- 「호출부 / 업무 prop / 유도형 / 강제형」 등 내부 용어를 일반 문장으로 바꿈.
- 배지: 알아서 / 필수. 라벨: 컴포넌트 안 / 쓸 때. 효과 → 그래서.
- 핵심 원칙을 「시맨틱 태그 → 맥락 판단 가능 시 자동 → 불가 시 개발자 입력 강제」로 재작성.

### Chip 레이어 분리 (2026-07-15)
- `Chip`: span 디자인 only (`size` / `primary|secondary`, `Chip.Primary`/`Secondary`).
- `ChipButton`: `<button><Chip /></button>` (IconButton 패턴). 스택 검색칩이 여기.
- `StatusChip`: `type` → i18n + Primary/Secondary. shared Chip 뿌리. projects는 re-export.
- `highlighted` 제거 → 매칭 시 `ChipButton.Primary`.
- 갤러리: 구조 다이어그램 + chip / chip-button / status-chip 섹션. relation은 Link+Chip.

### TextButton / clickable / 갤러리 매트릭스 (2026-07-15)
- `Button` → `TextButton` (`primary|secondary|outline|ghost` + `TextButton.Primary` 등). size만 pad/min-height, outline은 inset shadow.
- 전역 `.clickable`: press 시 `scale(0.96)`. TextButton/IconButton/ChipButton/SegmentedButton에 적용.
- IconButton: default≠ghost, circle이 size를 덮지 않음. 갤러리 variant×size 라벨.
- TextButton 갤러리: size × variant × (텍스트 / 아이콘+텍스트 / disabled 동일 size).
- Shared/Layout 탭 = `TabNavigation`(NavLink). 버튼 가계 아님 (2Ryuk와 동일).

### 디자인 / 인터랙션 엄격 분리 (2026-07-15)
- 디자인만 variant: Icon / Text / Chip — 공통 `primary|secondary|outlined` (`surface.module.css`).
  - primary: 투명 배경 + 전경(--color-text)
  - secondary: 전경색 배경 + inverse 글자
  - outlined: 투명 + inset 1px (크기 불변)
- XXButton = `<button class="clickable">` + aria/onClick + 디자인 drill. 자체 스타일 없음.
- StatusChip: type → Chip variant (live 계열 secondary, ended outlined).
- 구 IconButton `ghost|circle|default` 제거. Nav circle → `secondary` + `shape="full"`.

### Icon 깨짐 수정 (2026-07-15)
- 원인: `.shell { color: inherit }`가 import 순서로 `surface.secondary`를 덮어 흰 배경+흰 아이콘.
- Chip/Text 안 Icon에 `embedded` (1em·부모 color) — 셸 size가 칩 레이아웃을 깨지 않게.
- SliderControl ± → `IconButton` (`minus`/`plus` 아이콘). raw `<button>` 제거.
- SegmentedButton 옵션 → `TextButton` + `pressed`.
- catalog `children`이 실제 compose 관계. 구조 다이어그램에 전 컴포넌트 + `uses …` 표시.

### 갤러리 description 제거 (2026-07-15)
- 섹션 hint / structureLead / name catalog / node deps·layer 문구 전부 삭제. 제목+프리뷰만.
- 미사용 `.sectionHint` / `.blockTitle` / `.structureLead` / `.structureDeps` / `.structureLayer` CSS 제거.
- shared 파일 헤더·JSDoc의 강의식 한 줄(「aria만」/「디자인은 X」)도 역할만 남기도록 짧게.

### TabNavigation → TextButton (2026-07-15)
- Shared/Layout 탭이 NavLink+`.tab` 커스텀 버튼처럼 보여 SSOT 깨짐.
- `TextButton` + `navigate`로 교체 (선택=secondary, 비선택=primary). SegmentedButton과 동일.
- `.tab` / `.tabActive` CSS 삭제. 컨테이너 `.tabs`만 유지.

### 구조 다이어그램 분기·화살표 (2026-07-15)
- linear `Track` 제거. catalog `children` SSOT 기준으로 재배치.
- 화살표 4종: wrap(→) design→*Button, embed(↦) Icon→Text/Chip, compose(↳) 사용, context(⤷) Chip→StatusChip.
- Icon→IconButton→(SliderControl|Modal) 분기. SegmentedButton은 TextButton 체인만. Chip→(ChipButton|StatusChip) 병렬.
- Layout: Heading/CardCursor 단독. Nav→(Icon|IconButton|SettingsPopup→하위 4개) 중첩 fork.

### Tag / opacity / Stack·SkillChip (2026-07-15)
- 갤러리: Icons(에셋 목록) → Icon(variant×size) 분리. Card는 Icon 뒤.
- `DESIGN_OPACITIES`: hidden|faint|muted|soft|full (=0/25/50/75/100). Icon/Text/Chip 공통. 임의 % 금지.
- Tag = Text(#{name}, size small, opacity soft). TagButton = button+Tag, hover underline만.
- StackChipButton / SkillChipButton: size small 고정, outlined → hover secondary. matched 시 secondary 고정.
- ProjectCard/Detail → TagButton+StackChipButton. Skills → SkillChipButton (구 skills/Tag 삭제).

### 구조 다이어그램 tier row (2026-07-15)
- tier 라벨을 행 중앙 위가 아니라 각 row 좌측에 두고, row별 음영(`structureRowTier0|1|2`).
- 괄호 사족 제거. row 간격 88px로 화살표 가독성 확보.

### Icon 갤러리 variant/opacity 레이아웃 (2026-07-15)
- `variant` / `opacity` 축 라벨 표시.
- variant×size 좌측, opacity는 가로 1행으로 우측 배치 (`matrixSplit`) — 세로 낭비 제거.

### Chip small / Tag underline / hoverable shade (2026-07-15)
- Chip small: font 0.72em으로 축소. em 패딩은 같이 줄어 비율이 안 풀려 padding은 rem 고정.
- Tag `underline?` prop. TagButton은 underline=false 고정, hover 시 underline.
- Stack/SkillChipButton: React hover state 제거 → CSS outlined→secondary transition (ease-in-out).
- `.hoverable`/`.clickable` ::after 동일 크기 음영, `--hover-duration`으로 서서히 (2Ryuk).

### SegmentedButton clip (2026-07-15)
- Text/TextButton `shape`: `rounded`(기본) | `square`(0) | `full`.
- SegmentedButton 안쪽 TextButton은 `shape="square"` 고정. `.segmentRow`가 모서리 클리핑을 담당.
- TextButton `className` 누락 버그도 함께 수정.

### 구조 다이어그램 Modal/Nav 프리뷰 (2026-07-15)
- SettingsButton/CloseButton 컴포넌트는 없음. Nav=IconButton(settings, secondary, shape="full"), Modal=IconButton(close, primary).
- 다이어그램 프리뷰가 secondary close 등으로 따로 쓰이는 것처럼 보여서 실사용과 맞춤.

### Header → Heading rename (2026-07-15)
- 섹션 `<h2>` 컴포넌트명을 `Header` → `Heading`으로 변경. chrome Header(nav 등)와 혼동 제거.
- `Text size="shrink"` / Text를 Heading으로 확장하지 않음. Chip·Heading은 별 컴포넌트 유지.
- 섹션 래퍼 CSS(`*HeaderBlock` 등)·프로젝트 본문 "Header Nav"는 영역/콘텐츠 의미라 미변경.

### Settings Theme/Language stretch (2026-07-15)
- 원인: `.section` flex column 기본 `align-items:stretch`로 자식이 가로로 늘어남.
- Theme: `controlHug`(fit-content)로 IconButton만 감싸 버튼 크기 유지. stretch 시 hover `::after`가 전체 폭 바와이 됨.
- Language: `controlStretch` + SegmentedButton을 `width:100%` flex로. 세그먼트 `flex:1 1 0`, 안쪽 Text가 너비 채움.

### SettingsButton / GotoButton / Text plain+underline (2026-07-15)
- SettingsButton(layout) = IconButton(settings, secondary, shape="full", large) 시맨틱 래퍼. Nav는 IconButton을 settings용으로 직접 쓰지 않음.
- GotoButton(shared) = plain+underline Text + angle-right Icon. hover 색 진해짐·chevron translateX는 GotoButton CSS만.
- GotoProjects(experience) = 검색 쿼리 + #project 스크롤 의미. ExperienceCard의 raw a/CSS 제거.
- Text tone: surface(기본, 기존) | plain(패딩·surface 없음, color inherit). underline은 plain과 세트로 링크 톤에 사용.
- hash 링크(`#project`)는 RR Link 대신 native `<a>` (resolveActionable의 내부 Link 경로 회피).

### Components 탭 Structure / Shared / Layout (2026-07-15)
- 구조 다이어그램을 상단 고정에서 분리. 탭 순서 Structure → Shared → Layout.
- `/components` 기본 진입 = `/components/structure`.

### ControlSlider + Speed/FontScale/Column (2026-07-15)
- SliderControl 삭제 → ControlSlider rename. tier 1. size(DesignSize)로 IconButton·트랙·thumb·gap 스케일.
- 사용 완성형 3개 동일 패턴. SpeedControlSlider / FontScaleControlSlider (configStore 바인딩) / ColumnControlSlider (bounds+value는 부모, a11y·legend 소유).
- Settings·Projects는 ControlSlider 직접 사용 금지. Projects 외곽 fieldset/CSS 슬라이더 오버레이 제거 → slot 래퍼.

### SettingsButton 완성형 (2026-07-15)
- SettingsButton = IconButton(settings, secondary, shape="full", large) + SettingsPopup 열기. onClick props 제거.
- Nav는 SettingsButton만 두고 팝업 상태를 소유하지 않음. catalog: settings-button→(icon-button, settings-popup), nav→settings-button.

### Nav/SettingsPopup 갤러리 제외 + NavButton (2026-07-15)
- 갤러리/구조도에서 Nav·SettingsPopup 노드 삭제 (셸이지 디자인 원자/사용 컴포넌트 아님).
- NavButton = TextButton.Primary + `href` (+ optional label / `iconName`). react-scroll Link 제거, `#section` native `<a>`.
- Text `font-weight` 600→200 (기존 navbar Education 톤과 맞춤. 600이 잘못됨).
- hash 스크롤: `html { scroll-behavior: smooth }`.
- 구조 노드: 제목만 Link, preview는 div — range thumb 드래그 가능.

### Icon 정렬 깨짐 (2026-07-15)
- 증상: Docs 폴더/플랫폼, docChip(캡슐형), Contact 아이콘·복사, Intro rowPill 등에서 아이콘이 텍스트와 어긋남.
- 원인1: `Icon` shell에 `styles.primary`가 안 붙어 primary 크기 오버라이드(16/20/24)가 dead CSS. medium shell 36px가 14~24px 래퍼를 뚫음.
- 원인2: embedded가 1em 고정. 부모 px 박스를 안 채움. `[role=img]`로 SVG만 줄이면 glyph/shell 박스는 그대로.
- 원인3: Contact 복사는 icon-only TextButton(패딩·min-height)이라 코너가 깨짐 → IconButton.
- Docs docChip / project sectionSearchChip / Intro rowPill = 로컬 캡슐형 button. ChipButton·shape token 아님. doc 제목 underline = `a`+CSS. Text `tone=plain underline`은 GotoButton용(TextButton에 underline prop 없음).
- 수정: Icon에 `styles.primary` 적용. embedded=부모 100%. 사이즈 래퍼 Icon은 embedded. 복사는 IconButton.

### Gallery prop 축 라벨 + shape (2026-07-15)
- `DESIGN_SHAPES` (`square`|`rounded`|`full`) 추가. Icon/IconButton/Chip/ChipButton/Text/TextButton에 `shape` 공유.
- StatusChip은 `shape="full"` 고정.
- 갤러리: variant / size / opacity / shape / type / underline / align 등 prop 축에 `matrixGroupLabel` 표시.
- Icon·IconButton·Text·TextButton·Chip·ChipButton: shape. Chip/Text는 opacity. StatusChip type, Tag underline, RelationChip type, Modal size, Heading align.

### StackChipButton 카드↔갤러리 이질감 (2026-07-15)
- 동일 컴포넌트. 카드 `.languageLine`이 `--card-tags-font-size`(~10–13px cqw)를 물리고 Chip은 `font:inherit` + `0.22em` radius라 갤러리(16px) 대비 각지고 작아 보임.
- StackChipButton root에 `font-size: 1rem`으로 부모 축소 차단.

### NavButton pano icon 크기 (2026-07-15)
- Text `icon`(1em)라 pano가 가로 viewBox라 작아 보임. icon-only는 NavButton에서 `1.75em` 래퍼로 Icon 직접 렌더.

### Skill / Stack ChipButton hover 분리 (2026-07-15)
- Skill: `hoverable` 음영 + `translateY(-2px)`. outlined→secondary 제거. Skill 전용 CSS.
- Stack: outlined→secondary만. translate/`clickable` 없음 (음영+채움 중복이 카드에서 이상하게 느껴짐). Stack 전용 CSS.
- `matched` 마커 클래스를 CSS에 명시 (모듈 export) — hover secondary 억제.
- 카드 vs 갤러리: 동일 컴포넌트라도 카드는 갭·#태그 옆·아이콘 유무 혼재로 밀도가 달라 보임.

### ControlSlider 갤러리 (2026-07-15)
- size large/medium/small을 `sizeMatrix` 가로 3열로 배치.
- size별 독립 value state (`sliderBySize`) — 공유 state로 한 번에 움직이던 것 수정.

### Shared TOC 응집·indent·Heading (2026-07-15)
- `sharedTocGroups`: Icon / Text / Tag / Chip / Control / Modal / Card.
- Card는 Icon·IconButton 사이에서 분리해 맨 뒤 그룹.
- TOC에 그룹 Heading + depth(0/1/2) indent. 본문 섹션 순서도 동일.

### Design / Interactive / Composed (2026-07-15)
- Shared/Layout 폐기. 역할(layer) 폴더로 재편 + 갤러리 Role|Domain View 전환.
- design = 표면(variant/size/opacity). interactive = button/aria/onClick. composed = 맥락 래퍼·셸.
- Domain 탭: Icon / Text / Tag / Chip / Control / Modal / Card / Shell.
- catalog 엔트리에 layer+domain SSOT. showcase는 필터만.

### Primary Icon 크기 일관 (2026-07-15)
- primary도 size 셸(28/36/44)을 유지. 글리프만 채우던 축소 규칙 제거 — secondary/outlined와 hit/레이아웃 크기 동일.

### Shell 폐기 + domain 재배치 (2026-07-15)
- Shell 탭 제거. NavButton→Text, SettingsButton→Icon, Heading→Text, CardCursor→Card.
- Feature 분류는 Domain이 아니라 Role축(Composed의 상위/분할) 후보. store·popup 등 기능 바인딩 완성형에 적합.

### Feature layer (2026-07-15)
- Role: Design / Interactive / Composed / Feature.
- Interactive `ToggleIconButton` (pressed→variant). Feature `ThemeToggleButton` / `LanguageSegmentedButton`.
- SettingsButton·Speed/Font/Column·SettingsPopup → `components/feature/`. NavButton은 Composed 유지.
- SettingsPopup은 Theme/Language Feature를 조립만 함.

### Heading stretch + align (2026-07-16)
- alignLeft가 `margin-left:5vw`라 갤러리에서 정렬처럼 안 보임 → `text-align`만. width 100% 유지.
- 갤러리 `.col`이 flex-start라 fullWidth preview가 hug → `colStretch` + `variantCellFullWidth`.

### Chip size 스케일 (2026-07-16)
- small이 rem 패딩+`0.72em` 글자+`min-height` 혼합이라 뚱뚱하고, large는 em 패딩만이라 답답했음.
- S/M/L 모두 rem(+font-scale): 12/14/16px급, min-height 24/30/36px급. icon `1em`으로 동반.

### UI fill 아이콘 재설계 (2026-07-16)
- fill은 outline stroke를 채운 게 아니라 솔리드 글리프(+evenodd hole)로 새로 그림.
- 재작: copy, dir-open/close, document, sun, moon, search, settings, eye-open/off. viewBox 24, currentColor.

### dir-open/close outline↔fill 통일 (2026-07-16)
- outline은 Lucide 골격 단일 stroke 유지. fill은 같은 앵커(탭+열린 트레이)로 뒤판/앞판 솔리드. 뒤판 하단을 앞판 덮개선 아래까지 내려 삼각 구멍 제거.

### eye-open/off fill 깨짐 (2026-07-16)
- 원인: fill eye-off가 조각난 path 여러 개(불완전한 evenodd)라 픽셀·찌그러져 보임.
- 수정: outline 렌즈+동공 비율 유지. fill=눈꺼풀 솔리드+동공 구멍, eye-off는 같은 골격+대각 슬래시.

### LogoIcons 분리 (2026-07-16)
- `pano`를 Brand에서 제거 → `assets/icons/logo/` + `LogoIcons`. 갤러리 LogoIcons 섹션. Icon 해석: ui → logo → brand.

### ContactFieldCard wraps Design Card (2026-07-15)
- 누락: domain=Card인데 로컬 CSS로 표면 재구현 + 구조도 children에 card 없음.
- 수정: Design `Card` wrap + catalog/edge(`card`→`contact-field-card`). Card에 optional `className`.

### clickable wide press (2026-07-15)
- 증상: GotoButton stretch 등 가로로 긴 `.clickable`이 active `scale(0.96)` 때문에 양옆이 과하게 줄어 눌림이 작아 보임.
- 수정: `[data-width=stretch]` / `.clickableWide`는 scale 없음(음영만). GotoButton에 `data-width`, SegmentedButton 세그먼트에 `clickableWide`.

### SearchField clear = IconButton glyph (2026-07-15)
- docs/a11y-writeup/03: 보이는 크기 유지 + 터치만 확장.
- IconButton `glyph`: Icon embedded(부모 슬롯), ::before 44px hit. SearchField clear에 적용.

### IconButton 음영 ≠ 히트 (2026-07-16)
- docs/a11y-writeup/03: 보이는 크기(border/음영) 유지, 터치만 44px.
- 오해 수정: ::after 음영을 44px로 키우면 안 됨. 음영=`inset:0`(셸), 히트=`::before` 44px.

### Gallery Composed vs Feature demo (2026-07-15)
- Feature 위에는 실제 값(제품 store/프리셋). Composed만 있을 때는 실사용 값 OK.
- Feature가 있는 Composed/Interactive 데모는 mock으로 구분 (SearchChipButton=`Mock Project`, SearchShortcut=`extify`, SegmentedButton=`Option A/B` vs LanguageSegmentedButton=실언어).

### Icons / BrandIcons 분리 (2026-07-16)
- `assets/icons/ui` + `Icons` (email/tel 포함). `assets/icons/brand` + `BrandIcons` (github/notion/linkedin/redis/react…).
- Icon glob 양쪽 조회. 갤러리 Icons / BrandIcons 섹션 분리.

### LogoIcons 분리 (2026-07-16)
- `pano`를 Brand에서 제거 → `assets/icons/logo/` + `LogoIcons`. 갤러리 LogoIcons 섹션. Icon 해석: ui → logo → brand.

### UI outline/fill 통일성 보정 (2026-07-16)
- 규칙: (1) 면 있는 글리프 = 같은 path/앵커로 fill만. (2) 선-only(search·link·angle·check…) = outline SVG 그대로 fill에 복사. (3) 가능하면 fill을 outline stroke 복제로 때우지 않음 (eye 실수).
- copy: 앞장/뒷장 사이 ~1.5 흰 간격 L peek.
- dir-open: 뒤판·앞 트레이 사이 흰 틈.
- settings/moon/pointer: outline과 동일 path. moon/pointer는 fill+stroke(1.5)로 외곽 크기 맞춤.
- eye-open/off: 렌즈 솔리드 + 동공 evenodd 구멍(+ off 슬래시). 선 복제 아님.

### clickable / hoverable 분리 (2026-07-16)
- `.hoverable`=::after 음영만, `.clickable`=:active scale만. `pressFeedbackClass('press'|'shade'|'press-shade')`.
- Goto=`press`(clickable만). Nav=`feedback="press"`. Text/Chip/Icon/Tag=`press-shade`. Skill=`hoverable`. Stack=자체 hover. stretch/clickableWide는 scale만 끔.

### cpp.svg 글리프 묻힘 (2026-07-16)
- 원인: 육각형 면이 solid currentColor라 C/++가 같은 색에 흡수 → 검은 육각형만 보임.
- 수정: 외곽 stroke + C/++ stroke. BrandIcons 분류 이슈 아님.

### Gallery grouped layout (2026-07-16)
- TOC complement 축 그룹 헤딩 유지.
- 카드: 기본 `width: fit-content` + flex-wrap로 작은 단일 프리뷰 카드(테마/정렬/복사/설정 등)가 나란히 쌓임. `fullWidth`만 행 전체.
- 과거 높이 편차 때문에 단일 열만 쓰다 공간 낭비 → compact 카드만 wrap.

### FlipCard gallery demo (2026-07-16)
- FieldCard+TypedExternalLink 조합 데모 제거. front/back에 Text만 넣는 최소 예시만 유지.

### SettingsPopup → SettingsModal (2026-07-16)
- 이름만 Popup이었고 내부는 이미 `Modal`. `SettingsModal`로 리네임.
- 갤러리: layer=Feature, domain=Modal. `SettingsButton`은 Icon Feature + Modal 열기.
- ProjectDetailPopup / ExperienceDetailPopup은 후속 논의 (섹션 로컬·모델 의존).

### Gallery hover code tooltip (2026-07-16)
- 크기 툴팁(우상단) 유지. 코드는 별도 `.codeLabel`(좌하단) — 좁은 아이콘 셀에서 겹침 방지.
- children 자동 직렬화 안 함. 각 Preview/PropCell에 명시 `code` 문자열.
- `card-cursor`만 Preview 미사용이라 제외.
- 코드 툴팁: ellipsis 금지. `formatUsageCode`로 props 세로 펼침. **body portal + position:fixed + z-index 10000** — 섹션 아래 카드에 가려져 투명처럼 보이던 스택 이슈 해소. 배경 `#000`/`#fff`, 흰 border, shadow 없음.
- grayscale syntax highlight: `tokenizeUsageCode` → tag(`#fff`) / attr(`#9a9a9a`) / equal(`#5c5c5c`) / value(`#d4d4d4`). 라이트는 반전.
- 고정폭 안 보이던 원인: `global.css`의 `* { font-family: Neue Haas }`가 툴팁 span을 덮어씀 → `.codeLabel * { font-family: inherit }`.

### Structure diagram edge hover (2026-07-16)
- 평소: 화살표 dim(~0.1 opacity, 살짝만 보임). 노드 hover: 연결된 간선만 밝게(거의 흰).
- 이전: idle에서도 `related=true`라 전부 밝았음 → 조건에서 `!hoveredId` 제거.

### CopyIconButton a11y 소유 (2026-07-16)
- Feature 원칙: `ariaLabel`/`copiedAriaLabel` 외부 주입 제거. 내부 `useA11y` — 기본 `common.copy`/`common.copied`, 문맥 `label` 있으면 `contact.copy`/`contact.copied`.
- 사용: `<CopyIconButton text="..." />` 또는 ContactFieldCard는 `label={필드명}`만 전달.

### SegmentedButton usage tooltip state (2026-07-16)
- `ComponentPreview`는 `code` prop 변경 시 토큰을 다시 만들고 `<pre>`로 줄바꿈을 보존한다. 공용 포맷터는 건드리지 않는다.
- `SegmentedButton` 데모는 옵션 상수를 렌더링과 usage 코드 생성에 같이 써서 표시 버튼과 코드 예시가 같은 데이터를 보게 한다.
- 선택값은 `formatSegmentedButtonCode(segment)`로 표시해 `Option B` 선택 시 usage 코드도 `value="b"`로 바뀐다.

### Stateful usage tooltip audit (2026-07-16)
- `ToggleIconButton`, `CycleIconButton`, `SearchField`, `ColumnControlSlider`는 모두 부모 state를 받는 controlled 데모다. 안 바뀐 것은 컴포넌트 상태 문제가 아니라 `ComponentPreview code` 문자열이 고정이었기 때문이다.
- 바뀌던 예시는 `Icon kind`, `ControlSlider`, `SegmentedButton`처럼 `code` prop 자체에 현재 state를 넣고 있었다.
- `ComponentPreview`는 children props를 자동 직렬화하지 않는다. 상호작용 데모는 상태와 usage 문자열을 같은 상수/헬퍼에서 생성해야 한다.

### Usage tooltip placeholder removal (2026-07-16)
- hover tooltip에서 `[...]`, `{...}`, `...` placeholder는 금지한다. 옵션은 실제 배열 항목을 표시하고, 함수 props는 `handleChange`/`handleClose` 같은 이름으로 표시한다.
- 구현 코드의 object spread/array spread는 실제 로직이므로 이 규칙 대상이 아니다. `ComponentPreview code` 문자열만 대상이다.

### Layout width variants for controls (2026-07-16)
- width는 action이 아니라 layout 축이다. 기존 `LayoutWidth = 'hug' | 'stretch'`에 `LayoutWidthProps`만 추가해서 각 control이 같은 prop 이름을 공유하게 한다.
- CSS 구현은 각 컴포넌트 module에 둔다. 같은 `width` 의미라도 SegmentedButton과 ControlSlider의 내부 flex 구조가 다르기 때문이다.
- 갤러리에서는 control wrapper들이 `hug`/`stretch`를 모두 보여줘야 폭 기본값과 실제 feature 사용 폭을 비교할 수 있다.

### Box and Stack layout primitives (2026-07-16)
- `Box`는 layout width 해석을 소유한다. 기존 컴포넌트 public API의 `width` prop은 유지하되 내부 구현은 `Box`로 위임한다.
- `Stack`은 아직 Card/Modal 배치까지 먹지 않고 direction/gap/align/justify/wrap만 담당한다. placement/height/distribution은 실제 Card 적용 시 추가한다.
- layout primitive는 시각적 surface를 만들지 않는다. Card는 surface, Box/Stack은 배치만 담당한다.

### Layout primitive className removal (2026-07-16)
- `docs/컴포넌트_설계철학.md` 원칙상 컴포넌트는 임의 `className`을 prop으로 받지 않는다. `Box`/`Stack`도 예외가 아니다.
- layout primitive 확장은 `width`, `direction`, `gap`, `align`, `justify`, `wrap` 같은 토큰 prop으로만 한다. 부모 CSS가 필요하면 부모가 자기 wrapper를 소유한다.

### Layout gallery role (2026-07-16)
- `Box`/`Stack`은 보이지 않는 배치 primitive라 design/interactive/composed/feature 어느 곳에도 정확히 속하지 않는다. `layout` layer/domain으로 별도 분류한다.
- `Card`는 surface라 design/card에 남긴다. 내부 배치가 필요할 때 Box/Stack을 조합하거나 위임한다.
- 갤러리 Layout 탭은 Box/Stack의 토큰 prop 케이스를 모아서 layout 규칙을 확인하는 장소로 쓴다.

### Usage code children preservation (2026-07-16)
- `formatUsageCode`는 self-closing/prop-only JSX만 props 세로 펼침 대상으로 본다.
- `<Stack>...</Stack>`처럼 children이 있는 JSX는 원문을 보존해야 tooltip에서 `<Card>A</Card>` 등 children이 잘리지 않는다.

### Box and Stack design philosophy docs (2026-07-16)
- `docs/컴포넌트_설계철학.md`에 Layout primitive 원칙을 별도 섹션으로 추가한다.
- Box는 단일 박스의 size 축, Stack은 여러 자식의 direction/gap/align/justify/wrap 축을 담당한다.
- Card는 surface라 Design에 남고, layout이 필요하면 Box/Stack을 내부에서 위임한다. Layout primitive도 className prop을 받지 않는다.

### StackChipButton hover 검정 묻힘 (2026-07-16)
- 원인: hover bg/color를 래퍼 span에만 적용. Chip.Outlined는 투명+`color-text`라 검정 위 검정.
- 수정: `.chip > *`(Chip 표면)에 secondary 동일 스타일 적용.

### SettingsModal gallery embedded (2026-07-16)
- 갤러리는 Open 버튼이 아니라 `SettingsModal embedded`로 패널 자체를 인라인 표시.
- `Modal.embedded`: 오버레이/포커스 트랩/스크롤락 없이 패널만.

### Experience/Project SlotCard + Feature (2026-07-16)
- Composed: `ExperienceSlotCard` / `ProjectSlotCard` — ReactNode 슬롯만. 모델·store 없음.
- Feature: `ExperienceCard` / `ProjectCard` — 모델 1개 → 슬롯 매핑 (+ 검색/분석/모달 정책은 Project만).
- `ProjectCardView` 제거. 섹션 `ExperienceCard`는 Feature re-export.
- 갤러리 Slot 데모는 Acme Labs / Slot Demo App (가짜). Feature는 boostcamp / PS Studio 실데이터. 서로 동일하게 두지 않음.

### /responsive guide page (2026-07-16)
- Components 카탈로그와 분리. 원칙 전시관: Hero → Pipeline → Live lab → Behavior → Source.
- Live lab은 창 리사이즈 대신 ControlSlider로 미니 프레임 폭을 바꿔 `data-breakpoint` → CSS 변수 → 카드 폭을 보여준다. 판별 로직은 `config.breakpoints`와 동일.
- Design System(색) 페이지는 보류. guides 셸만 두고 라우트는 `/responsive`.

### /responsive rewrite (2026-07-16)
- Source map / Behavior 섹션 / 가짜 mini-viewport 슬라이더 제거.
- 한 줄기: 실제 window width → config 구간 → useResponsive type → data-breakpoint → CSS --card-width → 카드 폭 변화.
- 창을 직접 리사이즈해야 값이 바뀐다. 스니펫은 한 줄·pre-wrap, 스크롤 없음.

### Pano line SVG (2026-07-17)
- `pano-line-{mobile,tablet,desktop,wide}.svg` 가 정식 에셋. config 860/1240/1700 정렬.
- 크기: mobile 720, tablet 1100, desktop 1600, wide 2200 × height 702.
- `pano-line-bp-*.svg` 테스트 이름은 제거하고 기존 파일명으로 완전 대체.
- Experience + `/responsive` 가이드 모두 동일 파일 사용. Main `pano.svg` 스프라이트는 별개.

### /responsive layout (2026-07-17)
- Viewport 왼쪽 메인, CSS/TS 오른쪽 사이드 스택. 한 화면에 조작+코드 동시 확인.
- 좁은 폭(≤960)에서는 Viewport → CSS → TS 세로 스택.

### useResponsive isWide (2026-07-17)
- `isDesktop` / `isWide` 분리. 각각 `type === 'desktop' | 'wide'` (서로 배타).
- 기존 `isDesktop`이 wide를 포함하던 동작은 제거. 호출처는 isMobile 위주라 영향 없음.

### /responsive principle page (2026-07-17)
- 상단 원칙: SSOT=config.breakpoints / CSS=보이는 것 / TS=하는 것
- 예시 Segmented: Pano·Contact = CSS만, Touch·Columns = TS만 (한쪽 패널만)
- CSS 예시는 config 숫자 @media. TS 예시는 useResponsive 동작 분기

### useResponsive 책임 분리 (2026-07-17)
- `projectsGridBounds`는 Projects 전용이라 범용 훅에서 제거.
- `useResponsive`는 width/type/is* 만 반환.
- `useProjectsGrid`가 내부에서 `useResponsive` + `config.breakpoints.projectsGrid[type]`을 조회. 호출처는 `useProjectsGrid()`만.
- 가이드 Columns 스니펫도 동일 패턴으로 맞춤.

### FlipCard mobile click (2026-07-17)
- mobile은 controlled(`flipped`/`onFlippedChange`) → click flip. desktop은 uncontrolled → CSS hover.
- hover CSS를 `@media`가 아니라 `data-flip-mode='hover'`에 묶음. 가이드 논리 mobile + 실제 넓은 창에서도 hover가 새지 않음.

### ProjectCard flip 리렌더 (2026-07-17)
- 원인: 모든 카드가 `flippedProjectId` 문자열을 구독 → flip 1회에 N장 전부 리렌더 + 각 카드 back의 `ProjectDetailContent` 재실행.
- 수정: `s.flippedProjectId === projectId` boolean만 구독. 상태가 바뀌는 카드(최대 2장)만 리렌더.

### useProjectsGrid rowsStyle (2026-07-17)
- ~~훅이 `rowsStyle` 반환~~ → 철회. 훅은 `columns`/`gap` 값만, 컴포넌트가 `const style = {} as CSSProperties` 조립.

### style={style} / CSS var 원칙 (2026-07-17)
- `playbook/frontend/ui/component.md` + `css-module.md`에 반영.
- CSS var 필요할 때만 `const style = {} as CSSProperties` → `style={style}`.
- JSX 인라인 `style={{ ... }}` 금지. 일반 시각 속성은 클래스로.
- 훅은 값만 반환. style 조립은 컴포넌트. 고빈도 scroll/move만 `setCssVars` 예외.

### Popup → Modal 네이밍 (2026-07-17)
- `ProjectDetailPopup`/`ExperienceDetailPopup` → `*Modal`, `openPopup`/`popupOpen`/`popupExperience` → modal 계열.
- config `popupBackdropFadeS`/`popupSlideUpS` → `modal*`, CSS `--anim-popup-*`/`--project-popup-*` → `--*-modal-*`.
- variant `"popup"` → `"modal"`, i18n `popupLead`/`popupLabel` → `modalLead`/`modalLabel`.
- `aria-haspopup`는 ARIA 표준이라 유지. `versions/` 아카이브 콘텐츠는 미변경.

### Experience 훅 책임 정리 (2026-07-17)
- `useExperienceScroll(experiences)`만. `isMobile`/`type`은 내부 `useResponsive`.
- `useExperienceCardFade`도 `isMobile` 자체 조회.
- `useExperienceLongPress(isMobile, onLongPress)` 삭제 → `useExperienceInteraction`이 모달·hover·롱프레스·클릭 소유.
- `isMobile`은 훅 반환값에 넣지 않음. 컴포넌트/가이드는 `useResponsive()`에서만 조회.
- 가이드 Touch→Carousel: 보이는 개수(1+짤림 / 3+짤림)는 `--experience-card-width` CSS. ghost/롱프레스 스니펫 아님.

### 훅 사용 원칙 (2026-07-17)
- `playbook/frontend/ui/component.md` 훅 섹션에 반영.
- 단일 책임. 대응 훅 = 컴포넌트 기능만. 범용 훅 = 해당 기능만.
- `const { a } = useA(); useB(a)` 금지 → `useB` 내부에서 `useA` 호출.
- 코드를 꼬지 말 것. style/CSS var·isMobile 재노출 규칙은 기존과 동일.

### 훅 원칙 위반 수정 (2026-07-17)
- Experience: `useExperienceSection(experiences)`로 scroll+interaction+focus 점프 통합. drilling 제거.
- Projects: `useProjectCardFlipOutside(rowsContainerRef)`.
- Nav: tooltip CSS var → `const tooltipStyle` + `style={tooltipStyle}`.
- `useResponsive`에서 `a11yCardSuffix` 제거. 호출처에서 `isMobile ? 'Mobile' : 'Desktop'`.
- `ProjectDetailContent`가 `useResponsive`로 `isMobile` 직접 조회. prop drilling 제거.
- `ExperienceStackSection`도 `useResponsive`로 ghost/`mobileHovered` 판별.

### Fixed vs Bounded Grid 시뮬 (2026-07-17)
- Fixed Grid(Contact): breakpoint마다 1/2/4 고정 — CSS `@media`만.
- Bounded Grid(Projects): `projectsGrid` bp min–max ∩ 컨테이너 폭 → `effectiveBounds`, 슬라이더로 columns 조절 — TS `useProjectsGrid`.
- 가이드 Viewport: `projectCols` state lift + `ColumnControlSlider`, bounds 변경 시 useProjectsGrid와 동일 clamp/max-expand.
- 스니펫: Fixed Grid / Bounded Grid 라벨, Bounded에 slider + `effectiveBounds` 주석.

### UI 구분자 `·` 금지 (2026-07-17)
- 화면/문서 title/갤러리 라벨의 middle-dot `·` 구분자는 `/`로 교체.
- 한국어 주석의 병렬 접속 `·`(예: 숫자·문자열)은 별도.

### Responsive 규칙 2층 + Bounded 이중 스니펫 (2026-07-17)
- 상단 TS 규칙: useResponsive(범용) + 대응 훅이 내부 호출.
- Bounded Grid만 Projects.tsx + useProjectsGrid.ts 두 패널.

### Mobile chip + experience card (2026-07-18)
- Chip `.small`(StackChip/StatusChip)을 `@media (max-width: 860px)`에서 축소 — 카드에서 잘리던 스택/상태 칩 대응.
- ProjectCard 모바일: `languageStacksRow` wrap + status chip inset/gap 축소.
- ExperienceSlotCard 모바일: `--ratio` 0.95, 썸네일 2/1, `white-space:normal`, positionRow wrap.
- 경험 카드 폭 `42vw`(min 150 / max 220). pano throat 안쪽 여백.
- 불릿 줄바꿈: 공통 `TwoLineText` + `splitAtSpaceFittingWidth`. 메인 ExperienceCard·프로젝트 summary·갤러리/structure 슬롯 데모에 적용. 폭 우선 → 1줄 / L1≥L2 split(65%→50%) / wrap.
- 가이드 `ViewportWireframe` / `guideSnippets` 동일 값 동기화.
- 검증: typecheck / test.

### Intro bullet left inset (2026-07-18)
- `.introList`에 왼쪽 여백. 의도: 너비 대비 ~25% (`margin-left: 25%`). `1vw` = 뷰포트 너비 1%라서 25% ≈ 25vw와 같음. `0.25vw`는 오해였음.

### GotoButton font bump (2026-07-18)
- size prop 변경 없이 small/medium/large clamp를 한 단계씩 키움 (large ≈ 14–18px). chevron은 `1em`으로 폰트에 맞춤.

### /accessibility 페이지 (2026-07-18)
- 계획서 기준 4탭: Guarantee / Copy / Touch / Font.
- SR 데모는 SpeechSynthesis, 기본 음소거. volume outline만.
- Font 데모는 로컬 --demo-font-scale, 전역 configStore 미연결.
- Docs portfolio에 접근성 설계 철학 링크 추가.

### /accessibility UX 재작업 (2026-07-18)
- 탭: 필수 이름 / 조작 안내 / 터치 영역 / 글자 배율.
- 비교는 나란히. 깨짐/지킴 워딩 제거 → 이름 없음·있음, 부족한 예·권장 예.
- 오른쪽 빈 CodeSnippet 패널 제거. 코드는 각 열 아래.
- 터치: 흰 네모=보이는 버튼, 테두리=클릭 영역. WCAG 2.5.5 44px 인용.

### /accessibility 재생·음소거 분리 (2026-07-18)
- 음소거(volume)와 재생/중지(play/stop) 버튼 분리.
- 음소거는 소리만. 재생이 하이라이트·발화 시작.
- outline play/stop SVG 추가.
- 검증: `npx tsc --noEmit`, `npm test`.

- 원칙 탭 버튼 3개(검색·설정·복사). 닫기 제거.
- 권장 코드: IconButton.tsx / useA11y.ts / 사용 영역 분리 (주석 구분 아님).
- SR 재생 시 해당 버튼·자막 줄 동시 하이라이트. 줄 사이 450ms 휴지.
- 검증: `npx tsc --noEmit`, `npm test`.

- Icon.embedded(100%)가 헤더에서 거대화 → 고정 14px SVG 글리프로 교체.
- 긴 태그 한 글자 세로 줄바꿈 → 제목 아래 가로 배지.
- 제목: 직접 붙이기 / 컴포넌트로 강제.
- 양쪽 미리보기 동일 Outlined 룩 (`Icon.Outlined` vs `IconButton.Outlined`).
- 검증: `npx tsc --noEmit`, `npm test`.

- 코드 주석에 WCAG/W3C URL을 넣지 않음.
- `CiteSection`: blockquote + 원문 문장 + 출처 링크.
- 시맨틱·터치 탭 비교 아래에 배치.
- 검증: `npx tsc --noEmit`, `npm test`.

### /accessibility 비교 UX 3차 (2026-07-18)
- 태그: close/check 아이콘 + 문구. 원칙 탭은 "컴포넌트 설계 원칙을 따르지 않음/따름".
- 탭: 컴포넌트 원칙 / 조작 안내 / 시맨틱 / 터치 영역 / 글자 배율.
- 컴포넌트 원칙: 버튼 4개(검색·설정·복사·닫기). 양쪽 SR 동일. 요지는 수동 반복 vs ariaLabel 필수+useA11y.
- 조작 안내: ChipButton(보이는 글자 vs 하는 일) + ProjectCard(제목 vs 조작법). 풍부한 SR 맥락.
- 시맨틱: span role=button vs button. CiteSection으로 W3C/WHATWG 인용.
- 검증: `npx tsc --noEmit`, `npm test`.

### /accessibility 비교 UX 2차 (2026-07-18)
- 태그: 비권장 / 권장. 권장 열 opacity·border·inset shadow로 강조.
- 열 레이아웃: (화면예시 | 스크린 리더) 위, 코드 풀폭 아래.
- Font 슬라이더 `max-width: 280px`.

### /components Philosophy 초안 (2026-07-18)
- Docs: `docs/컴포넌트_철학_페이지_초안.md`.
- 모드: Philosophy(랜딩) / Structure / Gallery.
- Philosophy 탭: 계층 구분 | 구성 관계 | API 계약.
- 관계 라벨: 확장·사용·조합·구체화 (활용 폐기).
- 접근성 톤: 비권장|권장 비교 + 짧은 코드. 장문 위키 이식 금지.
- 미확정: TabNavigation에서 버킷 노출 범위, layers에 미니 Structure 여부, contract 3행째 ariaLabel을 Philosophy에 둘지.

- Philosophy 결정: (1) Philosophy/Structure에서 Gallery 버킷 탭 숨김 (2) 계층 탭에 Structure 미니 프리뷰 (3) ariaLabel 데모는 Philosophy에 중복 금지, /accessibility Goto만.

- 분리: Philosophy=컴포넌트 집중(계층·관계·API), Accessibility=접근성 집중(SR·터치·배율). 겹치면 각자 렌즈로만 짧게 + Goto.

## Structure edge arrow styles (2026-07-18)
- 구분: opacity/dash 길이 대신 실선|점선 × filled|outlined 4종.
- UML 유사 매핑: wrap(확장)=실선 outlined(Generalization), context(구체화)=점선 outlined(Realization), compose(조합)=실선 filled(Composition), embed(사용)=점선 filled(Dependency).
- 범례 순서: 확장 → 구체화 → 조합 → 사용.
- hover dim opacity는 kind 공통으로 유지.

- 검증: `npm run typecheck`, `npm test` (55 passed).

- Layout 기획: 계층 탭에 "안 보이는 배치" 강조. 비교 A=표면에 gap 섞기 vs Stack+Card, B=자식 className vs 부모 wrapper. 데모용 배치 가이드 토글 가능. Card≠Layout.

## Structure edge off-screen labels (2026-07-18)
- hover 시 상대 노드가 뷰포트 밖이면 경로 라벨로 title만 표시.
- 라벨 위치는 경로 중점이 아니라 hover 쪽 28%/72% 지점 — 긴 하향 간선도 화면 안에 남도록.
- scroll/resize 중 hover 유지 시 가시성 재평가.
- 라벨은 structureEdgeLabels(z-index 2)로 분리해 row 배경에 가리지 않음.
- 검증: `npm run typecheck`, `npm test` (55 passed).

## Structure arrowhead z-index (2026-07-18)
- 화살촉이 row 패딩/배경에 가려짐 → structureEdges z-index 3, labels 4. pointer-events:none 유지로 hover/클릭은 노드로 통과.

## Outlined arrowhead masks shaft (2026-07-18)
- outlined marker fill=`var(--color-bg)`로 축선이 빈 삼각형 안으로 비치지 않게 함 (UML hollow arrow).
- 라벨 위치: 경로 비율(28/72%) → 끝에서 40px 안쪽. 목적지만 화면에 있을 때 출처 라벨이 같이 화면 밖으로 나가던 문제 수정.

## /components Philosophy 구현 (2026-07-18)
- 확인: 기본탭=계층 구분, Structure 미니=최대한 간단, Gallery 탭 라벨=`Gallery`, 화살표 표준=실/점 × open/fill.
- 라우트: index → philosophy. TabNavigation: Philosophy | Structure | Gallery; 버킷+Role/Domain은 Gallery에서만.
- PhilosophyShowcase: layers(체인+Layout playground+비교), relations(범례+비교), contract(토큰/variant+a11y Goto).
- Docs / accessibility Goto → `/components/philosophy`.
- 오프스크린 라벨 겹침: 접근 x 정렬 + 경로 거리 슬롯(28px) + 접선 수직 lateral(16px)로 분산.

- TabNavigation: 모드 행(Philosophy/Structure/Gallery)과 버킷 행(Layout…) 분리. Gallery일 때만 아래 행. UI에서 cdot(`·`) 금지.

- UI/카피에서 em dash(`—`)도 금지. 마침표·콜론·슬래시로 대체.

- Relations 탭: 주석 대신 Structure 스타일 미니 그래프(노드 Card + 표준 화살표). 코드는 사용부만.

## Layout ChipSelect Playground (2026-07-18)
- Segmented → Interactive `ChipSelect` (ChipButton Primary/Outlined, radiogroup).
- Layout Playground: ChipSelect로 direction/justify/align/gap/width. multiline textarea. props만 양방향(blur parse). children은 데모 표시, preview 고정.
- 헬퍼: `stackPlaygroundCode.ts`. 검증: typecheck, test 60 passed.

## Philosophy 탭 분리 (2026-07-18)
- 탭 5개: 계층 구분 | 구성 관계 | Layout | Feature | 토큰화 (ChipSelect).
- 계층=체인+정의만. Layout=배치 비교+Playground. Feature=쌓기 철학. 토큰화=className/매직넘버/ClickAction.
- API 계약 단일 탭 폐기.

- 계층 체인: 가로(좌→우), filled 화살표, 노드 가운데 정렬, 예시 자막 제거. Composed/Feature 정의는 설계철학 §5에 맞춤.

- Philosophy 포커스 탭: ChipSelect → SegmentedButton. 라벨=계층 구분|구성 관계|레이아웃 컴포넌트 Layout|완성형 컴포넌트 Feature|디자인 토큰화.

- 구성 관계: 확장→사용→조합→구체화 순. "사용만 있는 줄" 제거. 비권장|권장 프레임 대신 종류별 설명 카드. Structure 범례 순서 동기화.

- 계층 그래프: 서술 문구 제거. 양끝 추상화|구체화. Layout↔Design은 화살표 대신 soft sep (배치 층 vs 표면→완결 쌓기).
- 토큰화 탭: raw `size=\"22px\"`/`backgroundColor` vs `size`·`variant` 토큰 비교를 첫 행에 추가.
- Layout 탭: \"표면에 간격과 폭을 섞음\" / \"배치는 Layout, 표면은 Design\" 비교 행 제거 (뜬금).
- Layout 비교: className/style 외부 주입 vs 구현 내부 styles.card 고정(className props 없음).
- Layout 비교: 비권장 CardProps에 className/style, 권장은 children만. 주석 제거.
- ChipSelect: selected=Secondary, 왼쪽 visible label(direction/justify/…). Playground: 코드|미리보기 좌우 배치.
- Playground width=stretch: Stack 셸로 폭 가시화. 기본 align=stretch (center면 카드만 가운데라 stretch가 안 보이던 착시).
- Playground: 코드 onChange 시 Stack props 즉시 파싱→미리보기. blur에서만 스니펫 정규화. children은 데모 고정.
- Playground B 카드: 임의 min-height 제거. subtitle 두 줄 내용으로 높이 차이 → align 비교 당위성.
- Playground children: Icon / Card / Chip — 종류가 달라  Intrinsic 높이 차이. fake tall·subtitle 제거.
- Layout 비교: contract 하이라이트(className/style/usage). 권장 CardProps에 // className, style 없음.
- Playground: Icon/Chip variant 파싱→미리보기. Icon.Outline 등 unknown은 에러 + 직전 children 유지.

## CodeField (2026-07-18)
- Interactive `CodeField`: className 없음, `width`/`invalid` 토큰. Tab·Shift+Tab·Option+↑↓·Cmd/Ctrl+[/]·Enter 들여쓰기 유지.
- Layout Playground textarea → CodeField. Gallery `code-field` 추가.
- 검증: `npm test` 69 passed, `tsc --noEmit`.
- CodeField: Option+Shift+↑↓ 줄 복제 (VS Code Copy Line).
- Playground: \"배치 가이드\" → grid ToggleIconButton (outline/fill grid 아이콘).

## Philosophy focus URL (2026-07-18)
- 뒤로가기 시 탭 초기화 → localStorage 대신 `?focus=` (Gallery `?view=`와 동일).
- 탭 전환은 `replace: true` — 히스토리에 탭마다 쌓지 않음. 페이지를 떠날 때 URL에 이미 focus가 있어 뒤로가기로 복원.
- localStorage는 새 방문에도 예전 탭이 남아 URL/공유와 어긋남.

## CodeField highlight / showLine / resize (2026-07-18)
- 네이티브 `::-webkit-resizer` 흰 그립 제거 → `resize-corner` 커스텀 핸들(세로 drag).
- syntax: 오버레이 pre + 투명 textarea. `language`: tsx | css | html. grayscale (tag/attr/equal/value/comment).
- `showLine`: 왼쪽 gutter, scroll 동기화.
- 토크나이저는 원문 길이·문자 보존 (formatUsageCode처럼 포맷 변경 금지 — 캐럿 어긋남 방지).

## Philosophy layer map (2026-07-18)
- Invisible(Layout) / Visible(Design→Feature) 밴드 분리 + 가로 divider.
- Visible 왼쪽 Abstract↔Specific 양방향 축 (기존 추상화/구체화 대체).
- 각 계층 설명 오른쪽 예시 pill 2~3개 (Stack/Box, Icon/Chip/Card, …).

## Feature 탭 맥락 봉인 (2026-07-18)
- SettingsButton 이름 = 톱니·원형 large·Secondary·설정 모달. 호출부 `onClick`으로 열림을 빼면 약속 깨짐.
- 비교: `onClick?: () => void` 노출 vs `<SettingsButton />`만.
- 2026-07-18 교체: 비교를 1행(비권장/권장)으로. 비권장 = Icon만 쓰고 IconButton SOT를 styles.iconButton에 재정의. 권장 = IconButton.Secondary 재사용. 봉인 비교행은 제거.

## Tokens 탭 재구성 (2026-07-18)
- 삭제: className props row (Layout Card와 중복), ClickAction row (API 설계, 토큰화 아님), a11y 푸터.
- 유지 3행: (1) 크기/색 직접 지정 vs 토큰 (2) variant 문자열 vs Chip.Outlined (3) width 매직넘버 vs stretch 토큰.
- 각 행 비권장/권장 미리보기 동일. 제목은 서술형 (코드 나열식 금지). `·`/`—` 미사용.

## CodeBlock (2026-07-18)
- 표시용 코드는 Design `CodeBlock`, 편집은 Interactive `CodeField`. 디자인 통일은 CodeBlock 기준.
- grayscale 토크나이저는 `design/codeBlock/codeHighlight` SSOT. CodeField는 re-export.
- Philosophy 구성 관계 카드: 그래프 `margin-block`, 코드는 `height="stretch"`.
- Gallery: `code-block` (design / text). 가이드 비교열의 `CodeSnippet`(a11y 키워드 강조)은 용도가 달라 유지.
- 이중 border / 비례 폰트 / highlight 안 보임 원인: 전역 `code { border, bg, padding }`이 내부 `<code>`에 붙고, 미정의 `--font-mono` + `.code { font: inherit }`가 모노스페이스를 덮음. CodeField와 동일 스택·토큰 색 + 전역 리셋으로 수정.
- `syntaxHighlight`(기본 true). false면 본문 dim + `highlightWords`만 흰색(긴 단어 우선·식별자 경계). Philosophy 관계 코드는 word 모드.
