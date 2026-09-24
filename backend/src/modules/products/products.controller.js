import productsRepository from './products.repository.js';

const validate = (body) => {
  if (!body?.sku?.trim()) return 'SKU is required';
  if (!body?.name?.trim()) return 'Product name is required';
  if (body.price !== null && typeof body.price !== 'undefined' && (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)) return 'Price must be a non-negative number';
  if (!Number.isInteger(Number(body.quantityInStock)) || Number(body.quantityInStock) < 0) return 'Stock quantity must be a non-negative integer';
  if (typeof body.isActive !== 'undefined' && typeof body.isActive !== 'boolean') return 'Active state must be true or false';
  return null;
};

const sendError = (res, error, action) => {
  if (error.code === '23505') return res.status(409).json({ message: 'SKU already exists' });
  if (error.code === '23514') return res.status(400).json({ message: 'Invalid product data' });
  return res.status(500).json({ message: `Failed to ${action} product`, error: error.message });
};

export const getProducts = async (req, res) => {
  try { res.json(await productsRepository.getAllProducts({ includeInactive: req.user.role !== 'customer' })); }
  catch (error) { sendError(res, error, 'load'); }
};

export const getProduct = async (req, res) => {
  try {
    const product = await productsRepository.getProductById(req.params.id);
    if (!product || (req.user.role === 'customer' && !product.isActive)) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { sendError(res, error, 'load'); }
};

export const createProduct = async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  try { res.status(201).json(await productsRepository.createProduct(req.body)); }
  catch (dbError) { sendError(res, dbError, 'create'); }
};

export const updateProduct = async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  try {
    const product = await productsRepository.updateProduct(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (dbError) { sendError(res, dbError, 'update'); }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await productsRepository.deleteProduct(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) { sendError(res, error, 'delete'); }
};
