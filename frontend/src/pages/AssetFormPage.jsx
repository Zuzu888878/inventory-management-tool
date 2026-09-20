import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAsset, getAsset, updateAsset } from '../api/assets.js';

function AssetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [assetCode, setAssetCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
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
      {error && <p>{error}</p>}

      <form onSubmit={saveAsset}>
        <label>
          Asset Code
          <input value={assetCode} onChange={(event) => setAssetCode(event.target.value)} required />
        </label>

        <br />

        <label>
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>

        <br />

        <label>
          Category
          <input value={category} onChange={(event) => setCategory(event.target.value)} required />
        </label>

        <br />

        <label>
          Serial Number
          <input value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} />
        </label>

        <br />

        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="offline">Offline</option>
          </select>
        </label>

        <br />

        <label>
          Location
          <input value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>

        <br />

        <label>
          Supplier
          <input value={supplier} onChange={(event) => setSupplier(event.target.value)} />
        </label>

        <br />

        <label>
          Purchase Date
          <input type="date" value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} />
        </label>

        <br />

        <label>
          Next Maintenance
          <input
            type="date"
            value={nextMaintenanceDate}
            onChange={(event) => setNextMaintenanceDate(event.target.value)}
          />
        </label>

        <br />

        <label>
          IoT State
          <select value={iotState} onChange={(event) => setIotState(event.target.value)}>
            <option value="unknown">Unknown</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </label>

        <br />

        <label>
          Notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>

        <br />

        <button type="submit">Save</button>
      </form>

      <Link to="/assets">
        <button type="button">Cancel</button>
      </Link>
    </>
  );
}

export default AssetFormPage;
