import React, { useEffect, useRef, useState } from 'react';
import { Header } from '@components/layout/Header';
import { Tag } from './skills/Tag.jsx';
import SkillRepository from '../repositories/skill.js';
import { useConfigStore } from '../stores/configStore';
import styles from './skills.module.css';

export function Skills() {
  const language = useConfigStore((s) => s.language);
  const [skills, setSkills] = useState([]);
  const categoryRefs = useRef([]);

  useEffect(() => {
    const repository = new SkillRepository();

    const fetchData = async () => {
      await repository.load(language || 'en');
      setSkills(repository.all);
    };

    fetchData();
  }, [language]);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});
  const groupedEntries = Object.entries(groupedSkills);

  useEffect(() => {
    const handleScroll = () => {
      const rows = categoryRefs.current.filter(Boolean);
      if (rows.length === 0) return;

      const firstRect = rows[0].getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const start = windowHeight * 0.76;
      const end = windowHeight * 0.28;
      const rawProgress = (start - firstRect.top) / (start - end);
      const progress = Math.max(0, Math.min(1, rawProgress));

      const segmentLength = 2 / (rows.length + 1);
      const segmentStride = segmentLength * 0.5;

      rows.forEach((row, index) => {
        const rowStart = index * segmentStride;
        const rowProgress = Math.max(0, Math.min(1, (progress - rowStart) / segmentLength));
        const eased = 1 - ((1 - rowProgress) ** 2);
        const translateX = (1 - eased) * 220;
        const opacity = eased;

        row.style.transform = `translate3d(${translateX}px, 0, 0)`;
        row.style.opacity = `${opacity}`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [groupedEntries.length]);

  return (
    <div className={styles.skillsContainer}>
      <div className={styles.skillsLayout}>
        <Header text="Skills" align="left" className={styles.skillsTitle} />
        <div className={styles.skillsContent}>
          <div className={styles.skillsGroup}>
          <div className="columnContainer" style={{ '--column-gap': '20px' }}>
            {groupedEntries.map(([category, skillList], index) => (
              <div
                key={category}
                className={styles.skillsCategory}
                ref={(el) => { categoryRefs.current[index] = el; }}
              >
                <h3>{category}</h3>
                <div className={styles.skillsList}>
                  {skillList.map((skill, index) => (
                    <Tag key={index} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}