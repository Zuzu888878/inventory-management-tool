import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { deleteSparePart, getSpareParts } from '../api/spareParts.js';
import { Icon } from '../components/Icon.jsx';
import { Pagination, SortButton, TableToolbar } from '../components/TableToolbar.jsx';
import { useCachedResource } from '../hooks/useCachedResource.js';
import { useTableControls } from '../hooks/useTableControls.js';
import { dashboardState, sparePartsState } from '../state/inventoryAtoms.js';
import { markDashboardStale } from '../state/cacheUtils.js';

function SparePartsPage() {
  const {
    cache: sparePartsCache,
    setCache: setSparePartsCache,
    loading,
    refreshing,
    error,
    setError,
  } = useCachedResource(sparePartsState, getSpareParts);
  const setDashboardCache = useSetRecoilState(dashboardState);
  const [stockFilter, setStockFilter] = useState('all');
  const spareParts = sparePartsCache.items;
  const {
    rows,
    search,
    setSearch,
    sort,
    toggleSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
  } = useTableControls(spareParts, {
    searchFields: ['name', 'manufacturerNumber', 'compatibleMachineType'],
    filter: (part) => {
      if (stockFilter === 'out') return part.quantityInStock === 0;
      if (stockFilter === 'low') return part.quantityInStock > 0 && part.quantityInStock <= 5;
      return true;
    },
    initialSort: { key: 'name', direction: 'asc' },
    defaultPageSize: 20,
  });

  async function removeSparePart(sparePart) {
    if (!window.confirm(`Delete spare part "${sparePart.name}"?`)) return;
    setError('');
    try {
      await deleteSparePart(sparePart.id);
      setSparePartsCache((currentCache) => ({
        ...currentCache,
        items: currentCache.items.filter((currentPart) => currentPart.id !== sparePart.id),
      }));
      setDashboardCache(markDashboardStale);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-heading">
        <h1>Spare Parts</h1>
        <Link to="/spare-parts/new">
          <button className="button" type="button">
            <Icon name="plus" /> New Spare Part
          </button>
        </Link>
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Search part, manufacturer number, or machine type...">
        <select
          value={stockFilter}
          onChange={(event) => {
            setStockFilter(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by stock"
        >
          <option value="all">All stock levels</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
      </TableToolbar>

      {loading && <p>Loading...</p>}
      {refreshing && !loading && <p className="refresh-status">Refreshing spare parts...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && spareParts.length === 0 && <p>No spare parts found.</p>}

      {spareParts.length > 0 && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <SortButton label="Name" sortKey="name" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Manufacturer Number" sortKey="manufacturerNumber" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton
                      label="Compatible Machine Type"
                      sortKey="compatibleMachineType"
                      sort={sort}
                      onSort={toggleSort}
                    />
                  </th>
                  <th scope="col">
                    <SortButton label="Quantity in Stock" sortKey="quantityInStock" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col" className="actions-col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((sparePart) => (
                  <tr key={sparePart.id}>
                    <td className="cell-name">{sparePart.name || `Spare Part ${sparePart.id}`}</td>
                    <td className="cell-code">{sparePart.manufacturerNumber || 'Not set'}</td>
                    <td>{sparePart.compatibleMachineType || 'Not set'}</td>
                    <td>
                      <span className={sparePart.quantityInStock === 0 ? 'text-danger' : sparePart.quantityInStock <= 5 ? 'text-warning' : ''}>
                        {sparePart.quantityInStock ?? 0}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="table-actions">
                        <Link to={`/spare-parts/${sparePart.id}`}>
                          <Icon name="eye" /> View
                        </Link>
                        <Link to={`/spare-parts/${sparePart.id}/edit`}>
                          <Icon name="pencil" /> Edit
                        </Link>
                        <button className="button-destructive" type="button" onClick={() => removeSparePart(sparePart)}>
                          <Icon name="trash" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </>
  );
}

export default SparePartsPage;
