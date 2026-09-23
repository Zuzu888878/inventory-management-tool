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
      {error && <p className="form-error" role="alert">{error}</p>}
      {assets.length === 0 && <p className="form-notice">Create an asset before adding maintenance.</p>}

      <form className="entity-form" onSubmit={saveMaintenance}>
        <section className="form-section">
          <div className="form-section-heading"><div><h2>Work order</h2><p>Select the asset and describe the maintenance to be performed.</p></div></div>
          <div className="form-grid">
            <label className="form-field-wide">Asset<select value={assetId} onChange={(event) => setAssetId(event.target.value)} required><option value="">Select an asset</option>{assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.assetCode} — {asset.name}</option>)}</select></label>
            <label className="form-field-wide">Maintenance type<input value={maintenanceType} onChange={(event) => setMaintenanceType(event.target.value)} list="maintenance-types" placeholder="e.g. Annual inspection" required /></label>
          </div>
          <datalist id="maintenance-types"><option value="Inspection" /><option value="Preventive maintenance" /><option value="Repair" /><option value="Calibration" /></datalist>
        </section>

        <section className="form-section">
          <div className="form-section-heading"><div><h2>Schedule &amp; ownership</h2><p>Set the timing, current progress, and responsible technician.</p></div></div>
          <div className="form-grid">
            <label>Scheduled date<input type="date" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} required /></label>
            <label>Completed date<input type="date" min={scheduledDate || undefined} value={completedDate} onChange={(event) => setCompletedDate(event.target.value)} /></label>
            <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="planned">Planned</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label>
            <label className="technician-field-label">Technician<TechnicianSearchSelect technicians={technicians} selectedId={technicianId} selectedName={technician} onChange={({ id: selectedTechId, name: selectedTechName }) => { setTechnicianId(selectedTechId ? String(selectedTechId) : ''); setTechnician(selectedTechName || ''); }} /></label>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-heading"><div><h2>Completion notes</h2><p>Track the cost and any useful follow-up information.</p></div></div>
          <div className="form-grid">
            <label>Cost (CHF)<input type="number" min="0" step="0.01" inputMode="decimal" value={cost} onChange={(event) => setCost(event.target.value)} placeholder="0.00" /></label>
            <label className="form-field-wide">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Work completed, parts used, safety notes, or next steps…" /></label>
          </div>
        </section>
        <div className="form-actions"><button className="button" type="submit" disabled={assets.length === 0}><Icon name="save" /> Save maintenance</button><Link className="button-outline" to="/maintenance"><Icon name="arrowLeft" /> Cancel</Link></div>
      </form>
    </>
  );
}

export default MaintenanceFormPage;
