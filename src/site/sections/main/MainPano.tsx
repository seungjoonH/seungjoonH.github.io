// Main 파노라마 배경의 staged CSS 애니메이션
import type { ReactNode } from 'react';
import { useConfigStore } from '@stores/configStore';
import styles from './mainPano.module.css';
import { buildCls } from '@utils/cssUtil';
import { useStagedReveal } from '@hooks/useStagedReveal';

const PANO_REVEAL_DELAYS_MS = [30, 400, 1000];
const STAGE_CLASS_BY_INDEX = ['', styles.animation1, styles.animation2, styles.noTransition] as const;

export function MainPano(): ReactNode {
  const speedScale = useConfigStore((s) => s.speedScale);
  const stage = useStagedReveal({ delaysMs: PANO_REVEAL_DELAYS_MS, speedScale });
  const stageClass = STAGE_CLASS_BY_INDEX[stage] ?? STAGE_CLASS_BY_INDEX[STAGE_CLASS_BY_INDEX.length - 1];
  const mainPanoContainerCls = buildCls(styles.mainPanoContainer, stageClass);

  return <div className={mainPanoContainerCls} />;
}

export default MainPano;
