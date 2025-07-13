import React, { useState } from "react";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SubscriptionPage() {
  const [open, setOpen] = useState(false);

  const handleSubscribe = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const renderCard = (number, title, monthly, yearly, extra) => (
    <MKBox
      borderRadius="lg"
      shadow="md"
      p={3}
      textAlign="center"
      width={{ xs: "100%", md: "25%" }}
      sx={{
        backgroundColor: "#f6f6f6",
        borderTop: "5px solid #cd8c84",
        position: "relative",
      }}
    >
      <MKTypography
        variant="h6"
        sx={{
          position: "absolute",
          top: -15,
          left: 10,
          backgroundColor: "#cd8c84",
          color: "white",
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          lineHeight: "30px",
        }}
      >
        {number}
      </MKTypography>

      <MKTypography variant="h5" mb={1} fontWeight="bold">
        {title}
      </MKTypography>

      {monthly && (
        <MKTypography variant="body1" mb={1}>
          Monthly: {monthly}
        </MKTypography>
      )}
      {yearly && (
        <MKTypography variant="body1" mb={2}>
          Yearly: {yearly}
        </MKTypography>
      )}

      {extra && (
        <MKTypography variant="caption" color="text" display="block" mb={2}>
          {extra}
        </MKTypography>
      )}

      <MKButton color="info" onClick={handleSubscribe}>
        Subscribe
      </MKButton>
    </MKBox>
  );

  return (
    <>
      <DefaultNavbar routes={routes} center />
      <MKBox pt={12} px={2}>
        <MKTypography variant="h2" align="center" mb={4}>
          Subscriptions
        </MKTypography>

        <MKBox
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="center"
          gap={3}
          mb={6}
        >
          {renderCard("1", "Student", "15$", "150$", "+Access to reservations")}
          {renderCard("2", "Professionals", "20$", "200$", "+Access to reservations")}
          {renderCard("3", "Day Pass", "2$", null, "+Valid for 24 hours")}
        </MKBox>

        <MKBox>
          <MKTypography variant="h4" mb={2}>
            Terms and Conditions
          </MKTypography>
          <MKTypography variant="body2" mb={1}>
            By subscribing you agree to our general rules of conduct and payment policy.
            Subscriptions are non‑transferable and renew automatically unless cancelled.
          </MKTypography>
          <MKTypography variant="body2">
            Please respect other guests and use the facilities responsibly. We reserve the right to
            update these terms at any time.
          </MKTypography>
        </MKBox>

        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert severity="info" sx={{ width: "100%" }} onClose={handleClose}>
            Subscription temporarily under work
          </Alert>
        </Snackbar>
      </MKBox>
    </>
  );
}
