// 언어·버전별 스킬 목록을 로드하는 훅
import SkillRepository from '@repositories/skill';
import { useVersionedLoad } from '@hooks/useVersionedLoad';

export interface SkillItem {
  name: string;
  category: string;
  iconName: string;
}

export function useSkillsData(): SkillItem[] {
  return useVersionedLoad(async ({ lang, hash }) => {
    const repository = new SkillRepository();
    await repository.load({ lang, hash });
    return repository.all as SkillItem[];
  }, []);
}
