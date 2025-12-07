const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    // prefer server message if present
    throw new Error(data?.message || 'Login failed');
  }
  return data; // { token, user }
}
