import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

const useStyles = makeStyles(() => ({
  container: {
    padding: "100px 20px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "0 auto",
  },
  input: {
    marginBottom: "20px",
  },
}));

export default function ForgotPasswordPage() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Password reset link sent. Check your email.");
        setSubmitted(true);
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending reset email.");
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} center />
      <div className={classes.container}>
        <h2>Forgot Password</h2>
        {submitted ? (
          <p>Please check your email for the password reset link.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={classes.input}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Send Reset Link
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
