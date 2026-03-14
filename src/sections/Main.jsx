import React, { useRef, useState, useEffect } from 'react';
import { MainPano } from '@sections/main/MainPano';
import { Title } from '@sections/main/Title';
import { Introduction } from '@sections/main/Introduction';

import { useTranslation } from 'react-i18next';
import '../i18n';
import styles from './main.module.css';
import { buildCls } from '../utils/cssUtil';

const Languages = {
  KOREAN: 'ko',
  ENGLISH: 'en',
};

class Language {
  constructor(value) {
    if (!Object.values(Languages).includes(value)) {
      throw new Error(`Invalid language: ${value}`);
    }
    this.value = value;
  }
  get current() { return this.value; }
  
  inverse() {
    this.value = this.value === Languages.KOREAN ? Languages.ENGLISH : Languages.KOREAN;
    return this.value;
  }

  toggle() { this.value = this.inverse(); }

  get key() {
    return Object.keys(Languages)
        .find(key => Languages[key] === this.value);
  }
};

export function Main() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(new Language(Languages.ENGLISH));
  const [opacity, setOpacity] = useState(1);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const introRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 500;
      const newOpacity = Math.max(1 - scrollY / maxScroll, 0);
      setOpacity(newOpacity);

      const title = titleRef.current;
      const intro = introRef.current;
      if (!title || !intro || !containerRef.current) return;

      title.style.transform = `translateY(${scrollY * 0.5}px)`;
      intro.style.transform = `translateY(${-scrollY * 0.3}px)`;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const stackStyle = {
    '--stack-height': 'calc(100vw / var(--pano-ratio))',
    '--stack-z-0': 0,
    '--stack-z-1': 1,
  };
  const introStyle = { '--parallax-intro-opacity': opacity };

  return (
    <div className={buildCls(styles.parallaxContainer)} ref={containerRef}>
      <div className="columnContainer">
        <div className={buildCls(styles.mainHero)}>
          <div className="stackContainer" style={stackStyle}>
            <div className="stackItem"><MainPano /></div>
            <div className="stackItem">
              <div className={buildCls(styles.parallaxTitle)} ref={titleRef}>
                <Title text={t('main.title')} />
              </div>
            </div>
          </div>
        </div>
        <div className={buildCls(styles.parallaxIntro)} style={introStyle} ref={introRef}>
          <Introduction text={t('main.introduction')} />
        </div>
      </div>
    </div>
  );
}