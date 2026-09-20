import maintenanceRepository from './maintenanceData.js';

const allowedStatuses = new Set(['planned', 'in_progress', 'completed', 'cancelled']);

const validateMaintenance = (maintenance) => {
  if (!maintenance.assetId) return 'Asset is required';
  if (!maintenance.maintenanceType?.trim()) return 'Maintenance type is required';
  if (!maintenance.scheduledDate) return 'Scheduled date is required';
  if (maintenance.status && !allowedStatuses.has(maintenance.status)) return 'Invalid status';
  if (maintenance.cost !== null && maintenance.cost !== undefined && Number(maintenance.cost) < 0) {
    return 'Cost must be non-negative';
  }
  if (maintenance.completedDate && maintenance.completedDate < maintenance.scheduledDate) {
    return 'Completed date cannot be before the scheduled date';
  }
  return null;
};

const sendDatabaseError = (res, error, action) => {
  if (error.code === '23503') {
    return res.status(400).json({ message: 'The selected asset does not exist' });
  }
  if (error.code === '23514' || error.code === '22P02') {
    return res.status(400).json({ message: 'Invalid maintenance data' });
  }
  return res.status(500).json({ message: `Failed to ${action} maintenance`, error: error.message });
};

export const getAllMaintenance = async (req, res) => {
  try {
    res.json(await maintenanceRepository.getAllMaintenance());
  } catch (error) {
    sendDatabaseError(res, error, 'load');
  }
};

export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await maintenanceRepository.getMaintenanceById(req.params.id);
    if (!maintenance) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json(maintenance);
  } catch (error) {
    sendDatabaseError(res, error, 'load');
  }
};

export const createMaintenance = async (req, res) => {
  const validationError = validateMaintenance(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const maintenance = await maintenanceRepository.createMaintenance(req.body);
    res.status(201).json(maintenance);
  } catch (error) {
    sendDatabaseError(res, error, 'create');
  }
};

export const updateMaintenance = async (req, res) => {
  const validationError = validateMaintenance(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const maintenance = await maintenanceRepository.updateMaintenance(req.params.id, req.body);
    if (!maintenance) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json(maintenance);
  } catch (error) {
    sendDatabaseError(res, error, 'update');
  }
};

export const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await maintenanceRepository.deleteMaintenance(req.params.id);
    if (!maintenance) return res.status(404).json({ message: 'Maintenance record not found' });
    res.json({ message: 'Maintenance record deleted successfully', maintenance });
  } catch (error) {
    sendDatabaseError(res, error, 'delete');
  }
};
