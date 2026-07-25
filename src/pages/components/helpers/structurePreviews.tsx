// 구조 다이어그램 노드별 실물 미리보기 — variant가 있는 컴포넌트는 2개 이상 예시를 나란히 보여준다
import type { ReactNode } from 'react';
import { Icon } from '@components/design/icon/Icon';
import { IconButton } from '@components/interactive/icon/IconButton';
import { Text } from '@components/design/button/Text';
import { Heading } from '@components/design/heading/Heading';
import { Card } from '@components/design/card/Card';
import { TextButton } from '@components/interactive/button/TextButton';
import { GotoButton } from '@components/interactive/button/GotoButton';
import { Chip } from '@components/design/chip/Chip';
import { ChipButton } from '@components/interactive/chip/ChipButton';
import { StatusChip } from '@components/composed/chip/StatusChip';
import { StackChipButton } from '@components/composed/chip/StackChipButton';
import { SkillChipButton } from '@components/composed/chip/SkillChipButton';
import { Tag } from '@components/design/tag/Tag';
import { TagButton } from '@components/interactive/tag/TagButton';
import { SegmentedButton } from '@components/interactive/segmentedButton/SegmentedButton';
import { ControlSlider } from '@components/interactive/controlSlider/ControlSlider';
import { FlipCard } from '@components/interactive/card/FlipCard';
import { CursorRing } from '@components/interactive/cursor/CursorRing';
import { SpeedControlSlider } from '@components/feature/controlSlider/SpeedControlSlider';
import { FontScaleControlSlider } from '@components/feature/controlSlider/FontScaleControlSlider';
import { ColumnControlSlider } from '@components/feature/controlSlider/ColumnControlSlider';
import { SettingsButton } from '@components/feature/SettingsButton';
import { ThemeToggleButton } from '@components/feature/icon/ThemeToggleButton';
import { LanguageSegmentedButton } from '@components/feature/control/LanguageSegmentedButton';
import { ToggleIconButton } from '@components/interactive/icon/ToggleIconButton';
import { CycleIconButton } from '@components/interactive/icon/CycleIconButton';
import { SearchField } from '@components/interactive/field/SearchField';
import { SearchChipButton } from '@components/composed/chip/SearchChipButton';
import { TypedExternalLink } from '@components/composed/link/TypedExternalLink';
import { FieldCard } from '@components/composed/card/FieldCard';
import { ProjectSortButton } from '@components/feature/icon/ProjectSortButton';
import { CopyIconButton } from '@components/feature/icon/CopyIconButton';
import { SearchShortcutChipButton } from '@components/feature/chip/SearchShortcutChipButton';
import { NavButton } from '@components/composed/nav/NavButton';
import { ProjectSearchField } from '@components/feature/field/ProjectSearchField';
import { ContactFieldCard } from '@components/feature/card/ContactFieldCard';
import { ExperienceSlotCard } from '@components/composed/card/ExperienceSlotCard';
import { LineFitText } from '@components/composed/text/LineFitText';
import slotStyles from '@components/composed/card/experienceSlotCard.module.css';
import { ExperienceCard } from '@components/feature/card/ExperienceCard';
import { ProjectSlotCard } from '@components/composed/card/ProjectSlotCard';
import { ProjectCard } from '@components/feature/card/ProjectCard';
import { DocRow } from '@components/feature/row/DocRow';
import ExperienceModel, { type ExperienceModelInput } from '@models/experience';
import ProjectModel, { type ProjectModelInput } from '@models/project';
import koExperiences from '@data/ko/experiences';
import koProjects from '@data/ko/projects';
import { Box } from '@components/layout/box/Box';
import { Stack } from '@components/layout/stack/Stack';
import { PROJECT_STATUS } from '@sections/projects/status/projectStatus';
import styles from './gallery.module.css';

const GALLERY_BOOSTCAMP = ExperienceModel.fromJson(
  ((koExperiences as ExperienceModelInput[]).find((item) => item.id === 'naver-boostcamp')
    ?? koExperiences[koExperiences.length - 1]) as ExperienceModelInput
);

const GALLERY_PS_STUDIO = ProjectModel.fromJson(
  ((koProjects as ProjectModelInput[]).find((item) => item.id === 'ps-studio')
    ?? koProjects[0]) as ProjectModelInput
);

export interface StructurePreviewState {
  segment: string;
  setSegment: (value: string) => void;
  speed: number;
  setSpeed: (value: number) => void;
}

function Group({ children }: { children: ReactNode }): ReactNode {
  return <div className={styles.structurePreviewGroup}>{children}</div>;
}

export function structurePreview(id: string, state: StructurePreviewState): ReactNode {
  switch (id) {
    case 'box':
      return (
        <Box width="hug">
          <span className={styles.structureMuted}>Box</span>
        </Box>
      );
    case 'stack':
      return (
        <Stack direction="horizontal" gap="small">
          <span className={styles.structureMuted}>A</span>
          <span className={styles.structureMuted}>B</span>
        </Stack>
      );
    case 'icon':
      return (
        <Group>
          <Icon.Primary name="settings" size="medium" alt="설정" />
          <Icon.Outlined name="settings" size="medium" alt="설정" />
        </Group>
      );
    case 'icon-button':
      return (
        <Group>
          <IconButton.Secondary name="settings" ariaLabel="설정" size="medium" />
          <IconButton.Outlined name="settings" ariaLabel="설정" size="medium" />
        </Group>
      );
    case 'text':
      return (
        <Group>
          <Text.Outlined size="small">Outlined</Text.Outlined>
          <Text.Secondary size="small">Secondary</Text.Secondary>
        </Group>
      );
    case 'text-button':
      return (
        <Group>
          <TextButton.Secondary size="small" ariaLabel="Secondary">
            Secondary
          </TextButton.Secondary>
          <TextButton.Primary size="small" ariaLabel="Primary">
            Primary
          </TextButton.Primary>
        </Group>
      );
    case 'chip':
      return (
        <Group>
          <Chip.Primary label="React" iconName="react" size="small" />
          <Chip.Outlined label="React" iconName="react" size="small" />
        </Group>
      );
    case 'chip-button':
      return (
        <Group>
          <ChipButton.Outlined
            label="React"
            iconName="react"
            size="small"
            ariaLabel="React"
            onClick={() => undefined}
          />
          <ChipButton.Primary
            label="React"
            iconName="react"
            size="small"
            ariaLabel="React"
            onClick={() => undefined}
          />
        </Group>
      );
    case 'status-chip':
      return (
        <Group>
          <StatusChip type={PROJECT_STATUS.ENDED} />
          <StatusChip type={PROJECT_STATUS.LIVE} />
        </Group>
      );
    case 'tag':
      return <Tag name="web" />;
    case 'tag-button':
      return <TagButton name="ai-usage" ariaLabel="ai-usage" onClick={() => undefined} />;
    case 'stack-chip-button':
      return (
        <StackChipButton
          label="React"
          iconName="react"
          ariaLabel="React"
          onClick={() => undefined}
        />
      );
    case 'skill-chip-button':
      return (
        <SkillChipButton
          label="TypeScript"
          iconName="typescript"
          ariaLabel="TypeScript"
          onClick={() => undefined}
        />
      );
    case 'relation-chip-button':
      // 그래프 노드 링크(Link) 안에 중첩되므로 실제 href 대신 onClick no-op으로 미리보기만 표시
      return (
        <Group>
          <ChipButton.Secondary
            label="Icon"
            iconName="angle-right"
            size="small"
            ariaLabel="inner"
            onClick={() => undefined}
          />
          <ChipButton.Outlined
            label="Nav"
            iconName="angle-left"
            size="small"
            ariaLabel="outer"
            onClick={() => undefined}
          />
        </Group>
      );
    case 'segmented-button':
      return (
        <SegmentedButton
          ariaLabel="demo"
          value={state.segment}
          onChange={state.setSegment}
          options={[
            { value: 'a', label: 'A' },
            { value: 'b', label: 'B' },
          ]}
        />
      );
    case 'control-slider':
      return (
        <ControlSlider
          legend="demo"
          value={state.speed}
          min={0}
          max={2}
          step={1}
          size="small"
          onChange={state.setSpeed}
          ariaLabel="speed"
          ariaValueText={`${state.speed}`}
          decreaseLabel="decrease"
          increaseLabel="increase"
          displayValue={`${state.speed}`}
        />
      );
    case 'speed-control-slider':
      return <SpeedControlSlider size="small" />;
    case 'font-scale-control-slider':
      return <FontScaleControlSlider size="small" />;
    case 'column-control-slider':
      return (
        <ColumnControlSlider
          value={state.speed}
          min={1}
          max={4}
          onChange={state.setSpeed}
        />
      );
    case 'modal':
      // 실제 Modal은 뷰포트 전체 backdrop/dialog라 인라인 임베드 불가 — panel 구도(title + 코너 close)만 축소 재현
      return (
        <div className={styles.modalPreview}>
          <span className={styles.structureMuted}>Title</span>
          <span className={styles.modalPreviewClose}>
            <IconButton.Primary name="close" ariaLabel="close" size="small" />
          </span>
        </div>
      );
    case 'heading':
      return <Heading text="Title" />;
    case 'settings-button':
      return <SettingsButton />;
    case 'settings-modal':
      return (
        <div className={styles.modalPreview}>
          <span className={styles.structureMuted}>Settings</span>
          <span className={styles.modalPreviewClose}>
            <IconButton.Primary name="close" ariaLabel="close" size="small" />
          </span>
        </div>
      );
    case 'toggle-icon-button':
      return (
        <ToggleIconButton
          name="eye-open"
          pressed={false}
          onClick={() => undefined}
          ariaLabel="toggle"
          size="medium"
        />
      );
    case 'cycle-icon-button':
      return (
        <CycleIconButton
          value={state.segment === 'oldest' || state.segment === 'status' ? state.segment : 'recent'}
          options={[
            { value: 'recent', iconName: 'sort-recent', ariaLabel: 'recent' },
            { value: 'oldest', iconName: 'sort-oldest', ariaLabel: 'oldest' },
            { value: 'status', iconName: 'sort-status', ariaLabel: 'status' },
          ]}
          onChange={state.setSegment}
          size="medium"
        />
      );
    case 'search-field':
      return (
        <SearchField
          value=""
          onChange={() => undefined}
          ariaLabel="search"
          width="hug"
          size="small"
        />
      );
    case 'project-search-field':
      return <ProjectSearchField showResultCount matchedCount={0} totalCount={0} />;
    case 'search-chip-button':
      return <SearchChipButton label="Mock Project" ariaLabel="Mock search chip" onClick={() => undefined} />;
    case 'search-shortcut-chip-button':
      return <SearchShortcutChipButton type="extify" />;
    case 'project-sort-button':
      return <ProjectSortButton />;
    case 'copy-icon-button':
      return (
        <CopyIconButton text="demo@example.com" />
      );
    case 'typed-external-link':
      return <TypedExternalLink typeLabel="GitHub" title="repo" href="https://github.com" />;
    case 'theme-toggle-button':
      return <ThemeToggleButton />;
    case 'language-segmented-button':
      return <LanguageSegmentedButton />;
    case 'nav-button':
      return (
        <NavButton href="#education" ariaLabel="Education">
          Education
        </NavButton>
      );
    case 'goto-button':
      return (
        <GotoButton ariaLabel="Go to projects" onClick={() => undefined}>
          Go to projects
        </GotoButton>
      );
    case 'card':
      return (
        <Card>
          <span className={styles.structureMuted}>Card</span>
        </Card>
      );
    case 'flip-card':
      return (
        <div className={styles.flipCardStructurePreview}>
          <FlipCard
            front={<span className={styles.structureMuted}>Front</span>}
            back={<span className={styles.structureMuted}>Back</span>}
            ariaLabel="Flip card preview"
            onOpen={() => undefined}
          />
        </div>
      );
    case 'cursor-ring':
      return (
        <CursorRing.Target>
          <span className={styles.structureMuted}>cursor</span>
        </CursorRing.Target>
      );
    case 'field-card':
      return <FieldCard iconName="email" label="Email" value="asdf@gmail.com" />;
    case 'contact-field-card':
      return <ContactFieldCard field="email" />;
    case 'experience-slot-card':
      return (
        <div className={styles.experienceSlotCardDemo}>
          <ExperienceSlotCard
            media={<div className={slotStyles.placeholderImage}>Thumbnail</div>}
            title="Company"
            meta={
              <>
                <span className={slotStyles.position}>Backend Engineer</span>
                <span className={slotStyles.duration}>2023. 03 ~ 2025. 02</span>
              </>
            }
            content={
              <ul className={slotStyles.sectionTitles}>
                <li>
                  <LineFitText text="Payment pipeline redesign" />
                </li>
                <li>
                  <LineFitText text="Search latency -40%" />
                </li>
              </ul>
            }
            footer={
              <GotoButton ariaLabel="Go to projects" onClick={() => undefined}>
                Go to projects
              </GotoButton>
            }
          />
        </div>
      );
    case 'experience-card':
      return (
        <div className={styles.experienceSlotCardDemo}>
          <ExperienceCard experience={GALLERY_BOOSTCAMP} />
        </div>
      );
    case 'project-slot-card':
      return (
        <div className={styles.projectSlotCardDemo}>
          <ProjectSlotCard
            media={<div className={styles.slotDemoProjectMedia}>Slot cover</div>}
            title="Slot Demo App"
            year="2024"
            tags={[
              <TagButton key="demo" name="demo" onClick={() => undefined} ariaLabel="demo" />,
              <TagButton key="slot" name="slot" onClick={() => undefined} ariaLabel="slot" />,
            ]}
            stacks={[
              <StackChipButton key="React" label="React" onClick={() => undefined} ariaLabel="React" />,
            ]}
            back={<Text.Primary>Slot back face</Text.Primary>}
            onOpen={() => undefined}
            ariaLabel="Project slot card preview"
          />
        </div>
      );
    case 'project-card':
      return (
        <div className={styles.projectSlotCardDemo}>
          <ProjectCard project={GALLERY_PS_STUDIO} />
        </div>
      );
    case 'doc-row':
      return (
        <DocRow
          doc={{
            id: 'doc-row-demo',
            title: 'Fitween 릴리즈 노트',
            link: '#',
            chipLabel: 'Fitween',
            source: { searchQuery: 'Fitween' },
          }}
          onChipClick={(e) => e.preventDefault()}
          onNavigate={() => undefined}
        />
      );
    default:
      return null;
  }
}
