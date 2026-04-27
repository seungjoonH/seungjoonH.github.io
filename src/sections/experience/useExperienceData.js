import { useState, useEffect } from 'react';
import ExperienceRepository from '../../repositories/experience.js';

export function useExperienceData(language) {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const repository = new ExperienceRepository();
    const load = async () => {
      await repository.load(language || 'en');
      setExperiences(repository.all);
    };
    load();
  }, [language]);

  return experiences;
}
