import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteMaintenanceRecord, getMaintenanceRecord } from '../api/maintenance.js';

function MaintenanceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaintenanceRecord(id)
      .then(setRecord)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function removeRecord() {
    if (!window.confirm('Delete this maintenance record?')) return;

    try {
      await deleteMaintenanceRecord(id);
      navigate('/maintenance');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!record) return <p>Maintenance record not found.</p>;

  return (
    <>
      <h1>{record.maintenanceType}</h1>
      <p>
        <strong>Asset:</strong>{' '}
        <Link to={`/assets/${record.assetId}`}>
          {record.assetCode} — {record.assetName}
        </Link>
      </p>
      <p>
        <strong>Scheduled date:</strong> {record.scheduledDate?.slice(0, 10)}
      </p>
      <p>
        <strong>Completed date:</strong> {record.completedDate?.slice(0, 10) || 'Not completed'}
      </p>
      <p>
        <strong>Status:</strong> {record.status.replace('_', ' ')}
      </p>
      <p>
        <strong>Technician:</strong> {record.technician || 'Not assigned'}
      </p>
      <p>
        <strong>Cost:</strong> {record.cost === null ? 'Not set' : record.cost.toFixed(2)}
      </p>
      <p>
        <strong>Notes:</strong> {record.notes || 'Not set'}
      </p>

      <Link to={`/maintenance/${record.id}/edit`}>
        <button type="button">Edit</button>
      </Link>
      <button className="button-destructive" type="button" onClick={removeRecord}>
        Delete
      </button>
      <Link to="/maintenance">
        <button type="button">Back to Maintenance</button>
      </Link>
    </>
  );
}

export default MaintenanceDetailsPage;
