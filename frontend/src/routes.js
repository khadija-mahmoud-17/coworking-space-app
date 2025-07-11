/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com
=========================================================
*/

import React from "react";
import Icon from "@mui/material/Icon";

// Pages
import HomePage from "pages/HomePage";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import BookPage from "pages/BookPage";
import AboutPage from "pages/About";
import TermsPage from "pages/TermsPage";
import LogoutButton from "pages/LogoutButton";

const routes = [
  {
    name: "Home",
    icon: <Icon>home</Icon>,
    route: "/",
    component: HomePage,
  },
  {
    name: "Login",
    icon: <Icon>login</Icon>,
    route: "/login",
    component: LoginPage,
  },
  {
    name: "Register",
    icon: <Icon>person_add</Icon>,
    route: "/register",
    component: RegisterPage,
  },
  {
    name: "Book a Seat",
    icon: <Icon>event_seat</Icon>,
    route: "/book-seat",
    component: BookPage,
  },
  {
    name: "About Us",
    icon: <Icon>info</Icon>,
    route: "/about",
    component: AboutPage,
  },
  {
    name: "Terms & Conditions",
    icon: <Icon>gavel</Icon>,
    route: "/terms",
    component: TermsPage,
  },

  {
    name: "Logout",
    route: "/logout",
    component: LogoutButton,
  },
];

export default routes;
