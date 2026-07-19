// /accessibility 탭 포커스와 스니펫 상수
export type A11yFocus = 'principle' | 'announce' | 'semantic' | 'touch' | 'font';

export const A11Y_FOCUS_OPTIONS: { value: A11yFocus; label: string }[] = [
  { value: 'semantic', label: '시맨틱 태그 사용' },
  { value: 'principle', label: '컴포넌트 원칙 준수' },
  { value: 'announce', label: '상세한 기능 설명' },
  { value: 'touch', label: '넓은 터치 영역' },
  { value: 'font', label: '저시력자를 위한 글자 크기 조정' },
];

export const VERDICT_AGAINST_PRINCIPLE = '컴포넌트 설계 원칙을 따르지 않음';
export const VERDICT_FOLLOW_PRINCIPLE = '컴포넌트 설계 원칙을 따름';

/** 양쪽 SR 캡션은 동일. 차이는 "매번 수동" vs "컴포넌트가 ariaLabel 필수". */
export const PRINCIPLE_SR_LINES = [
  '설정 열기, 버튼',
  '클립보드에 복사, 버튼',
  '닫기, 버튼',
] as const;

export const CODE_PRINCIPLE_MANUAL_SECTIONS: { label: string; code: string }[] = [
  {
    label: '사용부',
    code: `<button
  className={styles.outlined}
  aria-label="설정 열기"
><Icon name="settings" /></button>

<button
  className={styles.outlined}
  aria-label="클립보드에 복사"
><Icon name="copy" /></button>

<button
  className={styles.outlined}
  aria-label="닫기"
><Icon name="close" /></button>`,
  },
];

export const CODE_PRINCIPLE_ENFORCED_SECTIONS: { label: string; code: string }[] = [
  {
    label: 'IconButton.tsx',
    code: `function IconButton({ ariaLabel }) {
  return (
    <button aria-label={ariaLabel}>
      <span aria-hidden="true">
        <Icon ... />
      </span>
    </button>
  );
}`,
  },
  {
    label: 'useA11y.ts',
    code: `t(\`a11y.\${key}\`, options)`,
  },
  {
    label: '사용부',
    code: `const a11y = useA11y();

<IconButton.Outlined
  name="settings"
  ariaLabel={a11y('nav.settingsOpen')}
/>
<IconButton.Outlined
  name="copy"
  ariaLabel={a11y('common.copy')}
/>
<IconButton.Outlined
  name="close"
  ariaLabel={a11y('common.close')}
/>`,
  },
];

export const CODE_CHIP_SURFACE_SECTIONS: { label: string; code: string }[] = [
  {
    label: '사용부',
    code: `<button type="button">
  <Chip.Outlined
    label={label}
    iconName="search"
    shape="full"
  />
</button>`,
  },
];

export const CODE_CHIP_ACTION_SECTIONS: { label: string; code: string }[] = [
  {
    label: 'SearchShortcutChipButton.tsx',
    code: `<SearchChipButton
  label={resolved.label}
  ariaLabel={a11y(
    'project.searchShortcut',
    { label: resolved.label }
  )}
/>`,
  },
  {
    label: 'translations.ts',
    code: `project: {
  searchShortcut:
    '{{label}}, 눌러서 프로젝트 검색'
}`,
  },
  {
    label: '사용부',
    code: `<SearchShortcutChipButton
  label="포트폴리오"
  query='title:"포트폴리오" show:all'
/>`,
  },
];

export const CODE_ANNOUNCE_TITLE_SECTIONS: { label: string; code: string }[] = [
  {
    label: '사용부',
    code: `ariaLabel={project.title}`,
  },
];

export const CODE_ANNOUNCE_HOWTO_SECTIONS: { label: string; code: string }[] = [
  {
    label: 'translations.ts',
    code: `cardMobile:
  '{{title}}. 처음 누르면 카드 뒤집기, 다시 누르면 상세 창.'
cardDesktop:
  '{{title}}. 상세 창 열기.'`,
  },
  {
    label: '사용부',
    code: `const a11y = useA11y();

ariaLabel={a11y(
  \`project.card\${isMobile ? 'Mobile' : 'Desktop'}\`,
  { title: project.title }
)}`,
  },
];

export const CODE_SEMANTIC_FAKE = `// role로 button을 흉내 내면
// 키보드·포커스·비활성까지 직접 구현해야 한다.
<span
  role="button"
  tabIndex={0}
  onClick={onOpen}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    }
  }}
>
  열기
</span>`;

export const CODE_SEMANTIC_NATIVE = `// 네이티브 button — 역할·키보드·포커스가 기본으로 온다.
<button type="button" onClick={onOpen}>
  열기
</button>`;

export const CODE_TOUCH_SAME = `.iconButton {
  width: 36px;
  height: 36px;
}`;

export const CODE_TOUCH_EXPAND = `/* 보이는 셸은 그대로, 클릭만 ::before로 확장 */
.iconButton::before {
  width: 44px;
  height: 44px;
}`;

/** 시맨틱 탭 인용 */
export const CITE_SEMANTIC: {
  title: string;
  quote: (string | { emph: string })[];
  translation: (string | { emph: string })[];
  source: string;
  href: string;
}[] = [
  {
    title: '첫 번째 규칙',
    quote: [
      'If you can use a ',
      { emph: 'native HTML element or attribute' },
      ' with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so.',
    ],
    translation: [
      '필요한 의미와 동작이 이미 내장된 ',
      { emph: '네이티브 HTML 요소나 속성' },
      '을 쓸 수 있다면, 다른 용도의 요소에 ARIA 역할·상태·속성을 덧붙여 접근성을 흉내 내지 말고, ',
      { emph: '그 네이티브 요소를 그대로 사용하라' },
      '.',
    ],
    source: 'W3C, ARIA 사용 제1원칙',
    href: 'https://www.w3.org/TR/using-aria/#rule1',
  },
  {
    title: '두 번째 규칙',
    quote: [
      'In the case of a button, for example, it is much better and easier to ',
      { emph: 'Just use a (native HTML) button' },
      '.',
    ],
    translation: [
      '예를 들어 버튼이 필요하다면, ',
      { emph: '그냥 네이티브 HTML button' },
      '을 쓰는 편이 훨씬 낫고 간단하다.',
    ],
    source: 'W3C, ARIA 사용 제2원칙 (비고)',
    href: 'https://www.w3.org/TR/using-aria/#second',
  },
  {
    title: '참고',
    quote: [
      'The ',
      { emph: 'button element' },
      ' represents a button ',
      { emph: 'labeled by its contents' },
      '.',
    ],
    translation: [
      { emph: 'button 요소' },
      '는 ',
      { emph: '그 내용으로 레이블이 정해지는' },
      ' 버튼을 나타낸다.',
    ],
    source: 'HTML Living Standard, button 요소',
    href: 'https://html.spec.whatwg.org/multipage/form-controls.html#the-button-element',
  },
];

/** 터치 영역 탭 인용 */
export const CITE_TOUCH: {
  quote: (string | { emph: string })[];
  translation: (string | { emph: string })[];
  source: string;
  href: string;
}[] = [
  {
    quote: [
      'The size of the target for pointer inputs is ',
      { emph: 'at least 44 by 44 CSS pixels' },
      ' except when:',
    ],
    translation: [
      '포인터 입력 대상의 크기는 (예외를 제외하고) ',
      { emph: '최소 44×44 CSS 픽셀' },
      '이어야 한다.',
    ],
    source: 'WCAG 2.2 · Success Criterion 2.5.5 Target Size (Enhanced) AAA',
    href: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html',
  },
];

export const CODE_FONT_IGNORE = `.title {
  font-size: 16px;
}`;

export const CODE_FONT_CLIP = `.box {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.title {
  font-size: calc(16px * var(--font-scale, 1));
}`;

export const CODE_FONT_OK = `.name {
  font-size: calc(18px * var(--font-scale, 1));
}

.body {
  font-size: calc(16px * var(--font-scale, 1));
}

.box {
  height: auto;
  min-height: 88px;
  overflow: visible;
}`;
