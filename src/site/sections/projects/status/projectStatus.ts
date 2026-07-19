// 프로젝트 상태 상수·정렬 순위·i18n 키 매핑
export const PROJECT_STATUS = {
  IN_DEVELOPMENT: 'in-development',
  LIVE: 'live',
  MAINTAINED: 'maintained',
  SUPPORT_ENDED: 'support-ended',
  CONTRIBUTION_ENDED: 'contribution-ended',
  ENDED: 'ended',
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

const STATUS_META: Record<
  ProjectStatus,
  { rank: number; i18nKey: string }
> = {
  [PROJECT_STATUS.IN_DEVELOPMENT]: { rank: 0, i18nKey: 'inDevelopment' },
  [PROJECT_STATUS.LIVE]: { rank: 1, i18nKey: 'live' },
  [PROJECT_STATUS.MAINTAINED]: { rank: 2, i18nKey: 'maintained' },
  [PROJECT_STATUS.SUPPORT_ENDED]: { rank: 3, i18nKey: 'supportEnded' },
  [PROJECT_STATUS.CONTRIBUTION_ENDED]: {
    rank: 4,
    i18nKey: 'contributionEnded',
  },
  [PROJECT_STATUS.ENDED]: { rank: 5, i18nKey: 'ended' },
};

function asProjectStatus(status: string | null): ProjectStatus | null {
  if (!status) return null;
  return status in STATUS_META ? (status as ProjectStatus) : null;
}

export function isKnownProjectStatus(status: string | null): boolean {
  return asProjectStatus(status) != null;
}

export function getProjectStatusRank(status: string | null): number {
  if (status == null || status === '') return 999;
  return STATUS_META[status as ProjectStatus]?.rank ?? 998;
}

export function projectStatusTranslationKey(status: string | null): string | null {
  return asProjectStatus(status) ? STATUS_META[status as ProjectStatus].i18nKey : null;
}
