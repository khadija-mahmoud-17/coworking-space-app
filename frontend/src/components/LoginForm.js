import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password, role })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    alert(data.message);

  } catch (err) {
    console.error("Login failed:", err.message);
    alert("Login failed. See console for details.");
  }
};
  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <label>
        Role:
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="Student">Student</option>
          <option value="Professor">Professor</option>
          <option value="Guest">Guest</option>
        </select>
      </label>

      <input
        type={role === 'Student' ? 'text' : 'email'}
        placeholder={
          role === 'Student'
            ? 'Matriculation number or Student Email'
            : role === 'Professor'
            ? 'Work Email'
            : 'Personal Email'
        }
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
}

export default LoginForm;
