import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/products.js';
import { getCurrentUser } from '../api/client.js';
import { Icon } from '../components/Icon.jsx';

const formatPrice = (price) => price === null || typeof price === 'undefined'
  ? 'Price on request'
  : new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(price);

export default function ProductsPage() {
  const currentUser = getCurrentUser();
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'editor';
  const canDelete = currentUser?.role === 'admin';
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const load = () => getProducts().then(setProducts).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  async function removeProduct(id) {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); await load(); }
    catch (e) { setError(e.message); }
  }

  return (
    <>
      <div className="page-heading">
        <div><h1>Products</h1>
            <p>Browse the products available in the catalogue.For orders and enquiries, please contact us by telephone</p>
        </div>
          {canManage && <Link className="button" to="/products/new"><Icon name="plus" /> New product</Link>}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <section className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            {product.imageUrl ? <img className="product-image" src={product.imageUrl} alt="" /> : <div className="product-image product-image-placeholder"><Icon name="package" /></div>}
            <div className="product-card-body">
              <div className="product-card-top"><span className="product-sku">{product.sku}</span>{!product.isActive && <span className="status-badge">Inactive</span>}</div>
              <h2>{product.name}</h2>
              <p>{product.description || 'No description available.'}</p>
              <div className="product-card-footer"><strong>{formatPrice(product.price)}</strong><span>{product.quantityInStock} in stock</span></div>
              {canManage && <div className="product-actions"><Link className="button-outline" to={`/products/${product.id}/edit`}>Edit</Link>{canDelete && <button className="button-outline danger" type="button" onClick={() => removeProduct(product.id)}>Delete</button>}</div>}
            </div>
          </article>
        ))}
        {!products.length && <p className="empty-state">No products are currently available.</p>}
      </section>
    </>
  );
}
