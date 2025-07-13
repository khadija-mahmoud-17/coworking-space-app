import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, InputAdornment, Icon, Button, MenuItem } from "@material-ui/core";
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
  strengthText: {
    textAlign: "left",
    fontSize: "0.85rem",
    color: "#666",
    marginBottom: "10px",
  },
}));

export default function RegisterPage() {
  const classes = useStyles();

  const [formValues, setFormValues] = useState({
    role: "Student",
    first_name: "",
    last_name: "",
    matriculation: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getPasswordStrength = (password) => {
    if (password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)) {
      return "Strong";
    } else if (password.length >= 6) {
      return "Medium";
    } else {
      return "Weak";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formValues.first_name) newErrors.first_name = "First name is required";
    if (!formValues.last_name) newErrors.last_name = "Last name is required";
    if (!formValues.email) newErrors.email = "Email is required";
    if (!formValues.password) newErrors.password = "Password is required";
    if (formValues.password !== formValues.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (formValues.role === "Student" && !formValues.matriculation)
      newErrors.matriculation = "Matriculation number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registered! Please check your email to confirm your address. ");
        window.location.href = "/login";
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during registration.");
    }
  };

  return (
    <>
      <DefaultNavbar routes={routes} center />
      <div className={classes.container}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            select
            label="Role"
            name="role"
            fullWidth
            value={formValues.role}
            onChange={handleChange}
            className={classes.input}
          >
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Professor">Professor</MenuItem>
            <MenuItem value="Guest">Guest</MenuItem>
          </TextField>

          <TextField
            label="First Name"
            name="first_name"
            variant="outlined"
            fullWidth
            value={formValues.first_name}
            onChange={handleChange}
            className={classes.input}
            error={!!errors.first_name}
            helperText={errors.first_name || " "}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon>person</Icon>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Last Name"
            name="last_name"
            variant="outlined"
            fullWidth
            value={formValues.last_name}
            onChange={handleChange}
            className={classes.input}
            error={!!errors.last_name}
            helperText={errors.last_name || " "}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon>person</Icon>
                </InputAdornment>
              ),
            }}
          />

          {formValues.role === "Student" && (
            <TextField
              label="Matriculation Number"
              name="matriculation"
              variant="outlined"
              fullWidth
              value={formValues.matriculation}
              onChange={handleChange}
              className={classes.input}
              error={!!errors.matriculation}
              helperText={errors.matriculation || " "}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon>school</Icon>
                  </InputAdornment>
                ),
              }}
            />
          )}

          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            value={formValues.email}
            onChange={handleChange}
            className={classes.input}
            error={!!errors.email}
            helperText={errors.email || " "}
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
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={formValues.password}
            onChange={handleChange}
            className={classes.input}
            error={!!errors.password}
            helperText={errors.password || " "}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
                </InputAdornment>
              ),
            }}
          />
          <div className={classes.strengthText}>
            Strength: {getPasswordStrength(formValues.password)}
          </div>

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            variant="outlined"
            fullWidth
            value={formValues.confirmPassword}
            onChange={handleChange}
            className={classes.input}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword || " "}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ cursor: "pointer" }}
                >
                  <Icon>{showConfirm ? "visibility_off" : "visibility"}</Icon>
                </InputAdornment>
              ),
            }}
          />

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Register
          </Button>
        </form>
      </div>
    </>
  );
}
