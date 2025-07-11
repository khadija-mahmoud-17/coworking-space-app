// src/pages/LogoutPage.js
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

function LogoutPage() {
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem("user");
    alert("You have been logged out.");
    history.push("/login");
  }, [history]);

  return null; // Don’t show anything
}

export default LogoutPage;
