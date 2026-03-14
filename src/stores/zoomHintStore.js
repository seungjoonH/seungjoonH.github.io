import { create } from 'zustand';

export const useZoomHintStore = create((set) => ({
  visible: false,
  showZoomHint: () => set({ visible: true }),
  dismissZoomHint: () => set({ visible: false }),
}));
