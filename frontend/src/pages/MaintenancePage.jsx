import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteMaintenanceRecord, getMaintenanceRecords } from '../api/maintenance.js';
import { Icon } from '../components/Icon.jsx';
import { formatDate } from '../utils/formatDate.js';
import { SortButton, TableToolbar } from '../components/TableToolbar.jsx';
import { useTableControls } from '../hooks/useTableControls.js';

const statusLabel = (status) =>
  ({ planned: 'Planned', in_progress: 'In progress', completed: 'Completed', cancelled: 'Cancelled' })[status] ||
  status;

function MaintenancePage() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { rows, search, setSearch, sort, toggleSort } = useTableControls(records, {
    searchFields: ['assetCode', 'assetName', 'maintenanceType', 'technician'],
    filter: (record) => statusFilter === 'all' || record.status === statusFilter,
    initialSort: { key: 'scheduledDate', direction: 'asc' },
  });

  useEffect(() => {
    getMaintenanceRecords()
      .then(setRecords)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function removeRecord(record) {
    if (!window.confirm(`Delete maintenance record "${record.maintenanceType}"?`)) return;
    setError('');
    try {
      await deleteMaintenanceRecord(record.id);
      setRecords((currentRecords) => currentRecords.filter((currentRecord) => currentRecord.id !== record.id));
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

      <TableToolbar search={search} onSearch={setSearch} placeholder="Search maintenance...">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
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
      {error && <p>{error}</p>}
      {!loading && !error && records.length === 0 && <p>No maintenance records found.</p>}

      {records.length > 0 && (
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
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((record) => (
              <tr key={record.id}>
                <td>{formatDate(record.scheduledDate)}</td>
                <td>
                  {record.assetCode} — {record.assetName}
                </td>
                <td>{record.maintenanceType}</td>
                <td>{statusLabel(record.status)}</td>
                <td>{record.technician || 'Not assigned'}</td>
                <td>
                  <Link to={`/maintenance/${record.id}`}>View</Link>{' '}
                  <Link to={`/maintenance/${record.id}/edit`}>
                    <Icon name="pencil" /> Edit
                  </Link>{' '}
                  <button className="button-destructive" type="button" onClick={() => removeRecord(record)}>
                    <Icon name="trash" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default MaintenancePage;
