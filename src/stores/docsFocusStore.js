import { create } from 'zustand';

export const useDocsFocusStore = create((set) => ({
  docIdToFocus: null,
  setDocIdToFocus: (docId) => set({ docIdToFocus: docId }),
  clearDocIdToFocus: () => set({ docIdToFocus: null }),
}));
