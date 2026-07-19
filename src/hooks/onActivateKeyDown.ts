// role=button 등에서 Enter/Space로 활성화할 때 쓰는 키보드 헬퍼

/**
 * Enter 또는 Space면 preventDefault 후 activate를 호출한다.
 * @param e - keydown 이벤트 (또는 동형 객체)
 * @param activate - 활성화 콜백
 */
export function onActivateKeyDown(
  e: { key: string; preventDefault: () => void },
  activate: () => void,
): void {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  activate();
}
