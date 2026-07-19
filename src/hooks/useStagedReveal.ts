// 지연 단계별 stage 숫자를 올리는 공통 reveal 훅
import { useEffect, useState } from 'react';
import { SPEED_SCALE_MAX, SPEED_SCALE_MIN } from '../config';

export interface UseStagedRevealOptions {
  /** 각 단계로 넘어가는 시각(ms). 길이 = 최종 stage 수 */
  delaysMs: number[];
  /** 타이밍을 나눌 배속. 기본 1 */
  speedScale?: number;
}

/**
 * delaysMs[i] 시점에 stage를 i+1로 올린다.
 * Title처럼 1단계면 delaysMs=[1000] → stage 0→1.
 */
export function useStagedReveal({ delaysMs, speedScale = 1 }: UseStagedRevealOptions): number {
  const [stage, setStage] = useState(0);
  const delayKey = delaysMs.join(',');

  useEffect(() => {
    const scale = Math.max(
      SPEED_SCALE_MIN,
      Math.min(SPEED_SCALE_MAX, Number(speedScale) || 1),
    );
    const delays = delayKey.split(',').map(Number);
    const timers = delays.map((ms, index) =>
      setTimeout(() => setStage(index + 1), ms / scale)
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [delayKey, speedScale]);

  return stage;
}
