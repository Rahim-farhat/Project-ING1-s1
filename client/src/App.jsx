import React, { useEffect, useState } from 'react';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  // page: 'login' | 'register' | 'profile'
  const [page, setPage] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('app_page')) || 'login';
    } catch {
      return 'login';
    }
  });

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('app_page', JSON.stringify(page));
  }, [page]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  function handleLogin({ token, user }) {
    // token currently stored client-side; in production prefer httpOnly cookie
    localStorage.setItem('token', token);
    setUser(user);
    setPage('profile');
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
    setPage('login');
  }

  function handleRegisterSuccess(payload) {
    // after successful registration we auto-login (payload: { token, user })
    handleLogin(payload);
  }

  return (
    <div className="app-shell">
      <div>
        <h1 className="app-title">Auth demo</h1>
        <div className="card">
          {page === 'login' && (
            <Login
              onLogin={handleLogin}
              onSwitchToRegister={() => setPage('register')}
            />
          )}

          {page === 'register' && (
            <Register
              onRegisterSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setPage('login')}
            />
          )}

          {page === 'profile' && user && (
            <Profile user={user} onLogout={handleLogout} onSwitchToLogin={() => setPage('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
