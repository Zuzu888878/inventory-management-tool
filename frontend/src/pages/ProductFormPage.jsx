import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProduct, updateProduct } from '../api/products.js';
import { Icon } from '../components/Icon.jsx';

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const [form, setForm] = useState({ sku: '', name: '', description: '', price: '', quantityInStock: 0, imageUrl: '', isActive: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(editing);
  useEffect(() => { if (editing) getProduct(id).then((p) => setForm({ sku: p.sku, name: p.name, description: p.description || '', price: p.price ?? '', quantityInStock: p.quantityInStock, imageUrl: p.imageUrl || '', isActive: p.isActive })).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, [id, editing]);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  async function save(event) { event.preventDefault(); setError(''); try { const payload = { ...form, price: form.price === '' ? null : Number(form.price), quantityInStock: Number(form.quantityInStock) }; if (editing) await updateProduct(id, payload); else await createProduct(payload); navigate('/products'); } catch (e) { setError(e.message); } }
  if (loading) return <p>Loading...</p>;
  return <>
    <h1>{editing ? 'Edit Product' : 'New Product'}</h1>
    {error && <p className="form-error" role="alert">{error}</p>}
    <form className="entity-form" onSubmit={save}>
      <section className="form-section"><div className="form-section-heading"><div><h2>Product details</h2><p>Maintain the catalogue information customers can see.</p></div></div>
        <div className="form-grid">
          <label>SKU<input value={form.sku} onChange={(e) => set('sku', e.target.value)} required /></label>
          <label>Product name<input value={form.name} onChange={(e) => set('name', e.target.value)} required /></label>
          <label>Price (CHF)<input type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} /></label>
          <label>Stock quantity<input type="number" min="0" step="1" value={form.quantityInStock} onChange={(e) => set('quantityInStock', e.target.value)} required /></label>
          <label>Image URL<input value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://..." /></label>
          <label className="toggle-field"><input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} /><span><strong>Visible to customers</strong><small>Inactive products remain visible to staff only.</small></span></label>
          <label className="form-grid-full">Description<textarea rows="5" value={form.description} onChange={(e) => set('description', e.target.value)} /></label>
        </div>
      </section>
      <div className="form-actions"><button className="button" type="submit"><Icon name="save" /> Save product</button><Link className="button-outline" to="/products"><Icon name="arrowLeft" /> Cancel</Link></div>
    </form>
  </>;
}
