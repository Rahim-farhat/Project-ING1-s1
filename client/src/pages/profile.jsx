import React from 'react';

export default function Profile({ user, onLogout, onSwitchToLogin }) {
  return (
    <div>
      <h3 style={{ marginTop: 0 }}>Welcome</h3>
      <p style={{ marginBottom: 8 }}>{user?.name || user?.email}</p>
      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn danger" onClick={onLogout}>Logout</button>
        <button className="btn ghost" onClick={onSwitchToLogin}>Back to login</button>
      </div>
    </div>
  );
}
