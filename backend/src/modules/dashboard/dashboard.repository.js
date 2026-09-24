import pool from '../../config/database.js';

const getDashboard = async () => {
  const [assetSummary, sparePartSummary, maintenanceSummary, schedule, lowStock] = await Promise.all([
    pool.query(`
      SELECT COUNT(*)::INTEGER AS total,
             COUNT(*) FILTER (WHERE status = 'active')::INTEGER AS active,
             COUNT(*) FILTER (WHERE status IN ('warning', 'critical', 'maintenance', 'offline'))::INTEGER AS needs_attention,
             COUNT(*) FILTER (WHERE iot_state = 'offline')::INTEGER AS offline
      FROM assets`),
    pool.query(`
      SELECT COUNT(*)::INTEGER AS total_items,
             COALESCE(SUM(quantity_in_stock), 0)::INTEGER AS total_units,
             COUNT(*) FILTER (WHERE quantity_in_stock = 0)::INTEGER AS out_of_stock,
             COUNT(*) FILTER (WHERE quantity_in_stock BETWEEN 1 AND 5)::INTEGER AS low_stock
      FROM spare_parts`),
    pool.query(`
      SELECT COUNT(*) FILTER (WHERE status IN ('planned', 'in_progress'))::INTEGER AS open,
             COUNT(*) FILTER (WHERE status IN ('planned', 'in_progress') AND scheduled_date < CURRENT_DATE)::INTEGER AS overdue,
             COUNT(*) FILTER (WHERE status IN ('planned', 'in_progress') AND scheduled_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 30)::INTEGER AS due_soon,
             COUNT(*) FILTER (WHERE status = 'in_progress')::INTEGER AS in_progress,
             COUNT(*) FILTER (WHERE status = 'completed' AND completed_date >= DATE_TRUNC('month', CURRENT_DATE))::INTEGER AS completed_this_month,
             COALESCE(SUM(cost) FILTER (WHERE status = 'completed' AND completed_date >= DATE_TRUNC('month', CURRENT_DATE)), 0)::NUMERIC AS cost_this_month
      FROM maintenance_records`),
    pool.query(`
      SELECT maintenance_records.id, maintenance_records.asset_id,
             maintenance_records.maintenance_type, maintenance_records.scheduled_date,
             maintenance_records.status, maintenance_records.technician, maintenance_records.technician_id,
             users.display_name AS technician_name,
             assets.asset_code, assets.name AS asset_name,
             (maintenance_records.scheduled_date - CURRENT_DATE)::INTEGER AS days_until
      FROM maintenance_records
      JOIN assets ON assets.id = maintenance_records.asset_id
      LEFT JOIN users ON users.id = maintenance_records.technician_id
      WHERE maintenance_records.status IN ('planned', 'in_progress')
        AND maintenance_records.scheduled_date <= CURRENT_DATE + 30
      ORDER BY maintenance_records.scheduled_date, maintenance_records.id
      LIMIT 10`),
    pool.query(`
      SELECT id, name, quantity_in_stock
      FROM spare_parts
      WHERE quantity_in_stock <= 5
      ORDER BY quantity_in_stock, name
      LIMIT 10`),
  ]);

  const assets = assetSummary.rows[0];
  const spareParts = sparePartSummary.rows[0];
  const maintenance = maintenanceSummary.rows[0];

  return {
    generatedAt: new Date().toISOString(),
    assets: {
      total: assets.total,
      active: assets.active,
      needsAttention: assets.needs_attention,
      offline: assets.offline,
    },
    spareParts: {
      totalItems: spareParts.total_items,
      totalUnits: spareParts.total_units,
      lowStock: spareParts.low_stock,
      outOfStock: spareParts.out_of_stock,
    },
    maintenance: {
      open: maintenance.open,
      overdue: maintenance.overdue,
      dueSoon: maintenance.due_soon,
      inProgress: maintenance.in_progress,
      completedThisMonth: maintenance.completed_this_month,
      costThisMonth: Number(maintenance.cost_this_month),
    },
    schedule: schedule.rows.map((row) => ({
      id: row.id,
      assetId: row.asset_id,
      assetCode: row.asset_code,
      assetName: row.asset_name,
      maintenanceType: row.maintenance_type,
      scheduledDate: row.scheduled_date,
      status: row.status,
      technicianId: row.technician_id ? Number(row.technician_id) : null,
      technician: row.technician_name || row.technician || null,
      daysUntil: row.days_until,
    })),
    lowStockItems: lowStock.rows.map((row) => ({
      id: row.id,
      name: row.name,
      quantityInStock: row.quantity_in_stock,
    })),
  };
};

export default { getDashboard };
