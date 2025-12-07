import React from 'react';

export default function TextInput({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <label>
      <div className="field-label">{label}</div>
      <input
        className="input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
      />
    </label>
  );
}
