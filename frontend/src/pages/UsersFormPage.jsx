import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createUser, getUser, updateUser } from '../api/users.js';
import { Icon } from '../components/Icon.jsx';

export function UsersFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;

    getUser(id)
      .then((user) => {
        setUsername(user.username);
        setDisplayName(user.displayName);
        setRole(user.role);
        setIsActive(user.isActive);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  async function saveUser(event) {
    event.preventDefault();
    setError('');

    try {
      const userData = { username, displayName, password, role, isActive };
      if (isEditing && !password) delete userData.password;

      if (isEditing) {
        await updateUser(id, userData);
      } else {
        await createUser(userData);
      }
      navigate('/users');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>{isEditing ? 'Edit User' : 'New User'}</h1>
      {error && <p>{error}</p>}

      <form onSubmit={saveUser}>
        <label>
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            minLength="3"
            maxLength="100"
            pattern="[A-Za-z0-9._-]+"
            required
          />
        </label>
        <label>
          Display name
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
        </label>
        <label>
          {isEditing ? 'New password (leave blank to keep current password)' : 'Password'}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required={!isEditing}
            autoComplete="new-password"
          />
        </label>
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
        <label>
          <span>
            <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /> Active
          </span>
        </label>
        <button className="button" type="submit">
          <Icon name="save" /> Save
        </button>
      </form>

      <Link to="/users">
        <button className="button-outline" type="button">
          <Icon name="arrowLeft" /> Cancel
        </button>
      </Link>
    </>
  );
}
