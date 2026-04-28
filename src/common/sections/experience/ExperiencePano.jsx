import { useEffect, useRef, useState } from 'react';
import styles from './experiencePano.module.css';

export function ExperiencePano() {
  const [leftPosition, setLeftPosition] = useState(0);
  const panoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const panoElement = panoRef.current;
      if (!panoElement) return;

      const rect = panoElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const startScroll = windowHeight * .8;
      const endScroll = windowHeight * .3;

      let newLeft = 0;

      const left = -10;
      const right = 110;

      if (rect.top >= startScroll) newLeft = left;
      else if (rect.top <= endScroll) newLeft = right;
      else newLeft = ((startScroll - rect.top) / (startScroll - endScroll)) * 100;

      setLeftPosition(Math.min(Math.max(newLeft, left), right));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.experiencePanoContainer} ref={panoRef}>
      <div className={styles.panoLine}></div>
      <div className={styles.panoOver} style={{ '--pano-over-left': `${leftPosition}%` }}></div>
    </div>
  );
}