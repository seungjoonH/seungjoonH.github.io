import { useEffect } from 'react';
import { setupZoomDetection } from '../utils/zoomDetection';
import { useZoomHintStore } from '../stores/zoomHintStore';

export function useZoomDetection() {
  const showZoomHint = useZoomHintStore((s) => s.showZoomHint);

  useEffect(() => {
    return setupZoomDetection(showZoomHint);
  }, [showZoomHint]);
}
