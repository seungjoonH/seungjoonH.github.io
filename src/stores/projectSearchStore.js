import { create } from 'zustand';

function scrollToProjectSection() {
  if (typeof document === 'undefined') return;
  const el = document.getElementById('project');
  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
}

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
    scrollToProjectSection();
  },
  appendShortcutToQuery: (shortcut) => {
    const s = typeof shortcut === 'string' ? shortcut.trim() : '';
    if (!s) return;
    set((state) => {
      const current = (state.rawQuery || '').trim();
      const clauses = current ? current.split('|').map((c) => c.trim()).filter(Boolean) : [];
      const exists = clauses.includes(s);
      const nextClauses = exists ? clauses.filter((c) => c !== s) : [...clauses, s];
      const next = nextClauses.join('|');
      return {
        rawQuery: next,
        queryAppliedByShortcut: true,
        shortcutHintDismissed: false,
      };
    });
    scrollToProjectSection();
  },
  dismissShortcutHint: () => set({ shortcutHintDismissed: true }),
}));

export default useProjectSearchStore;
