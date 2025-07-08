import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    alert(data.message);
    setFormData({ first_name: '', last_name: '', email: '', message: '' });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <h2>Contact Us</h2>
      <p>If you have any inquiries or questions, feel free to reach out!</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Type your message here..."
          value={formData.message}
          onChange={handleChange}
          rows="5"
          required
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;
