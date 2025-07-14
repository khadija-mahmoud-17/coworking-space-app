import React, { useState } from "react";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import Footer from "components/Footer";
import routes from "routes";

// Material Kit 2 components
import MKBox from "components/MKBox";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function AboutPage() {
  const coworkImage = `${process.env.PUBLIC_URL}/images/CWS-image.jpg`;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    success: true,
    text: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ⬅️ THIS IS THE FIX
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSnackbar({ open: true, success: true, text: data.message });
        setFormData({ first_name: "", last_name: "", email: "", message: "" });
      } else {
        setSnackbar({
          open: true,
          success: false,
          text: data.message || "Failed to send message",
        });
      }
    } catch (err) {
      setSnackbar({ open: true, success: false, text: "Server error" });
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} center />
      <div
        id="about"
        style={{
          paddingTop: "100px",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <h1>About Our Coworking Space</h1>

        <img
          src={coworkImage}
          alt="Coworking Space"
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        />

        {/* Contact Form */}
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", marginBottom: "3rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Your First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Your Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Message</label>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="form-control"
              rows="5"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>

        {/* Google Maps */}
        <h2 style={{ marginTop: "3rem" }}>Our Location</h2>
        <iframe
          title="CWS Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d661.8444805203259!2d12.935596173366912!3d48.430086058128914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4775b12870cf8629%3A0x4d5f6b243117ee23!2sTexas-Kobold%20Irish%20Pub%20Pfarrkirchen!5e0!3m2!1sen!2sde!4v1751932100852!5m2!1sen!2sde"
          width="100%"
          height="400"
          style={{ border: 0, marginTop: "1rem" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.success ? "success" : "error"} sx={{ width: "100%" }}>
          {snackbar.text}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
}

export default AboutPage;
