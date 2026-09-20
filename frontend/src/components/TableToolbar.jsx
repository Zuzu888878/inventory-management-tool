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
