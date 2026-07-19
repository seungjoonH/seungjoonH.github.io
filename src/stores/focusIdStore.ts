// 섹션 간 포커스/스크롤 핸드오프 (docs ↔ experience)
import { create } from 'zustand';

interface FocusIdState {
  idToFocus: string | null;
  setIdToFocus: (id: string | null) => void;
  clearIdToFocus: () => void;
}

function createFocusIdStore() {
  return create<FocusIdState>((set) => ({
    idToFocus: null,
    setIdToFocus: (id) => set({ idToFocus: id }),
    clearIdToFocus: () => set({ idToFocus: null }),
  }));
}

export const useDocsFocusStore = createFocusIdStore();
export const useExperienceFocusStore = createFocusIdStore();
