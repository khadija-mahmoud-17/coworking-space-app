import React from "react";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";

export default function TermsPage() {
  return (
    <>
      <DefaultNavbar routes={routes} center />
      <div style={{ padding: "100px 20px" }}>
        <h1>Terms and Conditions</h1>
      </div>
    </>
  );
}
