// /accessibility 원칙 + 탭별 나란히 비교 데모
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';
import { Icon } from '@components/design/icon/Icon';
import { Chip } from '@components/design/chip/Chip';
import { IconButton } from '@components/interactive/icon/IconButton';
import { SearchChipButton } from '@components/composed/chip/SearchChipButton';
import { FlipCard } from '@components/interactive/card/FlipCard';
import { Modal } from '@components/interactive/modal/Modal';
import { ControlSlider } from '@components/interactive/controlSlider/ControlSlider';
import { GotoButton } from '@components/interactive/button/GotoButton';
import { useResponsive } from '@hooks/useResponsive';
import {
  SCALE_SLIDER_STEP,
  TYPO_SCALE_MAX,
  TYPO_SCALE_MIN,
} from '../../config';
import { CompareColumn } from './CompareColumn';
import { CiteSection } from './CiteSection';
import {
  A11Y_FOCUS_OPTIONS,
  CITE_SEMANTIC,
  CITE_TOUCH,
  CODE_ANNOUNCE_HOWTO_SECTIONS,
  CODE_ANNOUNCE_TITLE_SECTIONS,
  CODE_CHIP_ACTION_SECTIONS,
  CODE_CHIP_SURFACE_SECTIONS,
  CODE_FONT_CLIP,
  CODE_FONT_IGNORE,
  CODE_FONT_OK,
  CODE_PRINCIPLE_ENFORCED_SECTIONS,
  CODE_PRINCIPLE_MANUAL_SECTIONS,
  CODE_SEMANTIC_FAKE,
  CODE_SEMANTIC_NATIVE,
  CODE_TOUCH_EXPAND,
  CODE_TOUCH_SAME,
  PRINCIPLE_SR_LINES,
  VERDICT_AGAINST_PRINCIPLE,
  VERDICT_FOLLOW_PRINCIPLE,
  type A11yFocus,
} from './accessibilitySnippets';
import { buildCls } from '@utils/cssUtil';
import shell from './responsive.module.css';
import styles from './accessibility.module.css';

const PROJECT_TITLE = '포트폴리오';
const CARD_MOBILE_SR = `${PROJECT_TITLE}. 처음 누르면 카드 뒤집기, 다시 누르면 상세 창.`;
const CARD_DESKTOP_SR = `${PROJECT_TITLE}. 상세 창 열기.`;
const FONT_DEMO_NAME = 'Seungjoon Hyeon';
const FONT_DEMO_LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const DEMO_ACTIONS = [
  { name: 'settings' as const, label: '설정 열기' },
  { name: 'copy' as const, label: '클립보드에 복사' },
  { name: 'close' as const, label: '닫기' },
];

type AnnounceExample = 'chip' | 'card';

const ANNOUNCE_EXAMPLES: { value: AnnounceExample; label: string }[] = [
  { value: 'chip', label: '예시 1) SearchShortcutChipButton' },
  { value: 'card', label: '예시 2) ProjectCard' },
];

function ManualIconRow({ activeIndex }: { activeIndex: number | null }): ReactNode {
  return (
    <div className={styles.iconRow}>
      {DEMO_ACTIONS.map(({ name, label }, index) => (
        <button
          key={name}
          type="button"
          className={buildCls(
            styles.demoOutlined,
            activeIndex === index && styles.demoOutlinedActive
          )}
          aria-label={label}
          onClick={() => undefined}
        >
          <span aria-hidden="true">
            <Icon.Outlined name={name} size="medium" />
          </span>
        </button>
      ))}
    </div>
  );
}

function PrincipleIconRow({ activeIndex }: { activeIndex: number | null }): ReactNode {
  return (
    <div className={styles.iconRow}>
      {DEMO_ACTIONS.map(({ name, label }, index) => (
        <span
          key={name}
          className={buildCls(
            styles.demoOutlined,
            activeIndex === index && styles.demoOutlinedActive
          )}
        >
          <IconButton.Outlined name={name} ariaLabel={label} onClick={() => undefined} />
        </span>
      ))}
    </div>
  );
}

function ProjectCardPreview({
  ariaLabel,
  detailTitleId,
}: {
  ariaLabel: string;
  detailTitleId: string;
}): ReactNode {
  const { isMobile } = useResponsive();
  const [flipped, setFlipped] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const returnFocusRef = useRef<HTMLDivElement>(null);

  const flipProps = isMobile
    ? { flipped, onFlippedChange: setFlipped }
    : {};

  return (
    <>
      <div className={styles.cardPreviewSlot}>
        <FlipCard
          ref={returnFocusRef}
          surface={false}
          onOpen={() => setModalOpen(true)}
          ariaLabel={ariaLabel}
          {...flipProps}
          front={
            <div className={styles.cardPreviewFace}>
              <div className={styles.cardThumb} aria-hidden="true" />
              <p className={styles.cardTitle}>{PROJECT_TITLE}</p>
            </div>
          }
          back={
            <div className={styles.cardPreviewFace}>
              <p className={styles.cardBackLead}>카드 뒷면</p>
              <p className={styles.cardBackText}>
                {isMobile
                  ? '한 번 더 누르면 상세 창이 열립니다.'
                  : '클릭하면 상세 창이 열립니다.'}
              </p>
            </div>
          }
        />
      </div>
      {modalOpen
        ? createPortal(
            <Modal
              titleId={detailTitleId}
              title={`${PROJECT_TITLE} 상세`}
              titleVisible
              size="compact"
              fitContent
              onClose={() => setModalOpen(false)}
              returnFocusRef={returnFocusRef}
            >
              <p className={styles.cardModalBody}>
                {isMobile
                  ? '모바일: 첫 탭은 뒤집기, 두 번째 탭은 상세 창.'
                  : '데스크톱: 올리면 뒤집히고, 클릭하면 상세 창.'}
              </p>
            </Modal>,
            document.body
          )
        : null}
    </>
  );
}

function FakeRoleButton(): ReactNode {
  return (
    <span
      className={styles.fakeButton}
      role="button"
      tabIndex={0}
      onClick={() => undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
      }}
    >
      열기
    </span>
  );
}

function NativeButton(): ReactNode {
  return (
    <button type="button" className={styles.nativeButton} onClick={() => undefined}>
      열기
    </button>
  );
}

export function AccessibilityShowcase(): ReactNode {
  const [focus, setFocus] = useState<A11yFocus>('semantic');
  const [announceExample, setAnnounceExample] = useState<AnnounceExample>('chip');
  const [fontScale, setFontScale] = useState(1);
  const { isMobile } = useResponsive();
  const cardHowtoSr = isMobile ? CARD_MOBILE_SR : CARD_DESKTOP_SR;
  const demoStyle = {
    ['--demo-font-scale' as string]: String(fontScale),
  } as CSSProperties;

  return (
    <>
      <h1 className={shell.title}>Accessibility</h1>

      <div className={styles.demoShell}>
        <div className={shell.focusBar}>
          <SegmentedButton
            ariaLabel="접근성 예시"
            width="stretch"
            value={focus}
            options={A11Y_FOCUS_OPTIONS.map(({ value, label }) => ({ value, label }))}
            onChange={(value) => setFocus(value as A11yFocus)}
          />
        </div>

        <div className={styles.demoScroll}>
          {focus === 'principle' && (
            <div className={styles.exampleStack}>
              <div className={styles.principleShortcut}>
                <p className={styles.citeHeading}>설계 원칙</p>
                <GotoButton
                  href="/components/philosophy"
                  size="small"
                  ariaLabel="컴포넌트 설계 원칙 바로가기"
                >
                  컴포넌트 설계 원칙
                </GotoButton>
              </div>
              <div className={styles.compareRow}>
                <CompareColumn
                  title="직접 붙이기"
                  verdictLabel={VERDICT_AGAINST_PRINCIPLE}
                  preview={(activeIndex) => <ManualIconRow activeIndex={activeIndex} />}
                  srLines={[...PRINCIPLE_SR_LINES]}
                  codeSections={CODE_PRINCIPLE_MANUAL_SECTIONS}
                />
                <CompareColumn
                  title="컴포넌트로 강제"
                  recommended
                  verdictLabel={VERDICT_FOLLOW_PRINCIPLE}
                  preview={(activeIndex) => <PrincipleIconRow activeIndex={activeIndex} />}
                  srLines={[...PRINCIPLE_SR_LINES]}
                  codeSections={CODE_PRINCIPLE_ENFORCED_SECTIONS}
                  codeLayout="impl-usage"
                />
              </div>
            </div>
          )}

          {focus === 'announce' && (
            <div className={styles.exampleStack}>
              <div
                className={styles.exampleTabs}
                role="tablist"
                aria-label="기능 설명 예시"
              >
                {ANNOUNCE_EXAMPLES.map(({ value, label }) => {
                  const selected = announceExample === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      className={buildCls(
                        styles.exampleTab,
                        selected && styles.exampleTabActive
                      )}
                      onClick={() => setAnnounceExample(value)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {announceExample === 'chip' ? (
                <div className={styles.compareRow}>
                  <CompareColumn
                    title="보이는 글자만"
                    preview={
                      <button type="button" className={styles.demoChipWrap}>
                        <Chip.Outlined
                          label="포트폴리오"
                          iconName="search"
                          size="small"
                          shape="full"
                        />
                      </button>
                    }
                    srCaption="포트폴리오"
                    codeSections={CODE_CHIP_SURFACE_SECTIONS}
                  />
                  <CompareColumn
                    title="하는 일이 읽힘"
                    recommended
                    preview={
                      <SearchChipButton
                        label="포트폴리오"
                        ariaLabel="포트폴리오, 눌러서 프로젝트 검색"
                      />
                    }
                    srCaption="포트폴리오, 눌러서 프로젝트 검색"
                    codeSections={CODE_CHIP_ACTION_SECTIONS}
                    codeLayout="impl-usage"
                  />
                </div>
              ) : (
                <div className={styles.compareRow}>
                  <CompareColumn
                    title="제목만"
                    preview={
                      <ProjectCardPreview
                        ariaLabel={PROJECT_TITLE}
                        detailTitleId="a11y-demo-card-title-only"
                      />
                    }
                    srCaption={PROJECT_TITLE}
                    codeSections={CODE_ANNOUNCE_TITLE_SECTIONS}
                  />
                  <CompareColumn
                    title="제목 + 조작법"
                    recommended
                    preview={
                      <ProjectCardPreview
                        ariaLabel={cardHowtoSr}
                        detailTitleId="a11y-demo-card-howto"
                      />
                    }
                    srCaption={cardHowtoSr}
                    codeSections={CODE_ANNOUNCE_HOWTO_SECTIONS}
                    codeLayout="impl-usage"
                  />
                </div>
              )}
            </div>
          )}

          {focus === 'semantic' && (
            <div className={styles.exampleStack}>
              <CiteSection items={CITE_SEMANTIC} />
              <div className={styles.compareRow}>
                <CompareColumn
                  title={'span + role="button"'}
                  preview={<FakeRoleButton />}
                  srCaption="열기, 버튼"
                  code={CODE_SEMANTIC_FAKE}
                />
                <CompareColumn
                  title="<button>"
                  recommended
                  preview={<NativeButton />}
                  srCaption="열기, 버튼"
                  code={CODE_SEMANTIC_NATIVE}
                />
              </div>
            </div>
          )}

          {focus === 'touch' && (
            <div className={styles.exampleStack}>
              <CiteSection items={CITE_TOUCH} />
              <div className={styles.compareRow}>
                <CompareColumn
                  title="클릭 = 보이는 크기"
                  preview={
                    <div>
                      <div className={styles.hitStage}>
                        <span className={`${styles.hitArea} ${styles.hitAreaSame}`} aria-hidden="true" />
                        <span className={styles.hitVisible} aria-hidden="true" />
                      </div>
                      <p className={styles.hitCaption}>클릭 영역 36px</p>
                    </div>
                  }
                  code={CODE_TOUCH_SAME}
                />
                <CompareColumn
                  title="보이는 36, 클릭 44"
                  recommended
                  preview={
                    <div>
                      <div className={styles.hitStage}>
                        <span className={`${styles.hitArea} ${styles.hitAreaWide}`} aria-hidden="true" />
                        <span className={styles.hitVisible} aria-hidden="true" />
                      </div>
                      <p className={styles.hitCaption}>클릭 영역 44px (::before)</p>
                    </div>
                  }
                  code={CODE_TOUCH_EXPAND}
                />
              </div>
            </div>
          )}

          {focus === 'font' && (
            <div className={styles.exampleStack} style={demoStyle}>
              <div className={styles.fontToolbar}>
                <ControlSlider
                  size="small"
                  width="stretch"
                  value={fontScale}
                  min={TYPO_SCALE_MIN}
                  max={TYPO_SCALE_MAX}
                  step={SCALE_SLIDER_STEP}
                  onChange={setFontScale}
                  displayValue={`${fontScale}x`}
                  ariaLabel="데모 글자 배율"
                  ariaValueText={`현재 ${fontScale}배`}
                  decreaseLabel="글자 배율 줄이기"
                  increaseLabel="글자 배율 키우기"
                />
              </div>
              <div className={`${styles.compareRow} ${styles.compareRow3}`}>
                <CompareColumn
                  title="배율 무시"
                  preview={
                    <div className={styles.fontCard}>
                      <p className={styles.fontFixed}>{FONT_DEMO_NAME}</p>
                    </div>
                  }
                  code={CODE_FONT_IGNORE}
                />
                <CompareColumn
                  title="글자만 키움"
                  preview={
                    <div className={styles.fontCardClip}>
                      <p className={styles.fontScaled}>{FONT_DEMO_LOREM}</p>
                    </div>
                  }
                  code={CODE_FONT_CLIP}
                />
                <CompareColumn
                  title="레이아웃까지"
                  recommended
                  preview={
                    <div className={styles.fontCardGrow}>
                      <p className={styles.fontName}>{FONT_DEMO_NAME}</p>
                      <p className={styles.fontScaled}>{FONT_DEMO_LOREM}</p>
                    </div>
                  }
                  code={CODE_FONT_OK}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
