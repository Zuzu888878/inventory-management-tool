import { useMemo, useState } from 'react';

export function useTableControls(
  items,
  { searchFields = [], filter = () => true, initialSort, defaultPageSize = 20 } = {}
) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filteredAndSortedRows = useMemo(() => {
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

  const totalItems = filteredAndSortedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const rows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedRows.slice(start, start + pageSize);
  }, [filteredAndSortedRows, currentPage, pageSize]);

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function toggleSort(key) {
    setSort((current) => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  function handlePageSizeChange(newPageSize) {
    setPageSize(newPageSize);
    setPage(1);
  }

  return {
    rows,
    allRows: filteredAndSortedRows,
    search,
    setSearch: handleSearch,
    sort,
    toggleSort,
    page: currentPage,
    setPage,
    pageSize,
    setPageSize: handlePageSizeChange,
    totalPages,
    totalItems,
  };
}
