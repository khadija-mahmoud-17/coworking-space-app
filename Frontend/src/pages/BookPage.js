import React, { useEffect, useState } from "react";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import { makeStyles } from "@material-ui/core/styles";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKProgress from "components/MKProgress";
import Button from "@material-ui/core/Button";

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
    padding: "10px 15px",
    backgroundColor: "#e0e0e0",
    border: "1px solid #999",
    cursor: "pointer",
  },
  selectedSeat: {
    backgroundColor: "#4caf50",
    color: "white",
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
    maxWidth: "400px",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    flexShrink: 0,
  },
}));

export default function BookPage() {
  const classes = useStyles();
  const [capacity] = useState(50);
  const [occupancy, setOccupancy] = useState(0);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/crowd-status");
        const data = await res.json();
        setOccupancy(data.people_inside);
      } catch (err) {
        console.error("Error fetching crowd status", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const usage = capacity ? Math.min((occupancy / capacity) * 100, 100) : 0;

  const fetchAvailableSeats = async () => {
    if (!start || !end) return alert("Select both start and end time");
    try {
      const res = await fetch(
        `http://localhost:5000/api/available-seats?start=${start}&end=${end}`
      );
      const data = await res.json();
      setAvailableSeats(data);
      setSelectedSeat(null);
      setMessage("");
    } catch (err) {
      console.error("Error fetching seats", err);
    }
  };

  const bookSelectedSeat = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("You must be logged in!");

    try {
      const res = await fetch("http://localhost:5000/api/book-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_id: selectedSeat.id,
          start_time: start,
          end_time: end,
          user_id: user.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Seat booked successfully!");
        setSelectedSeat(null);
        fetchAvailableSeats(); // refresh available
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Booking error", err);
      setMessage("❌ Booking failed");
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} />
      <MKBox className={classes.container}>
        {/* TOP IMAGES */}
        <div className={classes.imageRow}>
          <img src="/meetingroom.png" alt="Main Room" className={classes.image} />
          <img src="/seats.png" alt="Meeting Room" className={classes.image} />
        </div>

        <MKTypography variant="h2" mb={2}>
          Book a Seat
        </MKTypography>

        <MKTypography variant="body1" mb={1}>
          Capacity: {capacity}
        </MKTypography>
        <MKTypography variant="body1" mb={2}>
          Current Occupancy: {occupancy}
        </MKTypography>
        <MKProgress color="info" value={usage} label />

        <hr style={{ margin: "30px 0" }} />

        <label>Start Time</label>
        <input
          type="datetime-local"
          className={classes.input}
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <label>End Time</label>
        <input
          type="datetime-local"
          className={classes.input}
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />

        <Button variant="contained" color="primary" onClick={fetchAvailableSeats}>
          Check Available Seats
        </Button>

        {availableSeats.length > 0 && (
          <>
            <h3 style={{ marginTop: "2rem" }}>Available Seats</h3>
            <div>
              {availableSeats.map((seat) => (
                <button
                  key={seat.id}
                  className={`${classes.seatButton} ${
                    selectedSeat?.id === seat.id ? classes.selectedSeat : ""
                  }`}
                  onClick={() => setSelectedSeat(seat)}
                >
                  {seat.label} ({seat.area})
                </button>
              ))}
            </div>
          </>
        )}

        {selectedSeat && (
          <>
            <MKTypography mt={3} mb={1}>
              Selected: {selectedSeat.label}
            </MKTypography>
            <Button variant="contained" color="secondary" onClick={bookSelectedSeat}>
              Confirm Booking
            </Button>
          </>
        )}

        {message && (
          <MKTypography mt={2} color="info">
            {message}
          </MKTypography>
        )}
      </MKBox>
    </>
  );
}
