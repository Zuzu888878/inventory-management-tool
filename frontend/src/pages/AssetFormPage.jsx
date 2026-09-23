import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAsset, getAsset, updateAsset } from '../api/assets.js';
import { Icon } from '../components/Icon.jsx';
import { CategorySearchSelect } from '../components/CategorySearchSelect.jsx';

function AssetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [assetCode, setAssetCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [machineType, setMachineType] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState('active');
  const [location, setLocation] = useState('');
  const [supplier, setSupplier] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [iotState, setIotState] = useState('unknown');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    getAsset(id)
      .then((asset) => {
        setAssetCode(asset.assetCode || '');
        setName(asset.name || '');
        setCategory(asset.category || '');
        setMachineType(asset.machineType || '');
        setSerialNumber(asset.serialNumber || '');
        setStatus(asset.status || 'active');
        setLocation(asset.location || '');
        setSupplier(asset.supplier || '');
        setPurchaseDate(asset.purchaseDate?.slice(0, 10) || '');
        setNextMaintenanceDate(asset.nextMaintenanceDate?.slice(0, 10) || '');
        setIotState(asset.iotState || 'unknown');
        setNotes(asset.notes || '');
      })
      .catch((requestError) => setError(requestError.message));
  }, [id, isEditing]);

  async function saveAsset(event) {
    event.preventDefault();
    setError('');

    try {
      const assetData = {
        assetCode,
        name,
        category,
        machineType,
        serialNumber,
        status,
        location,
        supplier,
        purchaseDate: purchaseDate || null,
        nextMaintenanceDate: nextMaintenanceDate || null,
        iotState,
        notes,
      };

      const asset = isEditing ? await updateAsset(id, assetData) : await createAsset(assetData);

      navigate(`/assets/${asset.id}`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <h1>{isEditing ? `Edit Asset` : 'New Asset'}</h1>
      {error && <p className="form-error" role="alert">{error}</p>}

      <form className="entity-form" onSubmit={saveAsset}>
        <section className="form-section">
          <div className="form-section-heading"><div><h2>Identity</h2><p>The details used to find and identify this asset.</p></div></div>
          <div className="form-grid">
            <label>Asset code<input value={assetCode} onChange={(event) => setAssetCode(event.target.value)} autoComplete="off" required /></label>
            <label>Asset name<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" required /></label>
            <label>Category<CategorySearchSelect value={category} onChange={setCategory} /></label>
            <label>Machine type<input value={machineType} onChange={(event) => setMachineType(event.target.value)} placeholder="e.g. CNC mill" /></label>
            <label className="form-field-wide">Serial number<input value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} autoComplete="off" /></label>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-heading"><div><h2>Operations</h2><p>Current condition, location, and connected-device state.</p></div></div>
          <div className="form-grid">
            <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="active">Active</option><option value="maintenance">Maintenance</option><option value="warning">Warning</option><option value="critical">Critical</option><option value="offline">Offline</option></select></label>
            <label>IoT state<select value={iotState} onChange={(event) => setIotState(event.target.value)}><option value="unknown">Unknown</option><option value="online">Online</option><option value="offline">Offline</option></select></label>
            <label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} autoComplete="off" /></label>
            <label>Supplier<input value={supplier} onChange={(event) => setSupplier(event.target.value)} autoComplete="organization" /></label>
          </div>
        </section>

        <section className="form-section">
          <div className="form-section-heading"><div><h2>Lifecycle</h2><p>Dates for ownership and preventive maintenance planning.</p></div></div>
          <div className="form-grid">
            <label>Purchase date<input type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} /></label>
            <label>Next maintenance<input type="date" min={purchaseDate || undefined} value={nextMaintenanceDate} onChange={(event) => setNextMaintenanceDate(event.target.value)} /></label>
            <label className="form-field-wide">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Useful operating, warranty, or handover notes…" /></label>
          </div>
        </section>

        <div className="form-actions"><button className="button" type="submit"><Icon name="save" /> Save asset</button><Link className="button-outline" to="/assets"><Icon name="arrowLeft" /> Cancel</Link></div>
      </form>
    </>
  );
}

export default AssetFormPage;
