import { useLocation, useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  function login(event) {
    event.preventDefault();
    localStorage.setItem('authenticated', 'true');
    navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
  }

  return (
    <main>
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
    </main>
  );
}

export default LoginPage;
