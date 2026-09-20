export function formatDate(date) {
  if (!date) return 'Not set';
  const [year, month, day] = String(date).slice(0, 10).split('-');
  if (!year || !month || !day) return 'Not set';
  return `${day}.${month}.${year}`;
}
