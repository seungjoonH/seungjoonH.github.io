export function formatExperienceDateShort(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return dateStr || '';
  const [y, m] = dateStr.trim().split('-');
  if (!y || !m) return dateStr;
  return `${y}. ${m.padStart(2, '0')}`;
}

export function formatExperienceDateFull(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return dateStr || '';
  const parts = dateStr.trim().split('-');
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m) return dateStr;
  const day = (d && d.padStart(2, '0')) || '01';
  return `${y}. ${m.padStart(2, '0')}. ${day}`;
}
