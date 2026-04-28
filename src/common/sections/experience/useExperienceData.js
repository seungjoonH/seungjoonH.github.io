import { useState, useEffect } from 'react';
import ExperienceRepository from '../../../repositories/experience.js';
import { useVersionHash } from '../../../versioning/VersionContext.jsx';

export function useExperienceData(language) {
  const [experiences, setExperiences] = useState([]);
  const versionHash = useVersionHash();

  useEffect(() => {
    const repository = new ExperienceRepository();
    const load = async () => {
      await repository.load(language || 'en', versionHash);
      setExperiences(repository.all);
    };
    load();
  }, [language, versionHash]);

  return experiences;
}
