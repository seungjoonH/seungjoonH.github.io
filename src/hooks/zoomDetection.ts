// 데스크톱 브라우저 줌 변경 감지
import { useZoomHintStore } from '@stores/zoomHintStore';
import { getMobileMaxWidthPx } from '../config';

function isDesktop(): boolean {
  return window.innerWidth > getMobileMaxWidthPx();
}

/**
 * 데스크톱에서 devicePixelRatio 변경(줌)을 감지해 콜백을 호출한다.
 * 이미 세션에 힌트를 보여줬으면 무시한다.
 * @param onZoomDetected - 줌 변경 시 호출할 콜백
 * @returns resize 리스너 제거 함수
 */
export function setupZoomDetection(onZoomDetected: () => void): () => void {
  let lastZoom = window.devicePixelRatio;

  const handleResize = () => {
    if (!isDesktop()) return;
    if (useZoomHintStore.getState().shownThisSession) return;
    const currentZoom = window.devicePixelRatio;
    if (currentZoom === lastZoom) return;
    lastZoom = currentZoom;
    onZoomDetected();
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}
