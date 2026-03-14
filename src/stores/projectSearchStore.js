import { create } from 'zustand';

export const useProjectSearchStore = create((set) => ({
  rawQuery: '',
  queryAppliedByShortcut: false,
  shortcutHintDismissed: false,
  setQuery: (q) =>
    set({
      rawQuery: typeof q === 'string' ? q : '',
      queryAppliedByShortcut: false,
    }),
  setQueryFromShortcut: (q) => {
    set({
      rawQuery: typeof q === 'string' ? q : '',
      queryAppliedByShortcut: true,
      shortcutHintDismissed: false,
    });
    if (typeof document !== 'undefined') {
      const el = document.getElementById('project');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
      }
    }
  },
  dismissShortcutHint: () => set({ shortcutHintDismissed: true }),
}));

export default useProjectSearchStore;
