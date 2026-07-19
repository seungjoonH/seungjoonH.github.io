// 요소에 CSS 커스텀 프로퍼티를 즉시 세팅 (React style prop 회피)
type CssVarMap = Record<string, string | number | null>;

/** 한 번의 scroll/move 핸들러·layout effect 등에서 즉시 세팅할 때 사용 */
export function setCssVars(el: HTMLElement | null, vars: CssVarMap): void {
  if (!el) return;
  for (const [name, value] of Object.entries(vars)) {
    if (value == null) continue;
    el.style.setProperty(name, String(value));
  }
}
