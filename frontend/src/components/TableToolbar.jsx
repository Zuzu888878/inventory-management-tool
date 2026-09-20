import { Icon } from './Icon.jsx';

export function TableToolbar({ search, onSearch, placeholder = 'Search...', children }) {
  return (
    <div className="table-toolbar">
      <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} />
      {children}
    </div>
  );
}

export function SortButton({ label, sortKey, sort, onSort }) {
  const active = sort?.key === sortKey;
  return (
    <button className="table-sort" type="button" onClick={() => onSort(sortKey)}>
      {label} {active ? (sort.direction === 'asc' ? '↑' : '↓') : '↕'}
    </button>
  );
}

export function Pagination({ page, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange }) {
  if (totalItems === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing <strong>{start}</strong>–<strong>{end}</strong> of <strong>{totalItems}</strong>
      </div>
      <div className="pagination-controls">
        <label className="pagination-size">
          <span>Show:</span>
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            aria-label="Items per page"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
        <button
          type="button"
          className="button-outline"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <Icon name="chevronLeft" /> Prev
        </button>
        <span className="pagination-page-indicator">
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="button-outline"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          Next <Icon name="chevronRight" />
        </button>
      </div>
    </div>
  );
}
