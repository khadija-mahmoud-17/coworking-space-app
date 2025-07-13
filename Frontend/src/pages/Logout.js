// src/pages/Logout.js
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function LogoutPage() {
  const history = useHistory();

  useEffect(() => {
    // Clear session
    localStorage.removeItem("user");

    // Redirect to homepage
    history.replace("/");
  }, [history]);

  return null;
}
