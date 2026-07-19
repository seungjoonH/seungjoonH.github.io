// 경력 카드 가로 스크롤·스냅·페이드 오케스트레이션
import { useRef } from 'react';
import type ExperienceModel from '@models/experience';
import { useResponsive } from '@hooks/useResponsive';
import { useExperienceCardFade } from './useExperienceCardFade';
import { useExperienceSnap } from './useExperienceSnap';

export function useExperienceScroll(experiences: ExperienceModel[]) {
  const { type } = useResponsive();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const deps = [experiences, type];

  const { hidden } = useExperienceCardFade(scrollContainerRef, cardRefs, deps);
  const snap = useExperienceSnap(scrollContainerRef, cardRefs, experiences.length, deps);

  return {
    scrollContainerRef,
    cardRefs,
    hidden,
    ...snap,
  };
}
