// 프로젝트 상태 칩
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PROJECT_STATUS,
  projectStatusTranslationKey,
  type ProjectStatus,
} from '@sections/projects/status/projectStatus';
import { Chip } from '@components/design/chip/Chip';
import type { StatusChipProps } from './type';

const EMPHASIS_STATUSES = new Set<ProjectStatus>([
  PROJECT_STATUS.IN_DEVELOPMENT,
  PROJECT_STATUS.LIVE,
  PROJECT_STATUS.MAINTAINED,
]);

function statusChipVariant(type: string | null) {
  return type && EMPHASIS_STATUSES.has(type as ProjectStatus) ? Chip.Secondary : Chip.Outlined;
}

export function StatusChip({ type }: StatusChipProps): ReactNode {
  const { t } = useTranslation();
  const i18nKey = projectStatusTranslationKey(type);
  if (!i18nKey) return null;

  const ChipVariant = statusChipVariant(type);
  return <ChipVariant label={t(`project.status.${i18nKey}`)} size="small" shape="full" />;
}
