import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterForm() {
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [matriculation, setMatriculation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!role) {
      alert("Please select a role");
      return;
    }

    const payload = {
      role,
      email,
      password,
      first_name: firstName,
      last_name: lastName
    };

    if (role === 'Student') {
      payload.matriculation = matriculation;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      alert(data.message);
    } catch (err) {
      console.error("Registration failed:", err.message);
      alert("Registration failed. See console for details.");
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Register</h2>

      <label>Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Select a role</option>
        <option value="Student">Student</option>
        <option value="Guest">Guest</option>
        <option value="Professor">Professor</option>
      </select>

      {role && (
        <>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          {role === 'Student' && (
            <input
              type="text"
              placeholder="Matriculation Number"
              value={matriculation}
              onChange={(e) => setMatriculation(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder={
              role === 'Student'
                ? "Student Email"
                : role === 'Professor'
                ? "Work Email"
                : "Personal Email"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </>
      )}

      <button type="submit" disabled={!role}>Register</button>

      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}

export default RegisterForm;
