// Experience 카드용 프로젝트 바로가기 (검색 쿼리 + #project 스크롤)
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11y } from '@hooks/useA11y';
import { GotoButton } from '@components/interactive/button/GotoButton';
import { useProjectSearchStore } from '@stores/projectSearchStore';

interface GotoProjectsProps {
  projectSearchQuery?: string | null;
}

export function GotoProjects({ projectSearchQuery }: GotoProjectsProps): ReactNode {
  const { t } = useTranslation();
  const a11y = useA11y();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);

  const handleClick = () => {
    if (projectSearchQuery) setQueryFromShortcut(projectSearchQuery);
    const el = document.getElementById('project');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <GotoButton onClick={handleClick} ariaLabel={a11y('experience.toProjects')}>
      {t('experience.toProjectLink')}
    </GotoButton>
  );
}
