import { useMemo, useState } from 'react';

export function useTableControls(items, { searchFields = [], filter = () => true, initialSort }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(initialSort);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const result = items.filter((item) => {
      const matchesSearch =
        !term ||
        searchFields.some((field) =>
          String(item[field] ?? '')
            .toLowerCase()
            .includes(term)
        );
      return matchesSearch && filter(item);
    });

    if (!sort?.key) return result;
    return [...result].sort((a, b) => {
      const left = String(a[sort.key] ?? '').toLowerCase();
      const right = String(b[sort.key] ?? '').toLowerCase();
      const comparison = left.localeCompare(right, undefined, { numeric: true });
      return sort.direction === 'desc' ? -comparison : comparison;
    });
  }, [filter, items, search, searchFields, sort]);

  function toggleSort(key) {
    setSort((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  return { rows, search, setSearch, sort, toggleSort };
}
