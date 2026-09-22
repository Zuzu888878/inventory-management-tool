import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteAsset, getAsset } from '../api/assets.js';
import { formatDate } from '../utils/formatDate.js';
import { Icon } from '../components/Icon.jsx';

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
      <div className="detail-heading">
        <h1>{asset.name}</h1>
        <Link to="/assets">
          <button className="button-outline" type="button">
            <Icon name="arrowLeft" /> Back
          </button>
        </Link>
      </div>
      <section className="detail-card">
        <div className="detail-grid">
          <div className="detail-item">
            <span>Asset code</span>
            <strong>{asset.assetCode || 'Not set'}</strong>
          </div>
          <div className="detail-item">
            <span>Category</span>
            <strong>{asset.category || 'Not set'}</strong>
          </div>
          <div className="detail-item">
            <span>Machine Type</span>
            <strong>{asset.machineType || 'Not set'}</strong>
          </div>
          <div className="detail-item">
            <span>Serial number</span>
            <strong>{asset.serialNumber || 'Not set'}</strong>
          </div>
          <div className="detail-item">
            <span>Status</span>
            <strong>{asset.status || 'Not set'}</strong>
          </div>
          <div className="detail-item">
            <span>Location</span>
            <strong>{asset.location || 'Not set'}</strong>
          </div>
          <div className="detail-item">
            <span>Supplier</span>
            <strong>{asset.supplier || 'Not set'}</strong>
          </div>
          <div className="detail-item">
            <span>Purchase date</span>
            <strong>{formatDate(asset.purchaseDate)}</strong>
          </div>
          <div className="detail-item">
            <span>Next maintenance</span>
            <strong>{formatDate(asset.nextMaintenanceDate)}</strong>
          </div>
          <div className="detail-item">
            <span>IoT state</span>
            <strong>{asset.iotState || 'Not set'}</strong>
          </div>
          <div className="detail-item detail-wide">
            <span>Notes</span>
            <strong>{asset.notes || 'Not set'}</strong>
          </div>
        </div>
      </section>
      <div className="actions">
        <Link to={`/assets/${id}/edit`}>
        <button className="button-outline" type="button">
            <Icon name="pencil" /> Edit
          </button>
        </Link>
        <button className="button-destructive" type="button" onClick={removeAsset}>
          <Icon name="trash" /> Delete
        </button>
      </div>
    </>
  );
}

export default AssetDetailsPage;
