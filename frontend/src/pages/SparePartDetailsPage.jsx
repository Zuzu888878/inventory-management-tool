import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adjustSparePartStock, deleteSparePart, getSparePart } from '../api/spareParts.js';
import { Icon } from '../components/Icon.jsx';

function SparePartDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sparePart, setSparePart] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [stockAmount, setStockAmount] = useState('');
  const [stockError, setStockError] = useState('');
  const [stockMessage, setStockMessage] = useState('');
  const [updatingStock, setUpdatingStock] = useState(false);

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

  async function changeStock(event) {
    event.preventDefault();
    setStockMessage('');
    const amount = Number(stockAmount);
    if (!Number.isSafeInteger(amount) || amount < 1) {
      setStockError('Enter a whole number greater than zero.');
      return;
    }

    const removing = event.nativeEvent.submitter?.value === 'remove';
    setUpdatingStock(true);
    setStockError('');
    try {
      const updated = await adjustSparePartStock(id, removing ? -amount : amount);
      setSparePart(updated);
      setStockAmount('');
      setStockMessage(
        `${removing ? 'Removed' : 'Added'} ${amount} ${amount === 1 ? 'unit' : 'units'} ${removing ? 'from' : 'to'} stock.`
      );
    } catch (requestError) {
      setStockError(requestError.message);
    } finally {
      setUpdatingStock(false);
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

      <section className="stock-adjustment" aria-labelledby="stock-adjustment-title">
        <h2 id="stock-adjustment-title">Update stock</h2>
        <p>Enter a quantity, then add it to stock or record parts used.</p>
        <form className="stock-adjustment-form" onSubmit={changeStock}>
          <label>
            Quantity
            <input
              type="number"
              min="1"
              max="2147483647"
              step="1"
              required
              value={stockAmount}
              onChange={(event) => setStockAmount(event.target.value)}
              disabled={updatingStock}
            />
          </label>
          <div className="stock-adjustment-actions">
            <button className="button" type="submit" name="stockAction" value="add" disabled={updatingStock}>
              <Icon name="plus" /> Restock
            </button>
            <button className="button-outline" type="submit" name="stockAction" value="remove" disabled={updatingStock}>
              <Icon name="minus" /> Use / remove
            </button>
          </div>
        </form>
        {stockMessage && (
          <p className="stock-action-message" role="status">
            {stockMessage}
          </p>
        )}
        {stockError && (
          <p className="stock-action-error" role="alert">
            {stockError}
          </p>
        )}
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
