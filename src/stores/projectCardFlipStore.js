import { create } from 'zustand';

export const useProjectCardFlipStore = create((set) => ({
  flippedProjectId: null,
  setFlippedProjectId: (id) => set({ flippedProjectId: id ?? null }),
}));

export default useProjectCardFlipStore;