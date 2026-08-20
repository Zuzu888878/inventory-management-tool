import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAsset, getAsset, updateAsset } from '../api/assets.js';

function AssetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [location, setLocation] = useState('');
  const [nextMaintenance, setNextMaintenance] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    getAsset(id)
      .then((asset) => {
        setName(asset.name || '');
        setDescription(asset.description || '');
        setStatus(asset.status || 'Active');
        setLocation(asset.location || '');
        setNextMaintenance(asset.nextMaintenance || '');
      })
      .catch((requestError) => setError(requestError.message));
  }, [id, isEditing]);

  async function saveAsset(event) {
    event.preventDefault();
    setError('');

    try {
      const assetData = { name, description, status, location, nextMaintenance };
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
          Name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <br />
        <label>
          Description
          <input value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <br />
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
            <option value="Offline">Offline</option>
          </select>
        </label>
        <br />
        <label>
          Location
          <input value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>
        <br />
        <label>
          Next Maintenance
          <input type="date" value={nextMaintenance} onChange={(event) => setNextMaintenance(event.target.value)} />
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
      <Link to={isEditing ? `/assets/${id}` : '/assets'}>
        <button type="button">Cancel</button>
      </Link>
    </>
  );
}

export default AssetFormPage;
