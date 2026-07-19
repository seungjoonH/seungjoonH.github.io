// 경력 상세 모달
import type { ReactNode, RefObject } from 'react';
import { useA11y } from '@hooks/useA11y';
import { ExperienceDetailContent } from './ExperienceDetailContent';
import ExperienceModel from '../../../models/experience';
import { Modal } from '@components/interactive/modal/Modal';
import { getModalCloseDelayMs } from '../../../config';

interface ExperienceDetailModalProps {
  experience: ExperienceModel;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function ExperienceDetailModal({
  experience,
  onClose,
  returnFocusRef,
}: ExperienceDetailModalProps): ReactNode {
  const a11y = useA11y();
  const title = a11y('experience.detailDialog', { company: experience.company });

  return (
    <Modal
      titleId="experience-detail-title"
      title={title}
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      closeDelayMs={getModalCloseDelayMs()}
      fitContent
    >
      <ExperienceDetailContent experience={experience} />
    </Modal>
  );
}
