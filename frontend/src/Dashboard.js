import React from 'react';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h2>Welcome, {user?.username || 'Guest'}!</h2>
      <p>Your email: {user?.email}</p>
    </div>
  );
}

export default Dashboard;
