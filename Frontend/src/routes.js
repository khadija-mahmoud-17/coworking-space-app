// src/routes.js
import React from "react";
import Icon from "@mui/material/Icon";
import LoginPage from "pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import LogoutPage from "./pages/Logout";
import TermsPage from "./pages/TermsPage";
import ProfilePage from "pages/ProfilePage";

const routes = [
  {
    name: "Home",
    icon: <Icon>home</Icon>,
    route: "/",
    component: HomePage,
  },
  {
    name: "Book a Seat",
    icon: <Icon>event_seat</Icon>,
    route: "/#book",
  },
  {
    name: "Subscriptions",
    icon: <Icon>gavel</Icon>,
    route: "/#subscriptions",
  },
  {
    name: "About Us",
    icon: <Icon>info</Icon>,
    route: "/#about",
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
    name: "Logout",
    icon: <Icon>logout</Icon>,
    route: "/logout",
    component: LogoutPage,
  },
  {
    name: "Terms",
    route: "/terms",
    component: TermsPage,
  },
  {
    name: "Profile",
    icon: <Icon>person</Icon>,
    route: "/profile",
    component: ProfilePage,
  },
];

export default routes;
