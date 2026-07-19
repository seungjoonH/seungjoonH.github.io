// 프로젝트 검색 쿼리와 단축어 힌트 상태
import { create } from 'zustand';

function scrollToProjectSection() {
  const el = document.getElementById('project');
  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
}

export interface ProjectSearchState {
  rawQuery: string;
  queryAppliedByShortcut: boolean;
  shortcutHintDismissed: boolean;
  setQuery: (q: string) => void;
  setQueryFromShortcut: (q: string) => void;
  appendShortcutToQuery: (shortcut: string) => void;
  dismissShortcutHint: () => void;
}

export const useProjectSearchStore = create<ProjectSearchState>((set) => ({
  rawQuery: '',
  queryAppliedByShortcut: false,
  shortcutHintDismissed: false,
  setQuery: (q) =>
    set({
      rawQuery: q,
      queryAppliedByShortcut: false,
    }),
  setQueryFromShortcut: (q) => {
    set({
      rawQuery: q,
      queryAppliedByShortcut: true,
      shortcutHintDismissed: false,
    });
    scrollToProjectSection();
  },
  appendShortcutToQuery: (shortcut) => {
    const s = shortcut.trim();
    if (!s) return;
    set((state) => {
      const clauses = state.rawQuery
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean);
      const next = clauses.includes(s)
        ? clauses.filter((c) => c !== s)
        : [...clauses, s];
      return {
        rawQuery: next.join('|'),
        queryAppliedByShortcut: true,
        shortcutHintDismissed: false,
      };
    });
    scrollToProjectSection();
  },
  dismissShortcutHint: () => set({ shortcutHintDismissed: true }),
}));
