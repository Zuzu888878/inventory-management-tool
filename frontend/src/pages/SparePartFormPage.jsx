import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { createSparePart, getSparePart, updateSparePart } from '../api/spareParts.js';
import { Icon } from '../components/Icon.jsx';
import { dashboardState, sparePartsState } from '../state/inventoryAtoms.js';
import { markDashboardStale, upsertCachedItem } from '../state/cacheUtils.js';

function SparePartFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const setSparePartsCache = useSetRecoilState(sparePartsState);
  const setDashboardCache = useSetRecoilState(dashboardState);

  const [name, setName] = useState('');
  const [manufacturerNumber, setManufacturerNumber] = useState('');
  const [compatibleMachineType, setCompatibleMachineType] = useState('');
  const [quantityInStock, setQuantityInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    getSparePart(id)
      .then((sparePart) => {
        setName(sparePart.name || '');
        setManufacturerNumber(sparePart.manufacturerNumber || '');
        setCompatibleMachineType(sparePart.compatibleMachineType || '');
        setQuantityInStock(sparePart.quantityInStock ?? 0);
        setDescription(sparePart.description || '');
      })
      .catch((requestError) => setError(requestError.message));
  }, [id, isEditing]);

  async function saveSparePart(event) {
    event.preventDefault();
    setError('');

    try {
      const sparePartData = {
        name,
        manufacturerNumber,
        compatibleMachineType,
        quantityInStock: Number(quantityInStock),
        description,
      };

      const sparePart = isEditing ? await updateSparePart(id, sparePartData) : await createSparePart(sparePartData);
      setSparePartsCache((cache) => upsertCachedItem(cache, sparePart));
      setDashboardCache(markDashboardStale);

      navigate(`/spare-parts/${sparePart.id}`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <h1>{isEditing ? 'Edit Spare Part' : 'New Spare Part'}</h1>

      {error && <p className="form-error" role="alert">{error}</p>}

      <form className="entity-form" onSubmit={saveSparePart}>
        <section className="form-section">
          <div className="form-section-heading"><div><h2>Part details</h2><p>Use a clear name and supplier reference for quick identification.</p></div></div>
          <div className="form-grid">
            <label>Part name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. ER32 Collet 12 mm" autoComplete="off" required /></label>
            <label>Manufacturer number<input value={manufacturerNumber} onChange={(event) => setManufacturerNumber(event.target.value)} placeholder="e.g. COL-ER32-12" autoComplete="off" /></label>
            <label className="form-field-wide">Compatible machine type<input value={compatibleMachineType} onChange={(event) => setCompatibleMachineType(event.target.value)} placeholder="e.g. VF-4SS or DMU 50" /></label>
          </div>
        </section>
        <section className="form-section">
          <div className="form-section-heading"><div><h2>Inventory</h2><p>Set the quantity currently available for use.</p></div></div>
          <div className="form-grid">
            <label>Quantity in stock<input type="number" min="0" step="1" inputMode="numeric" value={quantityInStock} onChange={(event) => setQuantityInStock(event.target.value)} placeholder="e.g. 24" required /></label>
            <label className="form-field-wide">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Specifications, storage location, or fitting notes…" /></label>
          </div>
        </section>
        <div className="form-actions"><button className="button" type="submit"><Icon name="save" /> Save part</button><Link className="button-outline" to="/spare-parts"><Icon name="arrowLeft" /> Cancel</Link></div>
      </form>
    </>
  );
}

export default SparePartFormPage;
