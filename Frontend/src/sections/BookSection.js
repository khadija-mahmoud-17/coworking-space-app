import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import Flatpickr from "react-flatpickr";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "flatpickr/dist/themes/material_blue.css";

const useStyles = makeStyles(() => ({
  container: {
    padding: "100px 20px",
    textAlign: "center",
    maxWidth: "900px",
    margin: "0 auto",
  },
  input: {
    marginBottom: "20px",
    display: "block",
    width: "100%",
    padding: "8px",
    fontSize: "1rem",
  },
  seatButton: {
    margin: "5px",
  },
  selectedSeat: {
    margin: "5px",
  },
  imageRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "nowrap",
    overflowX: "auto",
  },
  image: {
    width: "100%",
    maxWidth: "600px",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    flexShrink: 0,
  },
}));

export default function BookSection() {
  const classes = useStyles();
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, success: true, text: "" });
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchAvailableSeats = async () => {
    if (!user) {
      alert("Please log in to check seat availability.");
      setAvailableSeats([]);
      return;
    }
    if (!start || !end) return alert("Select both start and end time");
    try {
      const res = await fetch(
        `http://localhost:5000/api/available-seats?start=${start.toISOString()}&end=${end.toISOString()}`
      );
      const data = await res.json();
      setAvailableSeats(data);
      setSelectedSeat(null);
    } catch (err) {
      console.error("Error fetching seats", err);
    }
  };

  const bookSelectedSeat = async () => {
    if (!user) {
      alert("Please log in to book a seat.");
      return;
    }
    if (!selectedSeat || !start || !end) {
      alert("Please select a seat, start time, and end time.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/book-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_id: selectedSeat.id,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          user_id: user.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, success: true, text: "✅ Seat booked successfully!" });
        setSelectedSeat(null);
        fetchAvailableSeats();
      } else {
        setSnackbar({ open: true, success: false, text: `❌ ${data.message}` });
      }
    } catch (err) {
      console.error("Booking error", err);
      setSnackbar({ open: true, success: false, text: "❌ Booking failed" });
    }
  };

  return (
    <section id="book">
      <MKBox className={classes.container}>
        <div className={classes.imageRow}>
          <img
            src={`${process.env.PUBLIC_URL}/images/seats.png`}
            alt="Seat Plan"
            className={classes.image}
          />
        </div>

        <MKTypography variant="h2" mb={2}>
          Book a Seat
        </MKTypography>

        <MKTypography variant="body1" mb={1}>
          Start Time
        </MKTypography>
        <Flatpickr
          data-enable-time
          value={start}
          onChange={([date]) => setStart(date)}
          className={classes.input}
          options={{ dateFormat: "Y-m-d H:i" }}
        />

        <MKTypography variant="body1" mt={3} mb={1}>
          End Time
        </MKTypography>
        <Flatpickr
          data-enable-time
          value={end}
          onChange={([date]) => setEnd(date)}
          className={classes.input}
          options={{ dateFormat: "Y-m-d H:i" }}
        />

        <MKButton color="info" onClick={fetchAvailableSeats} className={classes.input}>
          Check Available Seats
        </MKButton>

        {!user && (
          <MKTypography color="warning" mt={2}>
            Please log in to interact with seats.
          </MKTypography>
        )}

        {availableSeats.length > 0 && (
          <>
            <h3 style={{ marginTop: "2rem" }}>Available Seats</h3>
            <div>
              {availableSeats.map((seat) => (
                <MKButton
                  key={seat.id}
                  variant="outlined"
                  size="small"
                  color={selectedSeat?.id === seat.id ? "success" : "info"}
                  className={
                    selectedSeat?.id === seat.id ? classes.selectedSeat : classes.seatButton
                  }
                  onClick={() => {
                    if (!user) {
                      alert("Please log in to select a seat.");
                      return;
                    }
                    setSelectedSeat(seat);
                  }}
                >
                  {seat.label} ({seat.area})
                </MKButton>
              ))}
            </div>
          </>
        )}

        {selectedSeat && start && end && (
          <>
            <MKTypography mt={3} mb={1}>
              Selected: {selectedSeat.label}
            </MKTypography>
            <MKButton color="info" onClick={bookSelectedSeat}>
              Confirm Booking
            </MKButton>
          </>
        )}

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
