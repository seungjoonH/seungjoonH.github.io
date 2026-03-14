export function buildCls(...args) {
  return args.filter(Boolean).join(' ').trim();
}

export const CSSVarProperties = ({});

export default { buildCls, CSSVarProperties };
