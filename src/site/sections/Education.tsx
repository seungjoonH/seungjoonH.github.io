// Education 이력 타임라인 섹션
import type { ReactNode } from 'react';
import { Heading } from '@components/design/heading/Heading';
import { History } from './education/History';
import styles from './education.module.css';
import { buildCls } from '@utils/cssUtil';
import { useEducationsData } from './education/useEducationsData';
import { useEducationScrollFade } from './education/useEducationScrollFade';

interface EducationProps {
  narrow?: boolean;
  shouldFadeIn?: boolean;
}

export function Education({ narrow = false, shouldFadeIn = false }: EducationProps): ReactNode {
  const educations = useEducationsData();
  const { historyRefs } = useEducationScrollFade(educations.length);

  const educationContainerCls = buildCls(
    styles.educationContainer,
    narrow && styles.educationFadeIn,
    narrow && shouldFadeIn && styles.educationFadeInVisible
  );

  return (
    <div className={educationContainerCls}>
      <div className={styles.educationLayout}>
        <div className={styles.educationTitle}>
          <Heading text="Education" align="left" />
        </div>
        <div className={styles.educationContent}>
          <div className="columnContainer">
            {educations.map((edu, index) => (
              <div
                key={edu.id ?? index}
                ref={(el) => {historyRefs.current[index] = el}}
              >
                <History education={edu} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
