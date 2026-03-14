import { create } from 'zustand';

export const useExperienceFocusStore = create((set) => ({
  experienceIdToFocus: null,
  setExperienceIdToFocus: (id) => set({ experienceIdToFocus: id }),
  clearExperienceIdToFocus: () => set({ experienceIdToFocus: null }),
}));
