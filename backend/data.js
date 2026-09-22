import pool from './config.js';

const mapAsset = (row) => ({
    id: row.id,
    assetCode: row.asset_code,
    name: row.name,
    category: row.category,
    machineType: row.machine_type,
    serialNumber: row.serial_number,
    location: row.location,
    status: row.status,
    supplier: row.supplier,
    purchaseDate: row.purchase_date,
    nextMaintenanceDate: row.next_maintenance_date,
    iotState: row.iot_state,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

const getAllAssets = async () => {
    const result = await pool.query(
        'SELECT * FROM assets ORDER BY created_at DESC'
    );
    return result.rows.map(mapAsset);
};

const getAssetById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM assets WHERE id = $1',
        [id]
    );
    return result.rows[0] ? mapAsset(result.rows[0]) : null;
};

const createAsset = async (asset) => {
    const result = await pool.query(
        `INSERT INTO assets (
      asset_code,
      name,
      category,
      machine_type,
      serial_number,
      location,
      status,
      supplier,
      purchase_date,
      next_maintenance_date,
      iot_state,
      notes
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING *`,
        [
            asset.assetCode,
            asset.name,
            asset.category,
            asset.machineType,
            asset.serialNumber,
            asset.location,
            asset.status || 'active',
            asset.supplier,
            asset.purchaseDate || null,
            asset.nextMaintenanceDate || null,
            asset.iotState || 'unknown',
            asset.notes || ''
        ]
    );

    return mapAsset(result.rows[0]);
};

const updateAsset = async (id, asset) => {
    const result = await pool.query(
        `UPDATE assets
     SET asset_code = $1,
         name = $2,
         category = $3,
         machine_type = $4,
         serial_number = $5,
         location = $6,
         status = $7,
         supplier = $8,
         purchase_date = $9,
         next_maintenance_date = $10,
         iot_state = $11,
         notes = $12,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $13
     RETURNING *`,
        [
            asset.assetCode,
            asset.name,
            asset.category,
            asset.machineType,
            asset.serialNumber,
            asset.location,
            asset.status,
            asset.supplier,
            asset.purchaseDate || null,
            asset.nextMaintenanceDate || null,
            asset.iotState || 'unknown',
            asset.notes || '',
            id
        ]
    );

    return result.rows[0] ? mapAsset(result.rows[0]) : null;
};

const deleteAsset = async (id) => {
    const result = await pool.query(
        'DELETE FROM assets WHERE id = $1 RETURNING *',
        [id]
    );

    return result.rows[0] ? mapAsset(result.rows[0]) : null;
};

export default {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset
};