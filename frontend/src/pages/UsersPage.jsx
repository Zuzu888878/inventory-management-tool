import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteUser, getUsers } from '../api/users.js';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function removeUser(user) {
    if (!window.confirm(`Delete user "${user.username}"?`)) return;

    setError('');
    try {
      await deleteUser(user.id);
      setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== user.id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <h1>Users</h1>
      <Link to="/users/new">
        <button type="button">New User</button>
      </Link>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Display name</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.displayName}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                <td>
                  <Link to={`/users/${user.id}/edit`}>Edit</Link>{' '}
                  <button type="button" onClick={() => removeUser(user)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default UsersPage;
