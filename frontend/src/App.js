import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Locations from './pages/Locations';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Footer from './components/Footer';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>p
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
