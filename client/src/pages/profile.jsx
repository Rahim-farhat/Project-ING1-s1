export default function Profile({ user, onLogout }) {
  return (
    <div className="card auth-card">
      <h2>Welcome</h2>
      <p>{user?.name || user?.email}</p>
      <div style={{ marginTop: 16 }}>
        <button className="btn danger" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
