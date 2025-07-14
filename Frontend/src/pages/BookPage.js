import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKProgress from "components/MKProgress";
import MKButton from "components/MKButton";
import MKDatePicker from "components/MKDatePicker";

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
    maxWidth: "400px",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    flexShrink: 0,
  },
}));

export default function BookSection() {
  const classes = useStyles();
  const [capacity] = useState(50);
  const [occupancy, setOccupancy] = useState(0);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/crowd-status", {
          credentials: 'include'
        });
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
        `${process.env.REACT_APP_API_BASE_URL}/api/available-seats?start=${start.toISOString()}&end=${end.toISOString()}`,
        { credentials: 'include' }
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
      const res = await fetch("/api/book-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          seat_id: selectedSeat.id,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          user_id: user.id,
        }),
      });


      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Seat booked successfully!");
        setSelectedSeat(null);
        fetchAvailableSeats();
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Booking error", err);
      setMessage("❌ Booking failed");
    }
  };

  return (
    <section id="book">
      <MKBox className={classes.container}>
        {/* TOP IMAGES */}
        <div className={classes.imageRow}>
          <img
            src={`${process.env.PUBLIC_URL}/images/meetingroom.png`}
            alt="Main Room"
            className={classes.image}
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/seats.png`}
            alt="Meeting Room"
            className={classes.image}
          />
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

        <MKBox mb={2}>
          <MKDatePicker
            value={start}
            onChange={([date]) => setStart(date)}
            options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
            input={{ label: "Start Time", variant: "standard", fullWidth: true }}
          />
        </MKBox>
        <MKBox mb={2}>
          <MKDatePicker
            value={end}
            onChange={([date]) => setEnd(date)}
            options={{ enableTime: true, dateFormat: "Y-m-d H:i" }}
            input={{ label: "End Time", variant: "standard", fullWidth: true }}
          />
        </MKBox>

        <MKButton color="info" onClick={fetchAvailableSeats} className={classes.input}>
          Check Available Seats
        </MKButton>

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
                  onClick={() => setSelectedSeat(seat)}
                >
                  {seat.label} ({seat.area})
                </MKButton>
              ))}
            </div>
          </>
        )}

        {selectedSeat && (
          <>
            <MKTypography mt={3} mb={1}>
              Selected: {selectedSeat.label}
            </MKTypography>
            <MKButton color="info" onClick={bookSelectedSeat}>
              Confirm Booking
            </MKButton>
          </>
        )}

        {message && (
          <MKTypography mt={2} color="info">
            {message}
          </MKTypography>
        )}
      </MKBox>
    </section>
  );
}
