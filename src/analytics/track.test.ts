// 분석 제외 세션과 정상 이벤트 전송을 검증
describe('trackEvent', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    vi.stubEnv('VITE_ANALYTICS_API_URL', 'https://analytics.example.test/events');
    window.sessionStorage.clear();
    window.localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('analytics=off를 감지하면 같은 세션의 이후 이동에서도 이벤트를 보내지 않는다', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const { trackEvent } = await import('./track');

    window.history.replaceState({}, '', '/components?analytics=off');
    trackEvent({ event: 'guide:view', entityId: 'components', cooldownMs: 0 });

    window.history.replaceState({}, '', '/components');
    trackEvent({ event: 'guide:tab', entityId: 'components:design', cooldownMs: 0 });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('분석 제외 세션이 아니면 이벤트를 보낸다', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    );
    const { trackEvent } = await import('./track');

    trackEvent({ event: 'guide:view', entityId: 'components', cooldownMs: 0 });

    expect(fetchMock).toHaveBeenCalledOnce();
  });
});
