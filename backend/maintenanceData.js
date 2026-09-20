import pool from './config.js';

const selectMaintenance = `
  SELECT maintenance_records.*, assets.asset_code, assets.name AS asset_name
  FROM maintenance_records
  JOIN assets ON assets.id = maintenance_records.asset_id
`;

const mapMaintenance = (row) => ({
  id: row.id,
  assetId: row.asset_id,
  assetCode: row.asset_code,
  assetName: row.asset_name,
  maintenanceType: row.maintenance_type,
  scheduledDate: row.scheduled_date,
  completedDate: row.completed_date,
  status: row.status,
  technician: row.technician,
  cost: row.cost === null ? null : Number(row.cost),
  notes: row.notes,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const getAllMaintenance = async () => {
  const result = await pool.query(`${selectMaintenance} ORDER BY scheduled_date, id`);
  return result.rows.map(mapMaintenance);
};

const getMaintenanceById = async (id) => {
  const result = await pool.query(`${selectMaintenance} WHERE maintenance_records.id = $1`, [id]);
  return result.rows[0] ? mapMaintenance(result.rows[0]) : null;
};

const createMaintenance = async (maintenance) => {
  const result = await pool.query(
    `INSERT INTO maintenance_records (
      asset_id, maintenance_type, scheduled_date, completed_date,
      status, technician, cost, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id`,
    [
      maintenance.assetId,
      maintenance.maintenanceType,
      maintenance.scheduledDate,
      maintenance.completedDate || null,
      maintenance.status || 'planned',
      maintenance.technician || null,
      maintenance.cost ?? null,
      maintenance.notes || '',
    ]
  );
  return getMaintenanceById(result.rows[0].id);
};

const updateMaintenance = async (id, maintenance) => {
  const result = await pool.query(
    `UPDATE maintenance_records
     SET asset_id = $1,
         maintenance_type = $2,
         scheduled_date = $3,
         completed_date = $4,
         status = $5,
         technician = $6,
         cost = $7,
         notes = $8,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $9
     RETURNING id`,
    [
      maintenance.assetId,
      maintenance.maintenanceType,
      maintenance.scheduledDate,
      maintenance.completedDate || null,
      maintenance.status || 'planned',
      maintenance.technician || null,
      maintenance.cost ?? null,
      maintenance.notes || '',
      id,
    ]
  );
  return result.rows[0] ? getMaintenanceById(result.rows[0].id) : null;
};

const deleteMaintenance = async (id) => {
  const maintenance = await getMaintenanceById(id);
  if (!maintenance) return null;

  await pool.query('DELETE FROM maintenance_records WHERE id = $1', [id]);
  return maintenance;
};

export default {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
