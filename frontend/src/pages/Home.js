import React from 'react';
import { Link } from 'react-router-dom';
import CrowdStatus from './CrowdStatus';
import './Home.css'; // Optional for styling

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="home">
      <header style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Welcome to the Coworking Space</h1>
        <p>A shared space for students, professors, and professionals to collaborate.</p>
      </header>

      {/* Show welcome if logged in */}
      {user && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Welcome, {user.first_name || 'Guest'}!</h2>
          <p>Your email: {user.email}</p>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <img
          src="/coworking.jpg"
          alt="Coworking Space"
          style={{ width: '80%', maxWidth: '600px', borderRadius: '10px' }}
        />
      </div>

      {/* Navigation buttons */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/login"><button>Login</button></Link>
        <Link to="/register"><button>Register</button></Link>
        <Link to="/about"><button>About Us</button></Link>
        <Link to="/locations"><button>Locations</button></Link>
        <Link to="/contact"><button>Contact Us</button></Link>
      </nav>

      {/* CrowdStatus component */}
      <CrowdStatus />
    </div>
  );
}

export default Home;
