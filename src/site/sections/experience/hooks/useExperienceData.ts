// 언어·버전별 경력 데이터를 ExperienceRepository에서 로드하는 훅
import ExperienceRepository from '@repositories/experience';
import type ExperienceModel from '@models/experience';
import { useVersionedLoad } from '@hooks/useVersionedLoad';

export function useExperienceData(): ExperienceModel[] {
  return useVersionedLoad(async ({ lang, hash }) => {
    const repository = new ExperienceRepository();
    await repository.load({ lang, hash });
    return repository.all;
  }, []);
}
