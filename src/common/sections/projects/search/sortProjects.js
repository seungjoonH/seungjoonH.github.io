import { getProjectStatusRank } from '../status/projectStatus';

function toMonthValue(project) {
  const start = project?.period?.start || '';
  const [year, month] = String(start).split('-');
  if (!year || !month) return Number.MIN_SAFE_INTEGER;
  const y = Number(year);
  const m = Number(month);
  if (Number.isNaN(y) || Number.isNaN(m)) return Number.MIN_SAFE_INTEGER;
  return y * 100 + m;
}

function isPresent(project) {
  return String(project?.period?.end || '').toLowerCase() === 'present';
}

function compareId(a, b) {
  const na = a?.id;
  const nb = b?.id;
  if (typeof na === 'number' && typeof nb === 'number') return na - nb;
  return String(na ?? '').localeCompare(String(nb ?? ''), undefined, { numeric: true });
}

/** @param {'recent' | 'oldest' | 'status' | null | undefined} mode */
export function sortProjectsByMode(projects, mode) {
  if (!mode || !Array.isArray(projects)) return projects;
  const list = [...projects];

  if (mode === 'recent') {
    list.sort((a, b) => {
      const diff = toMonthValue(b) - toMonthValue(a);
      if (diff !== 0) return diff;
      // Same start month: ongoing (present) above finished
      const presentDiff = (isPresent(b) ? 1 : 0) - (isPresent(a) ? 1 : 0);
      if (presentDiff !== 0) return presentDiff;
      return compareId(b, a);
    });
    return list;
  }

  if (mode === 'oldest') {
    list.sort((a, b) => {
      const diff = toMonthValue(a) - toMonthValue(b);
      if (diff !== 0) return diff;
      const presentDiff = (isPresent(a) ? 1 : 0) - (isPresent(b) ? 1 : 0);
      if (presentDiff !== 0) return presentDiff;
      return compareId(a, b);
    });
    return list;
  }

  if (mode === 'status') {
    list.sort((a, b) => {
      const rd = getProjectStatusRank(a.status) - getProjectStatusRank(b.status);
      if (rd !== 0) return rd;
      const md = toMonthValue(b) - toMonthValue(a);
      if (md !== 0) return md;
      return compareId(b, a);
    });
    return list;
  }

  return list;
}
