import pool from '../../config/database.js';

const mapProduct = (row) => ({
  id: row.id,
  sku: row.sku,
  name: row.name,
  description: row.description,
  price: row.price === null ? null : Number(row.price),
  quantityInStock: row.quantity_in_stock,
  imageUrl: row.image_url,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getAllProducts = async ({ includeInactive = false } = {}) => {
  const result = await pool.query(
    `SELECT id, sku, name, description, price, quantity_in_stock, image_url, is_active, created_at, updated_at
     FROM products
     ${includeInactive ? '' : 'WHERE is_active = TRUE'}
     ORDER BY name, sku`
  );
  return result.rows.map(mapProduct);
};

const getProductById = async (id) => {
  const result = await pool.query(
    `SELECT id, sku, name, description, price, quantity_in_stock, image_url, is_active, created_at, updated_at
     FROM products WHERE id = $1`,
    [id]
  );
  return result.rows[0] ? mapProduct(result.rows[0]) : null;
};

const createProduct = async (product) => {
  const result = await pool.query(
    `INSERT INTO products (sku, name, description, price, quantity_in_stock, image_url, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, sku, name, description, price, quantity_in_stock, image_url, is_active, created_at, updated_at`,
    [product.sku.trim(), product.name.trim(), product.description?.trim() || '', product.price ?? null, product.quantityInStock ?? 0, product.imageUrl?.trim() || null, product.isActive ?? true]
  );
  return mapProduct(result.rows[0]);
};

const updateProduct = async (id, product) => {
  const result = await pool.query(
    `UPDATE products
     SET sku = $1, name = $2, description = $3, price = $4, quantity_in_stock = $5,
         image_url = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
     WHERE id = $8
     RETURNING id, sku, name, description, price, quantity_in_stock, image_url, is_active, created_at, updated_at`,
    [product.sku.trim(), product.name.trim(), product.description?.trim() || '', product.price ?? null, product.quantityInStock ?? 0, product.imageUrl?.trim() || null, product.isActive ?? true, id]
  );
  return result.rows[0] ? mapProduct(result.rows[0]) : null;
};

const deleteProduct = async (id) => {
  const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id, sku, name', [id]);
  return result.rows[0] || null;
};

export default { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
