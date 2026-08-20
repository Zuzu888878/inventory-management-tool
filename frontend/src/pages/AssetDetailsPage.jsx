import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteAsset, getAsset } from '../api/assets.js';

function AssetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAsset(id)
      .then(setAsset)
      .catch((requestError) => setError(requestError.message));
  }, [id]);

  async function removeAsset() {
    try {
      await deleteAsset(id);
      navigate('/assets');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!asset) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>{asset.name}</h1>
      <p>{asset.description}</p>
      <ul>
        <li>Status: {asset.status || 'Not set'}</li>
        <li>Location: {asset.location || 'Not set'}</li>
        <li>Next Maintenance: {asset.nextMaintenance || 'Not set'}</li>
      </ul>
      <div className="actions">
        <Link to={`/assets/${id}/edit`}>
          <button type="button">Edit</button>
        </Link>
        <button type="button" onClick={removeAsset}>
          Delete
        </button>
        <Link to="/assets">
          <button type="button">Back</button>
        </Link>
      </div>
    </>
  );
}

export default AssetDetailsPage;
