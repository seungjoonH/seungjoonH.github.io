// 스크롤에 따라 좌우로 이동하는 경력 섹션 파노라마 배경
import { useEffect, useRef } from 'react';
import styles from './experiencePano.module.css';
import { setCssVars } from '@hooks/useCssVars';

export function ExperiencePano() {
  const panoRef = useRef<HTMLDivElement | null>(null);
  const overRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const panoElement = panoRef.current;
      if (!panoElement) return;

      const rect = panoElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startScroll = windowHeight * 0.8;
      const endScroll = windowHeight * 0.3;
      const left = -10;
      const right = 110;

      let newLeft = 0;
      if (rect.top >= startScroll) newLeft = left;
      else if (rect.top <= endScroll) newLeft = right;
      else newLeft = ((startScroll - rect.top) / (startScroll - endScroll)) * 100;

      setCssVars(overRef.current, {
        '--pano-over-left': `${Math.min(Math.max(newLeft, left), right)}%`,
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.experiencePanoContainer} ref={panoRef}>
      <div className={styles.panoLine} />
      <div className={styles.panoOver} ref={overRef} />
    </div>
  );
}
