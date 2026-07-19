// 알려진 검색 단축 프리셋 (갤러리·명시 type용)
export const SEARCH_SHORTCUT_PRESETS = {
  extify: { label: 'Extify', query: 'title:Extify show:all' },
  showAll: { label: 'show:all', query: 'show:all' },
} as const;

export type SearchShortcutType = keyof typeof SEARCH_SHORTCUT_PRESETS;

export function resolveSearchShortcut(args: {
  type?: string;
  label?: string;
  query?: string;
}): { label: string; query: string } | null {
  if (args.type && args.type in SEARCH_SHORTCUT_PRESETS) {
    return SEARCH_SHORTCUT_PRESETS[args.type as SearchShortcutType];
  }
  if (args.label && args.query) return { label: args.label, query: args.query };
  return null;
}
