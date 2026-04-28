import config from '../config.js';

const STORAGE_KEYS = {
  clientId: 'portfolio_client_id',
  siteViewSentPrefix: 'ana:site-view:',
};
const API_URL = import.meta.env.VITE_ANALYTICS_API_URL || '';
const DEFAULT_COOLDOWN_MS = 600;
const CLIENT_ID_PATTERN = /^[a-z0-9_-]{8,64}$/;
const lastSentAtByKey = new Map();

/**
 * @typedef {Object} AnalyticsTrackInput
 * @property {string} event
 * @property {string=} versionHash
 * @property {string=} locale
 * @property {string=} entityId
 * @property {Record<string, unknown>=} meta
 * @property {string=} dedupeKey
 * @property {number=} cooldownMs
 */

function getNow() {
  return Date.now();
}

function buildEventId() {
  return crypto.randomUUID();
}

function trimString(value, max = 120) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function getDefaultVersionHash() {
  return config.siteVersions?.defaultHash || 'unknown';
}

function sanitizeClientId(value) {
  const normalized = trimString(String(value || '').toLowerCase(), 64).replace(/[^a-z0-9_-]/g, '_');
  if (CLIENT_ID_PATTERN.test(normalized)) return normalized;
  return '';
}

function createClientId() {
  const sanitizedUuid = sanitizeClientId(buildEventId());
  if (sanitizedUuid) return sanitizedUuid;
  return `${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateClientId() {
  if (typeof window === 'undefined') return '';
  try {
    const saved = sanitizeClientId(window.localStorage.getItem(STORAGE_KEYS.clientId));
    if (saved) return saved;

    const nextId = createClientId();
    window.localStorage.setItem(STORAGE_KEYS.clientId, nextId);
    return nextId;
  } catch {
    return createClientId();
  }
}

function shouldSkipByCooldown(key, cooldownMs) {
  if (!cooldownMs || cooldownMs <= 0) return false;
  const now = getNow();
  const prev = lastSentAtByKey.get(key) || 0;
  if (now - prev < cooldownMs) return true;
  lastSentAtByKey.set(key, now);
  return false;
}

async function sendAnalytics(body) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });

    const data = await response.json().catch(() => null);
    if (data?.ok === false) {
      console.warn('[analytics] request rejected', data);
    }
  } catch {
    // absorb network failures on purpose
  }
}

/**
 * @param {AnalyticsTrackInput} payload
 */
export function trackEvent(payload) {
  if (!API_URL || typeof window === 'undefined') return;
  if (!payload || typeof payload !== 'object') return;

  const event = trimString(payload.event, 64);
  if (!event) return;

  const dedupeKey = trimString(payload.dedupeKey, 160) || `${event}:${trimString(payload.entityId, 80)}`;
  const cooldownMs = Number.isFinite(payload.cooldownMs) ? payload.cooldownMs : DEFAULT_COOLDOWN_MS;
  if (shouldSkipByCooldown(dedupeKey, cooldownMs)) return;

  const body = {
    event,
    v: trimString(payload.versionHash, 32) || getDefaultVersionHash(),
    locale: trimString(payload.locale, 8) || 'ko',
    eventId: buildEventId(),
    clientId: getOrCreateClientId(),
  };

  const entityId = trimString(payload.entityId, 80);
  if (entityId) body.entityId = entityId;
  if (payload.meta && typeof payload.meta === 'object') body.meta = payload.meta;

  void sendAnalytics(body);
}

export function buildSearchSubmitMeta(rawQuery) {
  const query = trimString(rawQuery, 200);
  if (!query) {
    return {
      queryBucket: '',
      tokenCount: 0,
      operatorUsed: [],
    };
  }

  const tokenCount = query.split(/\s+/).filter(Boolean).length;
  const len = query.length;
  const queryBucket = len <= 5 ? '1-5' : len <= 10 ? '6-10' : '11+';

  const operators = ['title', 'desc', 'stack', 'tag'];
  const lower = query.toLowerCase();
  const operatorUsed = operators.filter((op) => lower.includes(`${op}:`));

  return {
    queryBucket,
    tokenCount,
    operatorUsed,
  };
}

export function trackSiteView({ versionHash, locale }) {
  const v = trimString(versionHash, 32) || getDefaultVersionHash();
  const onceKey = `${STORAGE_KEYS.siteViewSentPrefix}${v}`;
  try {
    if (window.sessionStorage.getItem(onceKey) === '1') return;
    window.sessionStorage.setItem(onceKey, '1');
  } catch {
    // ignore storage errors and still attempt one send
  }

  trackEvent({
    event: 'site:view',
    versionHash: v,
    locale,
    cooldownMs: 0,
    dedupeKey: `site:view:${v}`,
  });
}
