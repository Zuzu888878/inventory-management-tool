import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteSparePart, getSparePart } from '../api/spareParts.js';
import { Icon } from '../components/Icon.jsx';

function SparePartDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sparePart, setSparePart] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSparePart(id)
      .then(setSparePart)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function removeSparePart() {
    if (!window.confirm('Delete this spare part?')) return;

    try {
      await deleteSparePart(id);
      navigate('/spare-parts');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!sparePart) {
    return <p>Spare part not found.</p>;
  }

  return (
    <>
      <div className="detail-heading">
        <h1>{sparePart.name}</h1>
        <Link to="/spare-parts">
          <button className="button-outline" type="button">
            <Icon name="arrowLeft" /> Back
          </button>
        </Link>
      </div>

      <section className="detail-card">
        <div className="detail-grid">
          <div className="detail-item">
            <span>Manufacturer number</span>
            <strong>{sparePart.manufacturerNumber || 'Not set'}</strong>
          </div>
          <div className="detail-item">
            <span>Compatible machine type</span>
            <strong>{sparePart.compatibleMachineType || 'Not set'}</strong>
          </div>
          <div className="detail-item">
            <span>Quantity in stock</span>
            <strong>{sparePart.quantityInStock ?? 0}</strong>
          </div>
          <div className="detail-item detail-wide">
            <span>Description</span>
            <strong>{sparePart.description || 'Not set'}</strong>
          </div>
        </div>
      </section>

      <div className="actions">
        <Link to={`/spare-parts/${sparePart.id}/edit`}>
          <button className="button-outline" type="button">
            <Icon name="pencil" /> Edit
          </button>
        </Link>
        <button className="button-destructive" type="button" onClick={removeSparePart}>
          <Icon name="trash" /> Delete
        </button>
      </div>
    </>
  );
}

export default SparePartDetailsPage;
