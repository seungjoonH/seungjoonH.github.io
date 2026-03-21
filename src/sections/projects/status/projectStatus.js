/** Canonical status string values (sync with project data `status` field). */
export const PROJECT_STATUS = {
  IN_DEVELOPMENT: 'in-development',
  LIVE: 'live',
  MAINTAINED: 'maintained',
  SUPPORT_ENDED: 'support-ended',
  CONTRIBUTION_ENDED: 'contribution-ended',
  ENDED: 'ended',
};

/** Lower number = higher in list when sorting by `sort:status`. */
export const PROJECT_STATUS_SORT_RANK = {
  [PROJECT_STATUS.IN_DEVELOPMENT]: 0,
  [PROJECT_STATUS.LIVE]: 1,
  [PROJECT_STATUS.MAINTAINED]: 2,
  [PROJECT_STATUS.SUPPORT_ENDED]: 3,
  [PROJECT_STATUS.CONTRIBUTION_ENDED]: 4,
  [PROJECT_STATUS.ENDED]: 5,
};

const KNOWN = new Set(Object.values(PROJECT_STATUS));

export function isKnownProjectStatus(status) {
  return status != null && KNOWN.has(String(status));
}

/** Unknown statuses sort after all known (stable fallback). */
export function getProjectStatusRank(status) {
  if (status == null || status === '') return 999;
  const key = String(status);
  if (PROJECT_STATUS_SORT_RANK[key] === undefined) return 998;
  return PROJECT_STATUS_SORT_RANK[key];
}

/** i18n key under `project.status` (camelCase). */
export function projectStatusTranslationKey(status) {
  const map = {
    [PROJECT_STATUS.IN_DEVELOPMENT]: 'inDevelopment',
    [PROJECT_STATUS.LIVE]: 'live',
    [PROJECT_STATUS.MAINTAINED]: 'maintained',
    [PROJECT_STATUS.SUPPORT_ENDED]: 'supportEnded',
    [PROJECT_STATUS.CONTRIBUTION_ENDED]: 'contributionEnded',
    [PROJECT_STATUS.ENDED]: 'ended',
  };
  return map[String(status)] ?? null;
}

/** CSS module class token (no hyphens) for StatusChip backgrounds. */
const CHIP_VARIANT_CLASS = {
  [PROJECT_STATUS.IN_DEVELOPMENT]: 'inDevelopment',
  [PROJECT_STATUS.LIVE]: 'live',
  [PROJECT_STATUS.MAINTAINED]: 'maintained',
  [PROJECT_STATUS.SUPPORT_ENDED]: 'supportEnded',
  [PROJECT_STATUS.CONTRIBUTION_ENDED]: 'contributionEnded',
  [PROJECT_STATUS.ENDED]: 'ended',
};

export function projectStatusChipVariantClass(status) {
  if (!isKnownProjectStatus(status)) return 'unknown';
  return CHIP_VARIANT_CLASS[String(status)] ?? 'unknown';
}
