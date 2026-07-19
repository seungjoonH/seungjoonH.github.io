// 프로젝트 상세 모달
import type { ReactNode, RefObject } from 'react';
import { useA11y } from '@hooks/useA11y';
import { ProjectDetailContent } from './ProjectDetailContent';
import ProjectModel from '../../../models/project';
import { Modal } from '@components/interactive/modal/Modal';
import { getModalCloseDelayMs } from '../../../config';

interface ProjectDetailModalProps {
  project: ProjectModel;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function ProjectDetailModal({ project, onClose, returnFocusRef }: ProjectDetailModalProps): ReactNode {
  const a11y = useA11y();
  const title = a11y('project.detailDialog', { title: project.title });

  return (
    <Modal
      titleId="project-detail-title"
      title={title}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      closeDelayMs={getModalCloseDelayMs()}
    >
      <ProjectDetailContent project={project} variant="modal" />
    </Modal>
  );
}
