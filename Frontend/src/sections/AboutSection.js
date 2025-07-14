import React, { useState } from "react";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Card, CardContent } from "@mui/material";

export default function AboutSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [snackbar, setSnackbar] = useState({ open: false, success: true, text: "" });
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameParts = formData.name.split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.slice(1).join(" ") || "";

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          first_name,
          last_name,
          email: formData.email,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, success: true, text: data.message });
        setConfirmationMessage("Thank you! Your message has been sent successfully.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSnackbar({ open: true, success: false, text: data.message || "Failed to send message" });
        setConfirmationMessage("");
      }
    } catch {
      setSnackbar({ open: true, success: false, text: "Server error" });
      setConfirmationMessage("");
    }
  };

  return (
    <section id="about">
      <MKBox px={4} py={6} display="flex" flexDirection="column" alignItems="center">
        <h1 style={{ marginBottom: "1rem" }}>Why This Space?</h1>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.6, textAlign: "center" }}>
          <strong>No flexible, welcoming space</strong> for work, networking, or relaxation.
          <br />
          <strong>Disconnected community:</strong> few opportunities for cross-group interaction.
          <br />
          International students with no hub for integration or networking.
        </p>

        <h2 style={{ marginTop: "3rem" }}>The Innovation Hub</h2>
        <p
          style={{
            fontSize: "1.2rem",
            fontStyle: "italic",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          A space that bridges productivity and community.
          <br />
          <strong style={{ fontSize: "1.5rem" }}>
            A co-creative coworking hub for students, professors, locals and entrepreneurs:
            <br />
            BY THE COMMUNITY, FOR THE COMMUNITY.
          </strong>
        </p>

        <img
          src="/images/inohub.png"
          alt="About the Community"
          style={{ width: "100%", height: "auto", marginBottom: "3rem", borderRadius: "8px" }}
        />

        <h2 style={{ marginTop: "4rem" }}>Meet the Team</h2>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          <Card sx={{ width: 250, textAlign: "center" }}>
            <img
              src="/images/Sena.png"
              alt="Zahide Sena Dokuyucu"
              style={{ width: "100%", height: 250, objectFit: "cover" }}
            />
            <CardContent>
              <h3>Zahide Sena Dokuyucu</h3>
              <p>Frontend Developer</p>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, textAlign: "center" }}>
            <img
              src="/images/Khadija.png"
              alt="Khadija Mahmoud"
              style={{ width: "100%", height: 250, objectFit: "cover" }}
            />
            <CardContent>
              <h3>Khadija Mahmoud</h3>
              <p>Backend Developer</p>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, textAlign: "center" }}>
            <img
              src="/images/Nina.png"
              alt="Yllka Ninaj"
              style={{ width: "100%", height: 250, objectFit: "cover" }}
            />
            <CardContent>
              <h3>Yllka Ninaj</h3>
              <p>Business Lead</p>
            </CardContent>
          </Card>
        </div>

        <h2 style={{ marginTop: "4rem" }}>Contact Us</h2>
        <MKBox
          component={Card}
          sx={{ width: "100%", maxWidth: "none", mt: 2, padding: 4, boxShadow: 3 }}
        >
          <form onSubmit={handleSubmit}>
            <MKBox mb={2}>
              <MKInput
                name="name"
                label="Name"
                variant="standard"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                name="email"
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                required
              />
            </MKBox>
            <MKBox mb={2}>
              <MKInput
                name="message"
                label="Message"
                variant="standard"
                multiline
                rows={4}
                fullWidth
                value={formData.message}
                onChange={handleChange}
                required
              />
            </MKBox>
            <MKButton type="submit" variant="gradient" color="info" fullWidth>
              Send Message
            </MKButton>

            {confirmationMessage && (
              <MKBox
                mt={2}
                p={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#e8f5e9",
                  border: "1px solid #a5d6a7",
                  borderRadius: "6px",
                }}
              >
                <CheckCircleOutlineIcon sx={{ color: "#2e7d32", marginRight: "8px" }} />
                <span style={{ color: "#2e7d32", fontWeight: 500 }}>{confirmationMessage}</span>
              </MKBox>
            )}
          </form>
        </MKBox>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert severity={snackbar.success ? "success" : "error"} sx={{ width: "100%" }}>
            {snackbar.text}
          </Alert>
        </Snackbar>
      </MKBox>
    </section>
  );
}
