import { create } from 'zustand';

/** On mobile, only one project card can be flipped (back) at a time. This store holds that card's project id. */
export const useProjectCardFlipStore = create((set) => ({
  flippedProjectId: null,
  setFlippedProjectId: (id) => set({ flippedProjectId: id ?? null }),
}));

export default useProjectCardFlipStore;
