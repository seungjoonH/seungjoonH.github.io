// Main 히어로(파노+타이틀+인트로) 섹션
import type { ReactNode } from 'react';
import { MainPano } from '@sections/main/MainPano';
import { Title } from '@sections/main/Title';
import { Introduction } from '@sections/main/Introduction';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import styles from './main.module.css';
import { buildCls } from '@utils/cssUtil';
import { useMainParallax } from './main/hooks/useMainParallax';

export function Main(): ReactNode {
  const { t } = useTranslation();
  const { titleRef, introRef } = useMainParallax();

  return (
    <div className={styles.parallaxContainer}>
      <div className="columnContainer">
        <div className={styles.mainHero}>
          <div className={buildCls('stackContainer', styles.heroStack)}>
            <div className="stackItem">
              <MainPano />
            </div>
            <div className="stackItem">
              <div className={styles.parallaxTitle} ref={titleRef}>
                <Title text={t('main.title')} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.parallaxIntro} ref={introRef}>
          <Introduction text={t('main.introduction')} />
        </div>
      </div>
    </div>
  );
}

export default Main;
