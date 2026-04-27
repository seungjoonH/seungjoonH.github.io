import { useEffect, useState, useRef } from 'react';
import EducationRepository from '../repositories/education.js';
import { Header } from '@components/layout/Header';
import { useConfigStore } from '../stores/configStore';
import { History } from './education/History';
import styles from './education.module.css';
import { buildCls } from '../utils/cssUtil';

const HISTORY_FADE_START_RATIO = 0.8;
const HISTORY_FADE_END_RATIO = 0.5;
const EDUCATION_COLUMN_GAP_PX = 40;

export function Education({ narrow = false, shouldFadeIn = false }) {
  const language = useConfigStore((s) => s.language);
  const [educations, setEducations] = useState([]);
  const historyRefs = useRef([]);

  useEffect(() => {
    const repository = new EducationRepository();

    const fetchData = async () => {
      await repository.load(language || 'en');
      const sorted = [...repository.all].sort((a, b) => b.year - a.year);
      setEducations(sorted);
    };

    fetchData();
  }, [language]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      historyRefs.current.forEach((history, index) => {
        if (!history) return;

        const rect = history.getBoundingClientRect();
        const startFade = windowHeight * HISTORY_FADE_START_RATIO;
        const endFade = windowHeight * HISTORY_FADE_END_RATIO;
        let opacity = 0;

        if (rect.top <= endFade) opacity = 1;
        else if (rect.top > startFade) opacity = 0;
        else opacity = 1 - (rect.top - endFade) / (startFade - endFade);

        history.style.opacity = opacity;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [educations]);

  const educationContainerCls = buildCls(
    styles.educationContainer,
    narrow && styles.educationFadeIn,
    narrow && shouldFadeIn && styles.educationFadeInVisible
  );

  return (
    <div className={educationContainerCls}>
      <div className={styles.educationLayout}>
        <div className={styles.educationTitle}>
          <Header text="Education" align="left" />
        </div>
        <div className={styles.educationContent}>
          <div className={styles.educationList}>
            <div className="columnContainer" style={{ '--column-gap': `${EDUCATION_COLUMN_GAP_PX}px` }}>
              {educations.map((education, index) => (
                <div
                  key={education.id ?? index}
                  ref={(el) => (historyRefs.current[index] = el)}
                  className={styles.historyItem}
                >
                  <History education={education} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}