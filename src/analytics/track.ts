// 분석 이벤트 전송·클라이언트 ID·사이트 뷰 추적
import config, { getDefaultSiteHash } from '../config';
import { isRecord } from '@utils/parse';

const STORAGE_KEYS = {
  clientId: 'portfolio_client_id',
} as const;
const API_URL = import.meta.env.VITE_ANALYTICS_API_URL || '';
const DEFAULT_COOLDOWN_MS = 600;
const SITE_VIEW_COOLDOWN_MS = 1000;
const CLIENT_ID_PATTERN = /^[a-z0-9_-]{8,64}$/;
const lastSentAtByKey = new Map<string, number>();

export interface AnalyticsTrackInput {
  event: string;
  versionHash?: string;
  locale?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
  dedupeKey?: string;
  cooldownMs?: number;
}

interface AnalyticsRequestBody {
  event: string;
  v: string;
  locale: string;
  eventId: string;
  clientId: string;
  entityId?: string;
  meta?: Record<string, unknown>;
}

interface AnalyticsResponse {
  ok?: boolean;
}

function getNow(): number {
  return Date.now();
}

function buildEventId(): string {
  return crypto.randomUUID();
}

function trimString(value: unknown, max = 120): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function getDefaultVersionHash(): string {
  return getDefaultSiteHash();
}

function sanitizeClientId(value: unknown): string {
  const normalized = trimString(String(value || '').toLowerCase(), 64).replace(/[^a-z0-9_-]/g, '_');
  if (CLIENT_ID_PATTERN.test(normalized)) return normalized;
  return '';
}

function createClientId(): string {
  const sanitizedUuid = sanitizeClientId(buildEventId());
  if (sanitizedUuid) return sanitizedUuid;
  return `${Math.random().toString(36).slice(2, 14)}${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateClientId(): string {
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

function shouldSkipByCooldown(key: string, cooldownMs: number): boolean {
  if (!cooldownMs || cooldownMs <= 0) return false;
  const now = getNow();
  const prev = lastSentAtByKey.get(key) || 0;
  if (now - prev < cooldownMs) return true;
  lastSentAtByKey.set(key, now);
  return false;
}

async function sendAnalytics(body: AnalyticsRequestBody): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });

    const data = (await response.json().catch(() => null)) as AnalyticsResponse | null;
    if (data?.ok === false) {
      console.warn('[analytics] request rejected', data);
    }
  } catch {
    // absorb network failures on purpose
  }
}

/**
 * 분석 이벤트를 전송한다. API URL이 없거나 쿨다운 중이면 무시한다.
 * @param payload - 이벤트명·버전·locale·entity·meta·dedupe/cooldown 옵션
 * @returns 없음 (네트워크는 fire-and-forget)
 */
export function trackEvent(payload: AnalyticsTrackInput): void {
  if (!API_URL || typeof window === 'undefined') return;
  if (!payload || typeof payload !== 'object') return;

  const event = trimString(payload.event, 64);
  if (!event) return;

  const dedupeKey = trimString(payload.dedupeKey, 160) || `${event}:${trimString(payload.entityId, 80)}`;
  const cooldownMs = Number.isFinite(payload.cooldownMs) ? payload.cooldownMs! : DEFAULT_COOLDOWN_MS;
  if (shouldSkipByCooldown(dedupeKey, cooldownMs)) return;

  const body: AnalyticsRequestBody = {
    event,
    v: trimString(payload.versionHash, 32) || getDefaultVersionHash(),
    locale: trimString(payload.locale, 8) || config.language.initial,
    eventId: buildEventId(),
    clientId: getOrCreateClientId(),
  };

  const entityId = trimString(payload.entityId, 80);
  if (entityId) body.entityId = entityId;
  if (isRecord(payload.meta)) body.meta = payload.meta;

  void sendAnalytics(body);
}

export interface SearchSubmitMeta {
  queryBucket: string;
  tokenCount: number;
  operatorUsed: string[];
}

/**
 * 검색 제출 분석용 메타(길이 버킷·토큰 수·연산자)를 만든다.
 * @param rawQuery - 원본 검색어
 * @returns queryBucket / tokenCount / operatorUsed
 */
export function buildSearchSubmitMeta(rawQuery: unknown): SearchSubmitMeta {
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

/**
 * 사이트 뷰 이벤트를 전송한다. 새로고침마다 누적 집계된다.
 * (React Strict Mode 이중 mount 방지를 위해 짧은 쿨다운만 둔다.)
 * @param options.versionHash - 사이트 버전 해시. 없으면 config 기본 해시.
 * @param options.locale - 현재 locale
 * @returns 없음
 */
export function trackSiteView({ versionHash, locale }: { versionHash?: string; locale?: string }): void {
  const v = trimString(versionHash, 32) || getDefaultVersionHash();

  trackEvent({
    event: 'site:view',
    versionHash: v,
    locale,
    cooldownMs: SITE_VIEW_COOLDOWN_MS,
    dedupeKey: `site:view:${v}`,
  });
}
