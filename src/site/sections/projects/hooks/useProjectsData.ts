// 언어/버전별 프로젝트 목록을 최신순으로 로드
import ProjectRepository from '@repositories/project';
import type ProjectModel from '@models/project';
import { useVersionedLoad } from '@hooks/useVersionedLoad';

function toMonthValue(project: { period?: { start?: string }; id?: string | number }): number {
  const start = project.period?.start || '';
  const [year, month] = start.split('-');
  if (!year || !month) return Number.MIN_SAFE_INTEGER;
  const y = Number(year);
  const m = Number(month);
  if (Number.isNaN(y) || Number.isNaN(m)) return Number.MIN_SAFE_INTEGER;
  return y * 100 + m;
}

/** 현재 언어·버전에 맞는 프로젝트 목록을 최신순으로 반환한다. */
export function useProjectsData(): ProjectModel[] {
  return useVersionedLoad(async ({ lang, hash }) => {
    const repository = new ProjectRepository();
    await repository.load({ lang, hash });
    return [...repository.all].sort((a, b) => {
      const diff = toMonthValue(b) - toMonthValue(a);
      if (diff !== 0) return diff;
      return Number(b.id || 0) - Number(a.id || 0);
    });
  }, []);
}
