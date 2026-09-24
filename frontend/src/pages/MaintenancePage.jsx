import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { deleteMaintenanceRecord, getMaintenanceRecords } from '../api/maintenance.js';
import { Icon } from '../components/Icon.jsx';
import { formatDate } from '../utils/formatDate.js';
import { Pagination, SortButton, TableToolbar } from '../components/TableToolbar.jsx';
import { useCachedResource } from '../hooks/useCachedResource.js';
import { useTableControls } from '../hooks/useTableControls.js';
import { dashboardState, maintenanceRecordsState } from '../state/inventoryAtoms.js';
import { markDashboardStale } from '../state/cacheUtils.js';

const statusLabel = (status) =>
  ({ planned: 'Planned', in_progress: 'In progress', completed: 'Completed', cancelled: 'Cancelled' })[status] ||
  status;

function MaintenancePage() {
  const {
    cache: recordsCache,
    setCache: setRecordsCache,
    loading,
    refreshing,
    error,
    setError,
  } = useCachedResource(maintenanceRecordsState, getMaintenanceRecords);
  const setDashboardCache = useSetRecoilState(dashboardState);
  const [statusFilter, setStatusFilter] = useState('all');
  const records = recordsCache.items;
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
  } = useTableControls(records, {
    searchFields: ['assetCode', 'assetName', 'maintenanceType', 'technician'],
    filter: (record) => statusFilter === 'all' || record.status === statusFilter,
    initialSort: { key: 'scheduledDate', direction: 'asc' },
    defaultPageSize: 20,
  });

  async function removeRecord(record) {
    if (!window.confirm(`Delete maintenance record "${record.maintenanceType}"?`)) return;
    setError('');
    try {
      await deleteMaintenanceRecord(record.id);
      setRecordsCache((currentCache) => ({
        ...currentCache,
        items: currentCache.items.filter((currentRecord) => currentRecord.id !== record.id),
      }));
      setDashboardCache(markDashboardStale);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-heading">
        <h1>Maintenance</h1>
        <Link to="/maintenance/new">
          <button className="button" type="button">
            <Icon name="plus" /> New Maintenance
          </button>
        </Link>
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Search asset, work type, or technician...">
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </TableToolbar>

      {loading && <p>Loading...</p>}
      {refreshing && !loading && <p className="refresh-status">Refreshing maintenance...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && records.length === 0 && <p>No maintenance records found.</p>}

      {records.length > 0 && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <SortButton label="Scheduled date" sortKey="scheduledDate" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Asset" sortKey="assetCode" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Type" sortKey="maintenanceType" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Technician" sortKey="technician" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col" className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((record) => (
                  <tr key={record.id}>
                    <td className="cell-nowrap">{formatDate(record.scheduledDate)}</td>
                    <td className="cell-name">
                      {record.assetCode} — {record.assetName}
                    </td>
                    <td>{record.maintenanceType}</td>
                    <td>
                      <span className={`status-badge status-${record.status}`}>{statusLabel(record.status)}</span>
                    </td>
                    <td>{record.technician || 'Not assigned'}</td>
                    <td className="actions-cell">
                      <div className="table-actions">
                        <Link to={`/maintenance/${record.id}`}>
                          <Icon name="eye" /> View
                        </Link>
                        <Link to={`/maintenance/${record.id}/edit`}>
                          <Icon name="pencil" /> Edit
                        </Link>
                        <button className="button-destructive" type="button" onClick={() => removeRecord(record)}>
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

export default MaintenancePage;
