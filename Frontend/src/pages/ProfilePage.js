import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import { TextField } from "@mui/material";

export default function ProfilePage() {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      history.push("/login");
    } else {
      setUser(storedUser);
      axios
        .get(`http://localhost:5000/api/profile/${storedUser.id}`)
        .then((res) => setBooking(res.data.active_booking))
        .catch(() => setBooking(null));
    }
  }, [history]);

  const handleCancel = () => {
    axios
      .delete(`http://localhost:5000/api/bookings/${booking.id}`)
      .then(() => {
        alert("Booking cancelled.");
        setBooking(null);
        setEditing(false);
      })
      .catch((err) => console.error("Cancel failed", err));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedBooking = {
      seat: form.seat.value,
      start_time: form.start_time.value,
      end_time: form.end_time.value,
    };

    axios
      .put(`http://localhost:5000/api/bookings/${booking.id}`, updatedBooking)
      .then(() => {
        alert("Booking updated.");
        setBooking({ ...booking, ...updatedBooking });
        setEditing(false);
      })
      .catch((err) => console.error("Update failed", err));
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${user.id}`);
      localStorage.removeItem("user");
      alert("Your account has been deleted.");
      history.push("/login");
    } catch (err) {
      console.error("Delete account failed", err);
      alert("Failed to delete your account.");
    }
  };

  if (!user) return null;

  return (
    <>
      <DefaultNavbar routes={routes} center />
      <MKBox minHeight="100vh" display="flex" flexDirection="column" justifyContent="space-between">
        <MKBox
          sx={{
            mt: 12,
            px: 3,
            py: 5,
            maxWidth: "700px",
            mx: "auto",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <MKTypography variant="h3" gutterBottom>
            My Profile
          </MKTypography>

          <MKTypography variant="h6" mt={2}>
            Name:{" "}
            <span style={{ fontWeight: "normal" }}>
              {user.first_name} {user.last_name}
            </span>
          </MKTypography>

          <MKTypography variant="h6" mt={1}>
            Email: <span style={{ fontWeight: "normal" }}>{user.email}</span>
          </MKTypography>

          <MKTypography variant="h6" mt={1}>
            Role: <span style={{ fontWeight: "normal" }}>{user.role}</span>
          </MKTypography>

          {user.role === "Student" && user.matriculation && (
            <MKTypography variant="h6" mt={1}>
              Matriculation Number:{" "}
              <span style={{ fontWeight: "normal" }}>{user.matriculation}</span>
            </MKTypography>
          )}

          {booking ? (
            <MKBox mt={4}>
              <MKTypography variant="h5" mb={1}>
                Active Booking
              </MKTypography>

              {editing ? (
                <form onSubmit={handleUpdate}>
                  <TextField
                    fullWidth
                    name="seat"
                    label="Seat Number"
                    margin="normal"
                    defaultValue={booking.seat}
                  />
                  <TextField
                    fullWidth
                    name="start_time"
                    type="datetime-local"
                    label="Start Time"
                    margin="normal"
                    defaultValue={booking.start_time.slice(0, 16)}
                  />
                  <TextField
                    fullWidth
                    name="end_time"
                    type="datetime-local"
                    label="End Time"
                    margin="normal"
                    defaultValue={booking.end_time.slice(0, 16)}
                  />
                  <MKBox mt={2} display="flex" gap={2}>
                    <MKButton type="submit" color="info">
                      Save Changes
                    </MKButton>
                    <MKButton onClick={() => setEditing(false)} variant="outlined">
                      Cancel
                    </MKButton>
                  </MKBox>
                </form>
              ) : (
                <>
                  <MKTypography>Seat: {booking.seat}</MKTypography>
                  <MKTypography>
                    Time: {new Date(booking.start_time).toLocaleString()} –{" "}
                    {new Date(booking.end_time).toLocaleString()}
                  </MKTypography>
                  <MKBox mt={2} display="flex" gap={2}>
                    <MKButton color="info" onClick={() => setEditing(true)}>
                      Edit Booking
                    </MKButton>
                    <MKButton color="error" variant="outlined" onClick={handleCancel}>
                      Cancel Booking
                    </MKButton>
                  </MKBox>
                </>
              )}
            </MKBox>
          ) : (
            <MKTypography mt={3}>No active booking.</MKTypography>
          )}

          <MKBox mt={4}>
            <MKButton color="error" variant="contained" onClick={handleDeleteAccount}>
              Delete Account
            </MKButton>
          </MKBox>
        </MKBox>
      </MKBox>
    </>
  );
}
