import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAsset, getAsset, updateAsset } from '../api/assets.js';

function AssetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    getAsset(id)
      .then((asset) => {
        setName(asset.name || '');
        setDescription(asset.description || '');
      })
      .catch((requestError) => setError(requestError.message));
  }, [id, isEditing]);

  async function saveAsset(event) {
    event.preventDefault();
    setError('');

    try {
      const asset = isEditing ? await updateAsset(id, { name, description }) : await createAsset({ name, description });

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
        <button type="submit">Save</button>
      </form>
      <Link to={isEditing ? `/assets/${id}` : '/assets'}>
        <button type="button">Cancel</button>
      </Link>
    </>
  );
}

export default AssetFormPage;
