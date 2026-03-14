import React, { useEffect, useState } from 'react';
import { useConfigStore } from '../../stores/configStore';
import styles from './mainPano.module.css';
import { buildCls } from '../../utils/cssUtil';

const STAGE1_MS = 30;
const STAGE2_MS = 400;
const STAGE3_MS = 1000;

export function MainPano() {
  const [stage, setStage] = useState(0);
  const speedScale = useConfigStore((s) => s.speedScale ?? 1);

  useEffect(() => {
    const scale = Math.max(0.5, Math.min(1.5, Number(speedScale) || 1));
    const t1 = setTimeout(() => { setStage(1); }, STAGE1_MS / scale);
    const t2 = setTimeout(() => { setStage(2); }, STAGE2_MS / scale);
    const t3 = setTimeout(() => { setStage(3); }, STAGE3_MS / scale);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [speedScale]);

  return (
    <div
      className={buildCls(styles.mainPanoContainer, ['', styles.animation1, styles.animation2, styles.noTransition][stage])}
    ></div>
  );
}