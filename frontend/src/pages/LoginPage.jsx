import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login as authenticate } from '../api/auth.js';
import { Icon } from '../components/Icon.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function login(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const form = new FormData(event.currentTarget);

    try {
      await authenticate(form.get('username'), form.get('password'));
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark">L</span>
          <span>Leets Inventory</span>
        </div>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your inventory.</p>
      {error && <p role="alert">{error}</p>}
      <form className="login-form" onSubmit={login}>
        <label>
          Username
          <input name="username" required />
        </label>
        <br />
        <label>
          Password
          <input name="password" type="password" required />
        </label>
        <br />
        <button className="button" type="submit" disabled={submitting}>
          <Icon name="login" /> {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      </div>
    </main>
  );
}

export default LoginPage;
