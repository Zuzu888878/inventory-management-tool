import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteAsset, getAssets } from '../api/assets.js';
import { Icon } from '../components/Icon.jsx';
import { formatDate } from '../utils/formatDate.js';
import { Pagination, SortButton, TableToolbar } from '../components/TableToolbar.jsx';
import { useTableControls } from '../hooks/useTableControls.js';

function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

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
  } = useTableControls(assets, {
    searchFields: ['assetCode', 'name', 'category', 'location'],
    filter: (asset) => statusFilter === 'all' || asset.status === statusFilter,
    initialSort: { key: 'assetCode', direction: 'asc' },
    defaultPageSize: 20,
  });

  useEffect(() => {
    getAssets()
      .then(setAssets)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function removeAsset(asset) {
    if (!window.confirm(`Delete asset "${asset.name || asset.assetCode}"?`)) return;
    setError('');
    try {
      await deleteAsset(asset.id);
      setAssets((currentAssets) => currentAssets.filter((currentAsset) => currentAsset.id !== asset.id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-heading">
        <h1>Assets</h1>
        <Link to="/assets/new">
          <button className="button" type="button">
            <Icon name="plus" /> New Asset
          </button>
        </Link>
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Search assets...">
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
          <option value="offline">Offline</option>
        </select>
      </TableToolbar>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && assets.length === 0 && <p>No assets found.</p>}

      {assets.length > 0 && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <SortButton label="Asset Code" sortKey="assetCode" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Name" sortKey="name" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Category" sortKey="category" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Location" sortKey="location" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Next Maintenance" sortKey="nextMaintenanceDate" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col" className="actions-col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((asset) => (
                  <tr key={asset.id}>
                    <td className="cell-code">{asset.assetCode || 'Not set'}</td>
                    <td className="cell-name">{asset.name || `Asset ${asset.id}`}</td>
                    <td>{asset.category || 'Not set'}</td>
                    <td>
                      <span className={`status-badge status-${asset.status}`}>{asset.status || 'Not set'}</span>
                    </td>
                    <td>{asset.location || 'Not set'}</td>
                    <td className="cell-nowrap">{formatDate(asset.nextMaintenanceDate)}</td>
                    <td className="actions-cell">
                      <div className="table-actions">
                        <Link to={`/assets/${asset.id}`}>
                          <Icon name="eye" /> View
                        </Link>
                        <Link to={`/assets/${asset.id}/edit`}>
                          <Icon name="pencil" /> Edit
                        </Link>
                        <button className="button-destructive" type="button" onClick={() => removeAsset(asset)}>
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

export default AssetsPage;
