import React from "react";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  container: {
    padding: "100px 20px",
    textAlign: "center",
  },
}));

export default function HomePage() {
  const classes = useStyles();

  return (
    <>
      <DefaultNavbar routes={routes} center />
      <div className={classes.container}>
        <h1>Welcome to the Co-Working Space!</h1>
      </div>
    </>
  );
}
