import { useCallback } from 'react';
import { useConfigStore } from '../stores/configStore.js';
import { useVersionHash } from '../versioning/VersionContext.jsx';
import { buildSearchSubmitMeta, trackEvent } from '../utils/analytics.js';

const DEFAULT_LOCALE = 'ko';
const PROJECT_CLICK_EVENT = 'project:click';
const SEARCH_RESULT_CLICK_EVENT = 'search:result_click';
const SKILL_CLICK_EVENT = 'skill:click';
const DOC_CLICK_EVENT = 'doc:click';
const SEARCH_SUBMIT_EVENT = 'search:submit';
const SETTINGS_OPEN_EVENT = 'ui:settings_open';
const SPOILER_CLICK_EVENT = 'ui:spoiler_click';
const EXPERIENCE_CLICK_EVENT = 'experience:click';

function trimString(value, max = 120) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function normalizeEntityId(value) {
  const normalized = trimString(String(value || '').toLowerCase(), 80).replace(/[^a-z0-9_-]/g, '_');
  return normalized || '';
}

function normalizeSearchQuery(rawQuery) {
  return trimString(String(rawQuery || '').trim().toLowerCase(), 160);
}

function buildDedupeKey(event, entityId) {
  return entityId ? `${event}:${entityId}` : event;
}

function trackEventWithContext({ event, entityId, meta, dedupeKey, cooldownMs, versionHash, locale }) {
  trackEvent({
    event,
    versionHash,
    locale,
    entityId,
    meta,
    dedupeKey,
    cooldownMs,
  });
}

export function useAnalytics() {
  const versionHash = useVersionHash();
  const locale = useConfigStore((state) => state.language) || DEFAULT_LOCALE;

  const trackProjectClick = useCallback(
    (projectId, { withSearchResult = false } = {}) => {
      const entityId = normalizeEntityId(projectId);
      if (!entityId) return;

      trackEventWithContext({
        event: PROJECT_CLICK_EVENT,
        versionHash,
        locale,
        entityId,
        dedupeKey: buildDedupeKey(PROJECT_CLICK_EVENT, entityId),
      });

      if (!withSearchResult) return;

      trackEventWithContext({
        event: SEARCH_RESULT_CLICK_EVENT,
        versionHash,
        locale,
        entityId,
        dedupeKey: buildDedupeKey(SEARCH_RESULT_CLICK_EVENT, entityId),
      });
    },
    [versionHash, locale]
  );

  const trackSearchResultClick = useCallback(
    (projectId) => {
      const entityId = normalizeEntityId(projectId);
      if (!entityId) return;

      trackEventWithContext({
        event: SEARCH_RESULT_CLICK_EVENT,
        versionHash,
        locale,
        entityId,
        dedupeKey: buildDedupeKey(SEARCH_RESULT_CLICK_EVENT, entityId),
      });
    },
    [versionHash, locale]
  );

  const trackSkillClick = useCallback(
    (stack) => {
      const entityId = normalizeEntityId(stack);
      if (!entityId) return;

      trackEventWithContext({
        event: SKILL_CLICK_EVENT,
        versionHash,
        locale,
        entityId,
        dedupeKey: buildDedupeKey(SKILL_CLICK_EVENT, entityId),
      });
    },
    [versionHash, locale]
  );

  const trackDocClick = useCallback(
    (docId) => {
      const entityId = normalizeEntityId(docId);
      if (!entityId) return;

      trackEventWithContext({
        event: DOC_CLICK_EVENT,
        versionHash,
        locale,
        entityId,
        dedupeKey: buildDedupeKey(DOC_CLICK_EVENT, entityId),
      });
    },
    [versionHash, locale]
  );

  const trackSearchSubmit = useCallback(
    (rawQuery) => {
      const query = normalizeSearchQuery(rawQuery);
      if (!query) return;

      trackEventWithContext({
        event: SEARCH_SUBMIT_EVENT,
        versionHash,
        locale,
        meta: buildSearchSubmitMeta(rawQuery),
        dedupeKey: `search:submit:${query}`,
        cooldownMs: 700,
      });
    },
    [versionHash, locale]
  );

  const trackSettingsOpen = useCallback(() => {
    trackEventWithContext({
      event: SETTINGS_OPEN_EVENT,
      versionHash,
      locale,
      dedupeKey: SETTINGS_OPEN_EVENT,
      cooldownMs: 800,
    });
  }, [versionHash, locale]);

  const trackUiSpoilerClick = useCallback(
    (entityId = 'show-hidden-toggle') => {
      const normalized = normalizeEntityId(entityId);
      trackEventWithContext({
        event: SPOILER_CLICK_EVENT,
        versionHash,
        locale,
        entityId: normalized,
        dedupeKey: buildDedupeKey(SPOILER_CLICK_EVENT, normalized),
        cooldownMs: 500,
      });
    },
    [versionHash, locale]
  );

  const trackExperienceClick = useCallback(
    (experienceId) => {
      const entityId = normalizeEntityId(experienceId);
      if (!entityId) return;

      trackEventWithContext({
        event: EXPERIENCE_CLICK_EVENT,
        versionHash,
        locale,
        entityId,
        dedupeKey: buildDedupeKey(EXPERIENCE_CLICK_EVENT, entityId),
      });
    },
    [versionHash, locale]
  );

  return {
    trackProjectClick,
    trackSearchResultClick,
    trackSkillClick,
    trackDocClick,
    trackSearchSubmit,
    trackSettingsOpen,
    trackUiSpoilerClick,
    trackExperienceClick,
  };
}
