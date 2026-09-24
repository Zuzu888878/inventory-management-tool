import pool from '../../config/database.js';

export const USER_ROLES = Object.freeze(['admin', 'editor', 'viewer', 'customer']);

const normalizeUsername = (username = '') => String(username).trim().toLowerCase();

const mapUser = (row) => ({
  id: row.id,
  username: row.username,
  displayName: row.display_name,
  role: row.role,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const validateUser = (user, passwordRequired = true) => {
  const username = normalizeUsername(user.username || '');
  if (!/^[a-z0-9._-]{3,100}$/.test(username)) {
    return 'Username must be 3-100 characters and use only letters, numbers, dots, underscores, or hyphens';
  }
  if (!user.displayName?.trim()) return 'Display name is required';
  if (!USER_ROLES.includes(user.role)) return 'Invalid user role';
  if (passwordRequired && !user.passwordHash) return 'Password hash is required';
  return null;
};

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, username, display_name, role, is_active, created_at, updated_at
     FROM users
     ORDER BY username`
  );
  return result.rows.map(mapUser);
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, username, display_name, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
};

const getUserByUsername = async (username) => {
  const result = await pool.query(
    `SELECT id, username, display_name, role, is_active, created_at, updated_at
     FROM users
     WHERE username = $1`,
    [normalizeUsername(username)]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
};

const getUserCredentialsByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [normalizeUsername(username)]);
  if (!result.rows[0]) return null;
  return { ...mapUser(result.rows[0]), passwordHash: result.rows[0].password_hash };
};

const createUser = async (user) => {
  const validationError = validateUser(user);
  if (validationError) throw new Error(validationError);

  const result = await pool.query(
    `INSERT INTO users (username, display_name, password_hash, role, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, username, display_name, role, is_active, created_at, updated_at`,
    [normalizeUsername(user.username), user.displayName.trim(), user.passwordHash, user.role, user.isActive ?? true]
  );
  return mapUser(result.rows[0]);
};

const updateUser = async (id, user) => {
  const validationError = validateUser(user, false);
  if (validationError) throw new Error(validationError);

  const result = await pool.query(
    `UPDATE users
     SET username = $1,
         display_name = $2,
         role = $3,
         password_hash = COALESCE($4, password_hash),
         is_active = $5,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING id, username, display_name, role, is_active, created_at, updated_at`,
    [
      normalizeUsername(user.username),
      user.displayName.trim(),
      user.role,
      user.passwordHash || null,
      user.isActive ?? true,
      id,
    ]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
};

const deleteUser = async (id) => {
  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING id, username, display_name, role, is_active, created_at, updated_at`,
    [id]
  );
  return result.rows[0] ? mapUser(result.rows[0]) : null;
};

const countActiveAdmins = async () => {
  const result = await pool.query(
    `SELECT COUNT(*)::INTEGER AS count
     FROM users
     WHERE role = 'admin' AND is_active = TRUE`
  );
  return result.rows[0].count;
};

export default {
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserCredentialsByUsername,
  createUser,
  updateUser,
  deleteUser,
  countActiveAdmins,
};
