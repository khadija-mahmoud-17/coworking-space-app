import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment, TextField, Icon, Button, MenuItem } from "@material-ui/core";
import EmailIcon from "@material-ui/icons/Email";
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
  link: {
    marginTop: "15px",
    display: "block",
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  const history = useHistory();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, role }),
      });

      const data = await res.json();

      if (res.ok && data.require_2fa) {
        alert("Verification code sent to your email.");
        setShowCodeInput(true);
      } else if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        history.push("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred while logging in.");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        history.push("/");
      } else {
        alert(data.message || "Verification failed");
      }
    } catch (err) {
      console.error("2FA error:", err);
      alert("An error occurred during verification.");
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} center />
      <div className={classes.container}>
        <h2>Login</h2>
        <form onSubmit={showCodeInput ? handleVerifyCode : handleLogin} noValidate>
          <TextField
            select
            label="Select Role"
            variant="outlined"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={classes.input}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Professor">Professor</MenuItem>
            <MenuItem value="Guest">Guest</MenuItem>
          </TextField>

          <TextField
            label={
              role === "Student"
                ? "Matriculation Number or Student Email"
                : role === "Professor"
                ? "Work Email"
                : "Personal Email"
            }
            type={role === "Student" ? "text" : "email"}
            variant="outlined"
            fullWidth
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={classes.input}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes.input}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </Icon>
                </InputAdornment>
              ),
            }}
          />

          {showCodeInput && (
            <TextField
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              variant="outlined"
              fullWidth
              className={classes.input}
              required
            />
          )}

          <Button variant="contained" color="primary" fullWidth type="submit">
            {showCodeInput ? "Verify Code" : "Log In"}
          </Button>

          <div className={classes.link}>
            Don&apos;t have an account? <Link to="/register">Register here</Link>
          </div>
          <div className={classes.link}>
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </form>
      </div>
    </>
  );
}
