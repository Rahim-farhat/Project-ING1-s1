import React, { useState } from 'react';
import TextInput from '../shared/TextInput.jsx';
import { login as apiLogin } from '../utils/auth.jsx';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiLogin({ email, password });
      onLogin(data); // expects { token, user }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="form-stack">
        <TextInput label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <TextInput label="Password" type="password" value={password} onChange={setPassword} placeholder="Password" />

        {error && <div className="error">{error}</div>}

        <div className="row" style={{ marginTop: 8 }}>
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <button type="button" className="btn ghost" onClick={onSwitchToRegister}>
            Create account
          </button>
        </div>
      </form>

      <p className="small-muted">You can create an account via the register form or use backend /api/auth/register.</p>
    </div>
  );
}
