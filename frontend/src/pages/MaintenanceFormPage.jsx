import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAssets } from '../api/assets.js';
import { createMaintenanceRecord, getMaintenanceRecord, updateMaintenanceRecord } from '../api/maintenance.js';
import { getTechnicians } from '../api/users.js';
import { Icon } from '../components/Icon.jsx';
import { TechnicianSearchSelect } from '../components/TechnicianSearchSelect.jsx';

function MaintenanceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [assets, setAssets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [assetId, setAssetId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [status, setStatus] = useState('planned');
  const [technicianId, setTechnicianId] = useState('');
  const [technician, setTechnician] = useState('');
  const [cost, setCost] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requests = [getAssets(), getTechnicians().catch(() => [])];
    if (isEditing) requests.push(getMaintenanceRecord(id));

    Promise.all(requests)
      .then(([assetList, techList, record]) => {
        setAssets(assetList);
        setTechnicians(techList || []);
        if (!record) return;
        setAssetId(String(record.assetId));
        setMaintenanceType(record.maintenanceType || '');
        setScheduledDate(record.scheduledDate?.slice(0, 10) || '');
        setCompletedDate(record.completedDate?.slice(0, 10) || '');
        setStatus(record.status || 'planned');
        setTechnicianId(record.technicianId ? String(record.technicianId) : '');
        setTechnician(record.technician || '');
        setCost(record.cost ?? '');
        setNotes(record.notes || '');
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  async function saveMaintenance(event) {
    event.preventDefault();
    setError('');

    try {
      const maintenanceData = {
        assetId,
        maintenanceType,
        scheduledDate,
        completedDate: completedDate || null,
        status,
        technicianId: technicianId ? Number(technicianId) : null,
        technician: technician || null,
        cost: cost === '' ? null : Number(cost),
        notes,
      };
      const record = isEditing
        ? await updateMaintenanceRecord(id, maintenanceData)
        : await createMaintenanceRecord(maintenanceData);
      navigate(`/maintenance/${record.id}`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>{isEditing ? 'Edit Maintenance' : 'New Maintenance'}</h1>
      {error && <p>{error}</p>}
      {assets.length === 0 && <p>Create an asset before adding maintenance.</p>}

      <form onSubmit={saveMaintenance}>
        <label>
          Asset
          <select value={assetId} onChange={(event) => setAssetId(event.target.value)} required>
            <option value="">Select an asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.assetCode} — {asset.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Maintenance type
          <input value={maintenanceType} onChange={(event) => setMaintenanceType(event.target.value)} required />
        </label>
        <br />
        <label>
          Scheduled date
          <input
            type="date"
            value={scheduledDate}
            onChange={(event) => setScheduledDate(event.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Completed date
          <input
            type="date"
            min={scheduledDate || undefined}
            value={completedDate}
            onChange={(event) => setCompletedDate(event.target.value)}
          />
        </label>
        <br />
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="planned">Planned</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <br />
        <label className="technician-field-label">
          Technician (User)
          <TechnicianSearchSelect
            technicians={technicians}
            selectedId={technicianId}
            selectedName={technician}
            onChange={({ id: selectedTechId, name: selectedTechName }) => {
              setTechnicianId(selectedTechId ? String(selectedTechId) : '');
              setTechnician(selectedTechName || '');
            }}
          />
        </label>
        <br />
        <label>
          Cost
          <input type="number" min="0" step="0.01" value={cost} onChange={(event) => setCost(event.target.value)} />
        </label>
        <br />
        <label>
          Notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        <br />
        <button className="button" type="submit" disabled={assets.length === 0}>
          <Icon name="save" /> Save
        </button>
      </form>

      <Link to="/maintenance">
        <button className="button-outline" type="button">
          <Icon name="arrowLeft" /> Cancel
        </button>
      </Link>
    </>
  );
}

export default MaintenanceFormPage;
