import dashboardRepository from './dashboard.repository.js';

export const getDashboard = async (req, res) => {
  try {
    res.json(await dashboardRepository.getDashboard());
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard', error: error.message });
  }
};
