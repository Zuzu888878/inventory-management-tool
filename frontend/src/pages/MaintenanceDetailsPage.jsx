import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteMaintenanceRecord, getMaintenanceRecord, updateMaintenanceRecord } from '../api/maintenance.js';
import { formatDate } from '../utils/formatDate.js';
import { Icon } from '../components/Icon.jsx';

const statuses = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function MaintenanceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusError, setStatusError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

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

  async function changeStatus(status) {
    if (status === record.status || updatingStatus) return;

    setUpdatingStatus(true);
    setStatusError('');
    try {
      const updatedRecord = await updateMaintenanceRecord(id, {
        assetId: record.assetId,
        maintenanceType: record.maintenanceType,
        scheduledDate: record.scheduledDate?.slice(0, 10),
        completedDate: record.completedDate?.slice(0, 10) || null,
        status,
        technicianId: record.technicianId,
        technician: record.technician,
        cost: record.cost,
        notes: record.notes,
      });
      setRecord(updatedRecord);
    } catch (requestError) {
      setStatusError(requestError.message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!record) return <p>Maintenance record not found.</p>;

  return (
    <>
      <div className="detail-heading">
        <h1>{record.maintenanceType}</h1>
        <Link to="/maintenance">
          <button className="button-outline" type="button">
            <Icon name="arrowLeft" /> Back
          </button>
        </Link>
      </div>
      <section className="detail-card">
        <div className="detail-grid">
          <div className="detail-item">
            <span>Asset</span>
            <strong>
              <Link to={`/assets/${record.assetId}`}>
                {record.assetCode} — {record.assetName}
              </Link>
            </strong>
          </div>
          <div className="detail-item">
            <span>Status</span>
            <div className="maintenance-status-controls" role="group" aria-label="Change maintenance status">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  className={`maintenance-status-button status-${status.value}${
                    record.status === status.value ? ' maintenance-status-button-active' : ''
                  }`}
                  aria-pressed={record.status === status.value}
                  disabled={updatingStatus}
                  onClick={() => changeStatus(status.value)}
                >
                  {status.label}
                </button>
              ))}
            </div>
            {statusError && (
              <small className="maintenance-status-error" role="alert">
                {statusError}
              </small>
            )}
          </div>
          <div className="detail-item">
            <span>Scheduled date</span>
            <strong>{formatDate(record.scheduledDate)}</strong>
          </div>
          <div className="detail-item">
            <span>Completed date</span>
            <strong>{record.completedDate ? formatDate(record.completedDate) : 'Not completed'}</strong>
          </div>
          <div className="detail-item">
            <span>Technician</span>
            <strong>{record.technician || 'Not assigned'}</strong>
          </div>
          <div className="detail-item">
            <span>Cost (CHF)</span>
            <strong>{record.cost === null ? 'Not set' : record.cost.toFixed(2)}</strong>
          </div>
          <div className="detail-item detail-wide">
            <span>Notes</span>
            <strong>{record.notes || 'Not set'}</strong>
          </div>
        </div>
      </section>

      <div className="actions">
        <Link to={`/maintenance/${record.id}/edit`}>
          <button className="button-outline" type="button">
            <Icon name="pencil" /> Edit
          </button>
        </Link>
        <button className="button-destructive" type="button" onClick={removeRecord}>
          <Icon name="trash" /> Delete
        </button>
      </div>
    </>
  );
}

export default MaintenanceDetailsPage;
