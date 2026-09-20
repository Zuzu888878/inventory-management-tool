import pool from './config.js';

const mapSparePart = (row) => ({
  id: row.id,
  name: row.name,
  manufacturerNumber: row.manufacturer_number,
  compatibleMachineType: row.compatible_machine_type,
  quantityInStock: row.quantity_in_stock,
  description: row.description,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getAllSpareParts = async () => {
  const result = await pool.query('SELECT * FROM spare_parts ORDER BY name');
  return result.rows.map(mapSparePart);
};

const getSparePartById = async (id) => {
  const result = await pool.query('SELECT * FROM spare_parts WHERE id = $1', [id]);
  return result.rows[0] ? mapSparePart(result.rows[0]) : null;
};

const createSparePart = async (sparePart) => {
  const result = await pool.query(
    `INSERT INTO spare_parts (
            name,
            manufacturer_number,
            compatible_machine_type,
            quantity_in_stock,
            description
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
    [
      sparePart.name,
      sparePart.manufacturerNumber,
      sparePart.compatibleMachineType,
      sparePart.quantityInStock ?? 0,
      sparePart.description || '',
    ]
  );
  return mapSparePart(result.rows[0]);
};

const updateSparePart = async (id, sparePart) => {
  const result = await pool.query(
    `UPDATE spare_parts
         SET name = $1,
             manufacturer_number = $2,
             compatible_machine_type = $3,
             quantity_in_stock = $4,
             description = $5,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
    [
      sparePart.name,
      sparePart.manufacturerNumber,
      sparePart.compatibleMachineType,
      sparePart.quantityInStock ?? 0,
      sparePart.description || '',
      id,
    ]
  );
  return result.rows[0] ? mapSparePart(result.rows[0]) : null;
};

const deleteSparePart = async (id) => {
  const result = await pool.query('DELETE FROM spare_parts WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] ? mapSparePart(result.rows[0]) : null;
};

export default {
  getAllSpareParts,
  getSparePartById,
  createSparePart,
  updateSparePart,
  deleteSparePart,
};
