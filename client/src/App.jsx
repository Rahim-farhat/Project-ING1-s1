import { useEffect, useState } from 'react';
import Login from './pages/login';
import Profile from './pages/profile';
import './App.css';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  function handleLogin({ token, user }) {
    // Save token and set user
    localStorage.setItem('token', token);
    setUser(user);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <>
      <div className="header-logos">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src="/src/assets/react.svg" className="logo react" alt="React logo" />
        </a>
      </div>

      <h1 className="app-title">Vite + React — Login demo</h1>

      <div className="app-container">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Profile user={user} onLogout={handleLogout} />
        )}
      </div>

      <p className="read-the-docs">This demo uses localStorage for the JWT token. Replace with httpOnly cookies for production.</p>
    </>
  );
}
