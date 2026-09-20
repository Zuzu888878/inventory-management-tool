import pool from './config.js';
import { hashPassword, validatePassword } from './passwords.js';
import usersRepository from './usersData.js';

const username = process.env.APP_USERNAME;
const password = process.env.APP_PASSWORD;

try {
  if (!username || !password) {
    throw new Error('APP_USERNAME and APP_PASSWORD must be configured');
  }

  const passwordError = validatePassword(password);
  if (passwordError) throw new Error(`APP_PASSWORD: ${passwordError}`);

  const existingUser = await usersRepository.getUserByUsername(username);
  if (existingUser) {
    console.log(`Admin seed skipped: user "${existingUser.username}" already exists`);
  } else {
    const passwordHash = await hashPassword(password);
    const user = await usersRepository.createUser({
      username,
      displayName: 'Administrator',
      passwordHash,
      role: 'admin',
    });
    console.log(`Created admin user "${user.username}"`);
  }
} catch (error) {
  console.error('Failed to seed admin user:', error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
