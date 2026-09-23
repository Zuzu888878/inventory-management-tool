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
      {error && <p className="form-error" role="alert">{error}</p>}

      <form className="entity-form" onSubmit={saveUser}>
        <section className="form-section">
          <div className="form-section-heading"><div><h2>User profile</h2><p>Choose a recognisable name and a unique sign-in handle.</p></div></div>
          <div className="form-grid">
            <label>Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" required /></label>
            <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} minLength="3" maxLength="100" pattern="[A-Za-z0-9._-]+" autoComplete="username" spellCheck="false" required /></label>
          </div>
        </section>
        <section className="form-section">
          <div className="form-section-heading"><div><h2>Access</h2><p>Control the role, account state, and password.</p></div></div>
          <div className="form-grid">
            <label>Role<select value={role} onChange={(event) => setRole(event.target.value)}><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select></label>
            <label>{isEditing ? 'New password' : 'Password'}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required={!isEditing} autoComplete="new-password" placeholder={isEditing ? 'Leave blank to keep current password' : ''} /></label>
            <label className="toggle-field"><input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} /><span><strong>Active account</strong><small>Allow this user to sign in and access the workspace.</small></span></label>
          </div>
        </section>
        <div className="form-actions"><button className="button" type="submit"><Icon name="save" /> Save user</button><Link className="button-outline" to="/users"><Icon name="arrowLeft" /> Cancel</Link></div>
      </form>
    </>
  );
}
