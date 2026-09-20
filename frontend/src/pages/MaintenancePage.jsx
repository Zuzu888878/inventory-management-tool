import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMaintenanceRecords } from '../api/maintenance.js';

const statusLabel = (status) =>
  ({ planned: 'Planned', in_progress: 'In progress', completed: 'Completed', cancelled: 'Cancelled' })[status] ||
  status;

function MaintenancePage() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaintenanceRecords()
      .then(setRecords)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1>Maintenance</h1>
      <Link to="/maintenance/new">
        <button type="button">New Maintenance</button>
      </Link>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && records.length === 0 && <p>No maintenance records found.</p>}

      {records.length > 0 && (
        <table>
          <thead>
            <tr>
              <th scope="col">Scheduled date</th>
              <th scope="col">Asset</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">Technician</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.scheduledDate?.slice(0, 10)}</td>
                <td>
                  {record.assetCode} — {record.assetName}
                </td>
                <td>{record.maintenanceType}</td>
                <td>{statusLabel(record.status)}</td>
                <td>{record.technician || 'Not assigned'}</td>
                <td>
                  <Link to={`/maintenance/${record.id}`}>View</Link>{' '}
                  <Link to={`/maintenance/${record.id}/edit`}>Edit</Link>
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
