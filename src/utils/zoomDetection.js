const ZOOM_HINT_SESSION_KEY = 'portfolio-zoom-hint-shown';
const DESKTOP_MIN_WIDTH = 768;

/** sessionStorage.setItem 실패(예: 비공개 모드) 시에만 사용 */
let zoomHintShownMemory = false;

function isDesktop() {
  return window.innerWidth >= DESKTOP_MIN_WIDTH;
}

function hasAlreadyShownThisSession() {
  if (zoomHintShownMemory) return true;
  try {
    return sessionStorage.getItem(ZOOM_HINT_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function markZoomHintShownThisSession() {
  if (zoomHintShownMemory) return;
  try {
    sessionStorage.setItem(ZOOM_HINT_SESSION_KEY, '1');
  } catch {
    zoomHintShownMemory = true;
  }
}

export function setupZoomDetection(onZoomDetected) {
  let lastZoom = window.devicePixelRatio;

  const handleResize = () => {
    if (!isDesktop()) return;
    if (hasAlreadyShownThisSession()) return;
    const currentZoom = window.devicePixelRatio;
    if (currentZoom === lastZoom) return;
    lastZoom = currentZoom;
    onZoomDetected();
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}
