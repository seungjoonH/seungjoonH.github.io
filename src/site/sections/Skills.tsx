// 스킬 섹션 — SkillChipButton으로 검색 단축어 주입 + skill:click 트래킹
import type { ReactNode } from 'react';
import { Heading } from '@components/design/heading/Heading';
import { SkillChipButton } from '@components/composed/chip/SkillChipButton';
import { useA11y } from '@hooks/useA11y';
import { useAnalytics } from '@hooks/useAnalytics';
import { useProjectSearchStore } from '@stores/projectSearchStore';
import styles from './skills.module.css';
import { useSkillsData } from './skills/useSkillsData';
import { useSkillsScrollReveal } from './skills/useSkillsScrollReveal';

export function Skills(): ReactNode {
  const a11y = useA11y();
  const skills = useSkillsData();
  const { trackSkillClick } = useAnalytics();
  const setQueryFromShortcut = useProjectSearchStore((s) => s.setQueryFromShortcut);

  const groupedSkills = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
  const groupedEntries = Object.entries(groupedSkills);
  const { categoryRefs } = useSkillsScrollReveal(groupedEntries.length);

  return (
    <div className={styles.skillsContainer}>
      <div className={styles.skillsLayout}>
        <div className={styles.skillsTitle}>
          <Heading text="Skills" align="left" />
        </div>
        <div className={styles.skillsContent}>
          <div className={styles.skillsGroup}>
            <div className="columnContainer">
              {groupedEntries.map(([category, skillList], index) => (
                <div
                  key={category}
                  className={styles.skillsCategory}
                  ref={(el) => {
                    categoryRefs.current[index] = el;
                  }}
                >
                  <h3>{category}</h3>
                  <div className={styles.skillsList}>
                    {skillList.map((skill, i) => (
                      <SkillChipButton
                        key={i}
                        label={skill.name}
                        iconName={skill.iconName}
                        ariaLabel={a11y('skills.tagSearch', { name: skill.name })}
                        onClick={() => {
                          trackSkillClick(skill.name);
                          setQueryFromShortcut(`stack:"${skill.name}"`);
                        }}
                      />
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

export default Skills;
