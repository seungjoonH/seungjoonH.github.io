// 경력 카드 뷰포트 페이드 (세로 스크롤 기준 opacity)
import { useEffect, useState, type RefObject } from 'react';
import { fadeOpacity } from '@hooks/viewportFade';
import { useResponsive } from '@hooks/useResponsive';

const MOBILE_IN_VIEW_RATIO = 0.95;
const CARD_FADE_START = 0.7;
const CARD_FADE_END = 0.5;

export function useExperienceCardFade(
  scrollContainerRef: RefObject<HTMLDivElement | null>,
  cardRefs: RefObject<(HTMLDivElement | null)[]>,
  deps: unknown[],
) {
  const { isMobile } = useResponsive();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return undefined;

    const update = () => {
      const cards = cardRefs.current ?? [];
      if (isMobile) {
        const inView = container.getBoundingClientRect().top < window.innerHeight * MOBILE_IN_VIEW_RATIO;
        cards.forEach((card) => {
          if (card) card.style.opacity = inView ? '1' : '0';
        });
        setHidden(!inView);
        return;
      }

      const wh = window.innerHeight;
      cards.forEach((card) => {
        if (!card) return;
        const opacity = fadeOpacity(card.getBoundingClientRect().top, wh, CARD_FADE_START, CARD_FADE_END);
        card.style.opacity = String(opacity);
        if (opacity >= 1) setHidden(false);
        else if (opacity <= 0) setHidden(true);
      });
    };

    window.addEventListener('scroll', update);
    update();
    return () => window.removeEventListener('scroll', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, ...deps]);

  return { hidden };
}
