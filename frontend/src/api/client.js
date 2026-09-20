const TOKEN_KEY = 'apiToken';

export async function request(url, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || 'Request failed');
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem('authenticated', 'true');
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('authenticated');
}

export function hasToken() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}
