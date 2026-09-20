import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login as authenticate } from '../api/auth.js';

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
    <main>
      <h1>Login</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={login}>
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
        <button type="submit" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
