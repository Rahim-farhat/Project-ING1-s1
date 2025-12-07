import { useState } from 'react';
import TextInput from '../shared/TextInput';
import { login as apiLogin } from '../utils/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await apiLogin({ email, password });
      // apiLogin returns { token, user }
      onLogin(data);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card auth-card">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} className="form-stack">
        <TextInput label="Email" value={email} onChange={setEmail} placeholder="you@example.com" />
        <TextInput label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password" />

        {error && <div className="error-text">{error}</div>}

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="small-muted">Need an account? Create one via the backend <code>/api/auth/register</code> endpoint.</p>
    </div>
  );
}
