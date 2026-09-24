import sparePartsRepository from './spareParts.repository.js';

const validateSparePart = (sparePart) => {
  if (!sparePart.name) return 'Name is required';
  if (!Number.isInteger(sparePart.quantityInStock) || sparePart.quantityInStock < 0) {
    return 'Quantity in stock must be a non-negative integer';
  }
  return null;
};

export const getAllSpareParts = async (req, res) => {
  try {
    res.json(await sparePartsRepository.getAllSpareParts());
  } catch (error) {
    res.status(500).json({ message: 'Failed to load spare parts', error: error.message });
  }
};

export const getSparePartById = async (req, res) => {
  try {
    const sparePart = await sparePartsRepository.getSparePartById(req.params.id);
    if (!sparePart) return res.status(404).json({ message: 'Spare part not found' });
    res.json(sparePart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load spare part', error: error.message });
  }
};

export const createSparePart = async (req, res) => {
  const validationError = validateSparePart(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const sparePart = await sparePartsRepository.createSparePart(req.body);
    res.status(201).json(sparePart);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create spare part', error: error.message });
  }
};

export const updateSparePart = async (req, res) => {
  const validationError = validateSparePart(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const sparePart = await sparePartsRepository.updateSparePart(req.params.id, req.body);
    if (!sparePart) return res.status(404).json({ message: 'Spare part not found' });
    res.json(sparePart);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update spare part', error: error.message });
  }
};

export const deleteSparePart = async (req, res) => {
  try {
    const sparePart = await sparePartsRepository.deleteSparePart(req.params.id);
    if (!sparePart) return res.status(404).json({ message: 'Spare part not found' });
    res.json({ message: 'Spare part deleted successfully', sparePart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete spare part', error: error.message });
  }
};
