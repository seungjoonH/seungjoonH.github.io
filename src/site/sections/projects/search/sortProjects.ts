// 정렬 모드별 프로젝트 목록 정렬
import type ProjectModel from '@models/project';
import { getProjectStatusRank } from '../status/projectStatus';
import type { SortMode } from './stripSort';

function toMonthValue(project: ProjectModel): number {
  const start = project?.period?.start || '';
  const [year, month] = String(start).split('-');
  if (!year || !month) return Number.MIN_SAFE_INTEGER;
  const y = Number(year);
  const m = Number(month);
  if (Number.isNaN(y) || Number.isNaN(m)) return Number.MIN_SAFE_INTEGER;
  return y * 100 + m;
}

function isPresent(project: ProjectModel): boolean {
  return String(project?.period?.end || '').toLowerCase() === 'present';
}

function compareId(a: ProjectModel, b: ProjectModel): number {
  const na = a?.id;
  const nb = b?.id;
  if (typeof na === 'number' && typeof nb === 'number') return na - nb;
  return String(na ?? '').localeCompare(String(nb ?? ''), undefined, { numeric: true });
}

export function sortProjectsByMode(projects: ProjectModel[], mode: SortMode): ProjectModel[] {
  if (!mode || !Array.isArray(projects)) return projects;
  const list = [...projects];

  if (mode === 'recent') {
    list.sort((a, b) => {
      const diff = toMonthValue(b) - toMonthValue(a);
      if (diff !== 0) return diff;
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
