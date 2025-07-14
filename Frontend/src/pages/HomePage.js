// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

// Sections & Components
import ImageCarousel from "components/ImageCarousel";
import ScrollTopButton from "components/ScrollTopButton";
import BookSection from "sections/BookSection";
import SubscriptionSection from "sections/SubscriptionSection";
import AboutSection from "sections/AboutSection";
import MKProgress from "components/MKProgress";
import MKTypography from "components/MKTypography";

// Material-UI
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@mui/material";

const useStyles = makeStyles(() => ({
  crowdContainer: {
    padding: "60px 20px",
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: "1.2rem",
    marginBottom: "10px",
  },
}));

export default function HomePage() {
  const classes = useStyles();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("user");

  const [occupancy, setOccupancy] = useState(0);
  const [crowdStatus, setCrowdStatus] = useState("");
  const [crowdColor, setCrowdColor] = useState("info");
  const capacity = 35;

  const bg1 = `${process.env.PUBLIC_URL}/images/inohub.png`;
  const bg2 = `${process.env.PUBLIC_URL}/images/CWS-image.jpg`;
  const bg3 = `${process.env.PUBLIC_URL}/images/CWS-image3.webp`;
  const bg4 = `${process.env.PUBLIC_URL}/images/CWS-image4.jpg`;
  const bg5 = `${process.env.PUBLIC_URL}/images/CWS-image2.webp`;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/crowd-status", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setOccupancy(data.people_inside);
        setCrowdStatus(data.status);
        setCrowdColor(data.color);
      } catch (err) {
        console.error("Error fetching crowd status", err);
      }
    };

    fetchStatus(); // initial fetch
    const interval = setInterval(fetchStatus, 10000); // repeat every 10s

    return () => clearInterval(interval); // cleanup when component unmounts
  }, []);

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const textColor =
    crowdColor === "green" ? "#4caf50" : crowdColor === "warning" ? "#fbc02d" : "#f44336";

  return (
    <>
      <DefaultNavbar routes={routes} center />

      <Box borderBottom="1px solid black">
        <ImageCarousel
          images={[bg1, bg4, bg2, bg3, bg5]}
          title="Welcome to the Co-Working Space!"
        />
      </Box>

      <Box borderBottom="1px solid black">
        <div className={classes.crowdContainer}>
          <MKTypography variant="h4" mt={6} mb={1}>
            Current Occupancy: {occupancy} / {capacity}
          </MKTypography>

          <MKTypography
            variant="body1"
            mb={2}
            className={classes.statusText}
            style={{ color: textColor }}
          >
            Crowd Level: {crowdStatus}
          </MKTypography>

          <MKProgress
            color={crowdColor}
            value={Math.min((occupancy / capacity) * 100, 100)}
            label
          />
        </div>
      </Box>

      <Box id="book" borderBottom="1px solid black">
        {isLoggedIn ? (
          <BookSection />
        ) : (
          <MKTypography variant="h5" textAlign="center" py={6}>
            Please <a href="/login">log in</a> to book a seat.
          </MKTypography>
        )}
      </Box>

      <Box id="subscriptions" borderBottom="1px solid black">
        <SubscriptionSection />
      </Box>

      <Box id="about" borderBottom="1px solid black">
        <AboutSection />
      </Box>

      <ScrollTopButton />
    </>
  );
}
