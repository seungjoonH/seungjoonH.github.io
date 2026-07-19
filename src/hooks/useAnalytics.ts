// UI 이벤트를 버전·locale 컨텍스트와 함께 analytics로 전송
import { useConfigStore } from '@stores/configStore';
import { useVersion } from '@versioning';
import { buildSearchSubmitMeta, trackEvent } from '@analytics';
import config from '../config';
import { parseTrimmedString } from '@utils/parse';

function entityId(value: unknown): string {
  return parseTrimmedString(String(value ?? ''))
    .toLowerCase()
    .slice(0, 80)
    .replace(/[^a-z0-9_-]/g, '_');
}

export function useAnalytics() {
  const { hash: versionHash } = useVersion();
  const locale = useConfigStore((state) => state.language) || config.language.initial;

  function send(
    event: string,
    options: {
      entityId?: string;
      meta?: Record<string, unknown>;
      dedupeKey?: string;
      cooldownMs?: number;
    } = {}
  ) {
    const id = options.entityId;
    trackEvent({
      event,
      versionHash,
      locale,
      entityId: id,
      meta: options.meta,
      dedupeKey: options.dedupeKey ?? (id ? `${event}:${id}` : event),
      cooldownMs: options.cooldownMs,
    });
  }

  function trackById(event: string, idValue: unknown) {
    const id = entityId(idValue);
    if (!id) return;
    send(event, { entityId: id });
  }

  return {
    trackProjectClick(projectId: unknown, { withSearchResult = false } = {}) {
      const id = entityId(projectId);
      if (!id) return;
      send('project:click', { entityId: id });
      if (withSearchResult) send('search:result_click', { entityId: id });
    },
    trackSearchResultClick(projectId: unknown) {
      trackById('search:result_click', projectId);
    },
    trackSkillClick(stack: unknown) {
      trackById('skill:click', stack);
    },
    trackDocClick(docId: unknown) {
      trackById('doc:click', docId);
    },
    trackSearchSubmit(rawQuery: unknown) {
      const query = parseTrimmedString(String(rawQuery ?? '')).toLowerCase().slice(0, 160);
      if (!query) return;
      send('search:submit', {
        meta: { ...buildSearchSubmitMeta(rawQuery) },
        dedupeKey: `search:submit:${query}`,
        cooldownMs: 700,
      });
    },
    trackSettingsOpen() {
      send('ui:settings_open', { cooldownMs: 800 });
    },
    trackUiSpoilerClick(idValue = 'show-hidden-toggle') {
      const id = entityId(idValue);
      send('ui:spoiler_click', { entityId: id, cooldownMs: 500 });
    },
    trackExperienceClick(experienceId: unknown) {
      trackById('experience:click', experienceId);
    },
  };
}
