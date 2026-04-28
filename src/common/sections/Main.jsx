import { useRef, useState, useEffect } from 'react';
import { MainPano } from '@sections/main/MainPano';
import { Title } from '@sections/main/Title';
import { Introduction } from '@sections/main/Introduction';

import { useTranslation } from 'react-i18next';
import '../../i18n.js';
import styles from './main.module.css';
import { buildCls } from '../../utils/cssUtil';

const MAIN_SCROLL_FADE_MAX_PX = 500;
const PARALLAX_TITLE_SCROLL_RATIO = 0.5;
const PARALLAX_INTRO_SCROLL_RATIO = 0.3;

export function Main() {
  const { t } = useTranslation();
  const [opacity, setOpacity] = useState(1);
  const titleRef = useRef(null);
  const introRef = useRef(null);

  useEffect(() => {
    const handleScrollOpacity = () => {
      const scrollY = window.scrollY;
      setOpacity(Math.max(1 - scrollY / MAIN_SCROLL_FADE_MAX_PX, 0));
    };
    window.addEventListener('scroll', handleScrollOpacity);
    return () => window.removeEventListener('scroll', handleScrollOpacity);
  }, []);

  useEffect(() => {
    const handleScrollParallax = () => {
      const scrollY = window.scrollY;
      const title = titleRef.current;
      const intro = introRef.current;
      if (!title || !intro) return;
      title.style.setProperty('--parallax-title-offset-y', `${scrollY * PARALLAX_TITLE_SCROLL_RATIO}px`);
      intro.style.setProperty('--parallax-intro-offset-y', `${-scrollY * PARALLAX_INTRO_SCROLL_RATIO}px`);
    };
    window.addEventListener('scroll', handleScrollParallax);
    return () => window.removeEventListener('scroll', handleScrollParallax);
  }, []);

  const stackStyle = {
    '--stack-height': 'calc(100vw / var(--pano-ratio))',
    '--stack-z-0': 0,
    '--stack-z-1': 1,
  };
  const introStyle = { '--parallax-intro-opacity': opacity };
  const parallaxContainerCls = buildCls(styles.parallaxContainer);
  const mainHeroCls = buildCls(styles.mainHero);
  const parallaxTitleCls = buildCls(styles.parallaxTitle);
  const parallaxIntroCls = buildCls(styles.parallaxIntro);

  return (
    <div className={parallaxContainerCls}>
      <div className="columnContainer">
        <div className={mainHeroCls}>
          <div className="stackContainer" style={stackStyle}>
            <div className="stackItem"><MainPano /></div>
            <div className="stackItem">
              <div className={parallaxTitleCls} ref={titleRef}>
                <Title text={t('main.title')} />
              </div>
            </div>
          </div>
        </div>
        <div className={parallaxIntroCls} style={introStyle} ref={introRef}>
          <Introduction text={t('main.introduction')} />
        </div>
      </div>
    </div>
  );
}

export default Main;