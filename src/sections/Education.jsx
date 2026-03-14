import React, { useEffect, useState, useRef } from 'react';
import EducationRepository from '../repositories/education.js';
import { Header } from '@components/layout/Header';
import { useConfigStore } from '../stores/configStore';
import { History } from './education/History';
import styles from './education.module.css';
import { buildCls } from '../utils/cssUtil';

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
        const startFade = windowHeight * 0.8; 
        const endFade = windowHeight * 0.5; 
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

  return (
    <div className={buildCls(styles.educationContainer, narrow && styles.educationFadeIn, narrow && shouldFadeIn && styles.educationFadeInVisible)}>
      <div className={styles.educationLayout}>
        <Header text="Education" align="left" className={styles.educationTitle} />
        <div className={styles.educationContent}>
          <div className={styles.educationList}>
            <div className="columnContainer" style={{ '--column-gap': '40px' }}>
              {educations.map((education, index) => (
                <div
                  key={index}
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