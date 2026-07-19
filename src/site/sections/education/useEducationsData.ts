// 언어·버전별 학력 데이터를 로드하는 훅
import EducationRepository from '@repositories/education';
import { useVersionedLoad } from '@hooks/useVersionedLoad';

export interface EducationItem {
  id?: string;
  year: number;
  [key: string]: unknown;
}

export function useEducationsData(): EducationItem[] {
  return useVersionedLoad(async ({ lang, hash }) => {
    const repository = new EducationRepository();
    await repository.load({ lang, hash });
    return [...(repository.all as unknown as EducationItem[])].sort((a, b) => b.year - a.year);
  }, []);
}
