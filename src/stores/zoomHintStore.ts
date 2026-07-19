// 줌 힌트 툴팁 표시·세션당 1회 노출을 persist하는 Zustand 스토어
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface ZoomHintState {
  visible: boolean;
  shownThisSession: boolean;
  showZoomHint: () => void;
  dismissZoomHint: () => void;
}

export const useZoomHintStore = create<ZoomHintState>()(
  persist(
    (set) => ({
      visible: false,
      shownThisSession: false,
      showZoomHint: () => set({ visible: true, shownThisSession: true }),
      dismissZoomHint: () => set({ visible: false }),
    }),
    {
      name: 'portfolio-zoom-hint',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ shownThisSession: state.shownThisSession }),
    }
  )
);
