export function buildCls(...args) {
  return args.filter(Boolean).join(' ').trim();
}