import { createAuthToken } from '../../utils/authTokens.js';
import { verifyPassword } from '../../utils/passwords.js';
import usersRepository from '../users/users.repository.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!process.env.API_TOKEN) {
    return res.status(503).json({ message: 'Login is not configured' });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  try {
    const user = await usersRepository.getUserCredentialsByUsername(username);
    if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.json({
      token: createAuthToken(user),
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
