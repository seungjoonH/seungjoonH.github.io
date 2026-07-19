// ProjectModel을 ProjectSlotCard 슬롯·상세 모달에 연결하는 Feature 카드
import { useRef, useMemo, useState, useEffect, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import ProjectModel from '@models/project';
import { Icon, SvgIcon } from '@components/design/icon/Icon';
import { ProjectSlotCard } from '@components/composed/card/ProjectSlotCard';
import { StackChipButton } from '@components/composed/chip/StackChipButton';
import { TagButton } from '@components/interactive/tag/TagButton';
import { ProjectDetailModal } from '@sections/projects/ProjectDetailModal';
import { ProjectDetailContent } from '@sections/projects/ProjectDetailContent';
import { StatusChip } from '@sections/projects/StatusChip';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import { useProjectCardFlipStore } from '@stores/projectCardFlipStore';
import { useResponsive } from '@hooks/useResponsive';
import { useConfigStore } from '@stores/configStore';
import { useA11y } from '@hooks/useA11y';
import { useAnalytics } from '@hooks/useAnalytics';
import config from '../../../config';
import { getMaxVisibleChips } from '@sections/projects/getMaxVisibleChips';
import { parseQuery } from '@sections/projects/search/parseQuery';
import { isStackMatchedByQuery } from '@sections/projects/search/filterProjects';
import { getStackIconName, normalizeStackToken } from '@sections/projects/search/stackMapping';
import { highlightText, getHighlightTerms, getEffectiveTagsSorted, getEffectiveStacksSorted } from '@sections/projects/search/highlight';
import styles from '@sections/projects/projectCard.module.css';

interface ProjectCardProps {
  project: ProjectModel;
  showAll?: boolean;
}

export function ProjectCard({ project, showAll = false }: ProjectCardProps): ReactNode {
  const a11y = useA11y();
  const { trackProjectClick, trackSkillClick } = useAnalytics();
  const rawQuery = useProjectSearchStore((s) => s.rawQuery);
  const appendShortcutToQuery = useProjectSearchStore((s) => s.appendShortcutToQuery);
  const { type: breakpointType, isMobile } = useResponsive();
  const typographyScale = useConfigStore((s) => s.typographyScale) ?? config.typography.scale;
  const { maxTags: maxVisibleTags, maxStacks: maxVisibleStacks } = getMaxVisibleChips(breakpointType, typographyScale);
  const setFlippedProjectId = useProjectCardFlipStore((s) => s.setFlippedProjectId);
  const [modalOpen, setModalOpen] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const projectId = project.id != null ? String(project.id) : null;

  // flippedProjectId 전체 구독 금지 — 자기 카드 flip 여부만 구독해야 다른 카드가 같이 리렌더되지 않음
  const isThisCardFlipped = useProjectCardFlipStore(
    (s) => projectId != null && s.flippedProjectId === projectId,
  );

  const parsedClauses = useMemo(
    () => (rawQuery ? parseQuery(String(rawQuery).trim(), normalizeStackToken) : []),
    [rawQuery]
  );
  const { titleTerms } = useMemo(
    () => getHighlightTerms(parsedClauses),
    [parsedClauses]
  );
  const effectiveTags = useMemo(
    () => getEffectiveTagsSorted(project.tags || [], project.tagNames || [], parsedClauses),
    [project.tags, project.tagNames, parsedClauses]
  );
  const effectiveStacks = useMemo(
    () => getEffectiveStacksSorted(project.techStacks || [], project.techStackNames || [], parsedClauses),
    [project.techStacks, project.techStackNames, parsedClauses]
  );

  const coverImage = project.coverImage != null ? String(project.coverImage) : '';
  useEffect(() => setThumbnailError(false), [coverImage]);
  const showThumbnail = Boolean(coverImage) && !thumbnailError;
  const visibleStacks = effectiveStacks.stacks.slice(0, maxVisibleStacks);

  const trackProjectOpen = () => {
    const hasActiveSearch = String(rawQuery || '').trim().length > 0;
    trackProjectClick(project.id != null ? String(project.id) : undefined, { withSearchResult: hasActiveSearch });
  };

  const handleCardOpen = () => {
    trackProjectOpen();
    setModalOpen(true);
  };

  const handleFlippedChange = (nextFlipped: boolean) => {
    if (nextFlipped) trackProjectOpen();
    setFlippedProjectId(nextFlipped ? projectId : null);
  };

  const flipProps = isMobile
    ? { flipped: isThisCardFlipped, onFlippedChange: handleFlippedChange }
    : {};

  const handleStackClick = (stack: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    trackSkillClick(stack);
    appendShortcutToQuery(`stack:"${stack}"`);
  };

  const handleTagClick = (tag: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    appendShortcutToQuery(`#${tag}`);
  };

  let media: ReactNode;
  if (showThumbnail) {
    media = coverImage.toLowerCase().endsWith('.svg') ? (
      <span className={styles.thumbnail}>
        <SvgIcon src={coverImage} onError={() => setThumbnailError(true)} />
      </span>
    ) : (
      <img
        src={coverImage}
        alt=""
        className={styles.thumbnail}
        onError={() => setThumbnailError(true)}
      />
    );
  } else {
    media = (
      <span className={styles.thumbnailPlaceholder} aria-hidden="true">
        {project.title?.slice(0, 1) || '?'}
      </span>
    );
  }

  return (
    <>
      <ProjectSlotCard
        ref={cardRef}
        badge={
          showAll && project.hidden ? (
            <span className={styles.hiddenBadge} aria-hidden="true">
              <Icon.Primary name="eye-open" size="small" />
            </span>
          ) : null
        }
        status={
          project.status ? (
            <span className={styles.thumbnailStatusChip}>
              <StatusChip type={project.status} />
            </span>
          ) : null
        }
        media={media}
        title={
          titleTerms.length
            ? highlightText(project.title || '', titleTerms, styles.highlight)
            : (project.title || '')
        }
        year={project.yearLabel}
        tags={effectiveTags.tags.slice(0, maxVisibleTags).map((tag) => (
          <TagButton
            key={tag}
            name={tag}
            onClick={(e) => handleTagClick(tag, e)}
            ariaLabel={a11y('project.searchByTag', { tag })}
          />
        ))}
        stacks={visibleStacks.map((stack) => (
          <StackChipButton
            key={stack}
            label={stack}
            iconName={getStackIconName(stack)}
            matched={isStackMatchedByQuery(stack, parsedClauses, normalizeStackToken)}
            onClick={(e) => handleStackClick(stack, e)}
            ariaLabel={a11y('project.searchByStack', { stack })}
          />
        ))}
        back={<ProjectDetailContent project={project} variant="card" />}
        {...flipProps}
        onOpen={handleCardOpen}
        ariaLabel={a11y(`project.card${isMobile ? 'Mobile' : 'Desktop'}`, { title: project.title || '' })}
        onContextMenu={(e) => isMobile && e.preventDefault()}
      />

      {modalOpen && createPortal(
        <ProjectDetailModal
          project={project}
          onClose={() => setModalOpen(false)}
          returnFocusRef={cardRef}
        />,
        document.body
      )}
    </>
  );
}
