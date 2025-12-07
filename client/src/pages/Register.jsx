import React, { useState } from 'react';
import TextInput from '../shared/TextInput.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // call backend register endpoint
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Registration failed');

      // Optionally, login immediately if backend returns token/user.
      // If backend returns only success, you might want to call login endpoint after registration.
      if (data.token && data.user) {
        onRegisterSuccess(data);
      } else {
        // fallback: if register succeeded but no token, show success and switch to login
        onSwitchToLogin();
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-stack">
        <TextInput label="Full name" value={name} onChange={setName} placeholder="Jane Doe" />
        <TextInput label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <TextInput label="Password" type="password" value={password} onChange={setPassword} placeholder="Choose a password" />

        {error && <div className="error">{error}</div>}

        <div className="row" style={{ marginTop: 8 }}>
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
          <button type="button" className="btn ghost" onClick={onSwitchToLogin}>
            Back to login
          </button>
        </div>
      </form>

      <p className="small-muted">Passwords should be at least 8 characters. Add stronger client-side validation if desired.</p>
    </div>
  );
}
