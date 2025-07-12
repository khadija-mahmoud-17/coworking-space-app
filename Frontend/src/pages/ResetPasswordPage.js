import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, InputAdornment, Button } from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
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
  error: {
    color: "red",
    marginTop: "10px",
  },
}));

export default function ResetPasswordPage() {
  const classes = useStyles();
  const { token } = useParams();
  const history = useHistory();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch(`/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password reset successful!");
      history.push("/login");
    } else {
      setError(data.message || "Password reset failed.");
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} center />
      <div className={classes.container}>
        <h2>Reset Your Password</h2>
        <form onSubmit={handleReset} noValidate>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={classes.input}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={classes.input}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="primary" fullWidth type="submit">
            Reset Password
          </Button>
          {error && <div className={classes.error}>{error}</div>}
        </form>
      </div>
    </>
  );
}
