/* eslint-disable no-param-reassign */
/**
=========================================================
* Material Kit 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com
=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { Fragment, useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// MUI components
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";

// Material Kit components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";

// Navbar components
import DefaultNavbarDropdown from "examples/Navbars/DefaultNavbar/DefaultNavbarDropdown";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";

// Theme
import breakpoints from "assets/theme/base/breakpoints";

function DefaultNavbar({ brand, routes, transparent, light, action, sticky, relative, center }) {
  const [dropdown, setDropdown] = useState("");
  const [dropdownEl, setDropdownEl] = useState("");
  const [dropdownName, setDropdownName] = useState("");
  const [arrowRef, setArrowRef] = useState(null);
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const openMobileNavbar = () => setMobileNavbar(!mobileNavbar);

  useEffect(() => {
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }

    window.addEventListener("resize", displayMobileNavbar);
    displayMobileNavbar();

    return () => window.removeEventListener("resize", displayMobileNavbar);
  }, []);

  const renderNavbarItems = routes
    .filter((route) => route.name && route.icon)
    .map(({ name, icon, href, route, collapse }) => (
      <DefaultNavbarDropdown
        key={name}
        name={name}
        icon={icon}
        href={href}
        route={route}
        collapse={Boolean(collapse)}
        onMouseEnter={({ currentTarget }) => {
          if (collapse) {
            setDropdown(currentTarget);
            setDropdownEl(currentTarget);
            setDropdownName(name);
          }
        }}
        onMouseLeave={() => collapse && setDropdown(null)}
        light={light}
      />
    ));

  const dropdownMenu = (
    <Popper
      anchorEl={dropdown}
      open={Boolean(dropdown)}
      placement="top-start"
      transition
      style={{ zIndex: 10 }}
      modifiers={[{ name: "arrow", enabled: true, options: { element: arrowRef } }]}
      onMouseEnter={() => setDropdown(dropdownEl)}
      onMouseLeave={() => {
        setDropdown(null);
        setDropdownName("");
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          sx={{
            transformOrigin: "left top",
            background: ({ palette: { white } }) => white.main,
          }}
        >
          <MKBox borderRadius="lg">
            <MKTypography variant="h1" color="white">
              <Icon ref={setArrowRef} sx={{ mt: -3 }}>
                arrow_drop_up
              </Icon>
            </MKTypography>
            <MKBox shadow="lg" borderRadius="lg" p={2} mt={2}>
              {routes.map(({ name, collapse, columns, rowsPerColumn }) => {
                if (collapse && columns && name === dropdownName) {
                  const calculateColumns = collapse.reduce((resultArray, item, index) => {
                    const chunkIndex = Math.floor(index / rowsPerColumn);
                    if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
                    resultArray[chunkIndex].push(item);
                    return resultArray;
                  }, []);

                  return (
                    <Grid key={name} container spacing={3} py={1} px={1.5}>
                      {calculateColumns.map((cols, key) => (
                        <Grid
                          key={`grid-${key}`}
                          item
                          xs={12 / columns}
                          sx={{ position: "relative" }}
                        >
                          {cols.map((col, index) => (
                            <Fragment key={col.name}>
                              <MKTypography
                                display="block"
                                variant="button"
                                fontWeight="bold"
                                textTransform="capitalize"
                                py={1}
                                px={0.5}
                                mt={index !== 0 ? 2 : 0}
                              >
                                {col.name}
                              </MKTypography>
                              {col.collapse.map((item) => (
                                <MKTypography
                                  key={item.name}
                                  component={item.route ? Link : MuiLink}
                                  to={item.route ? item.route : ""}
                                  href={item.href || ""}
                                  target={item.href ? "_blank" : ""}
                                  rel="noreferrer"
                                  minWidth="11.25rem"
                                  display="block"
                                  variant="button"
                                  color="text"
                                  textTransform="capitalize"
                                  fontWeight="regular"
                                  py={0.625}
                                  px={2}
                                  sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                                    borderRadius: borderRadius.md,
                                    cursor: "pointer",
                                    transition: "all 300ms linear",
                                    "&:hover": {
                                      backgroundColor: grey[200],
                                      color: dark.main,
                                    },
                                  })}
                                >
                                  {item.name}
                                </MKTypography>
                              ))}
                            </Fragment>
                          ))}
                          {key !== 0 && (
                            <Divider
                              orientation="vertical"
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "-4px",
                                transform: "translateY(-45%)",
                                height: "90%",
                              }}
                            />
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  );
                }
                return null;
              })}
            </MKBox>
          </MKBox>
        </Grow>
      )}
    </Popper>
  );

  return (
    <Container sx={sticky ? { position: "sticky", top: 0, zIndex: 10 } : null} maxWidth="md">
      <MKBox
        py={1}
        px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
        my={relative ? 0 : 2}
        mx={relative ? 0 : 1}
        width={relative ? "80%" : "100%"}
        borderRadius="xl"
        shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        position={relative ? "relative" : "absolute"}
        left={0}
        zIndex={3}
        sx={({ palette: { transparent: transparentColor, white }, functions: { rgba } }) => ({
          backgroundColor: transparent ? transparentColor.main : rgba(white.main, 0.8),
          backdropFilter: transparent ? "none" : "saturate(200%) blur(30px)",
        })}
      >
        <MKBox display="flex" justifyContent="space-between" alignItems="center">
          <MKBox component={Link} to="/" lineHeight={1} py={transparent ? 1.5 : 0.75}>
            <MKTypography variant="button" fontWeight="bold" color={light ? "white" : "dark"}>
              {brand}
            </MKTypography>
          </MKBox>
          <MKBox
            color="inherit"
            display={{ xs: "none", lg: "flex" }}
            ml="auto"
            mr={center ? "auto" : 0}
          >
            {renderNavbarItems}
          </MKBox>
          <MKBox ml={{ xs: "auto", lg: 0 }}>
            {action &&
              (action.type === "internal" ? (
                <MKButton
                  component={Link}
                  to={action.route}
                  variant={
                    action.color === "white" || action.color === "default"
                      ? "contained"
                      : "gradient"
                  }
                  color={action.color || "info"}
                  size="small"
                >
                  {action.label}
                </MKButton>
              ) : (
                <MKButton
                  component="a"
                  href={action.route}
                  target="_blank"
                  rel="noreferrer"
                  variant={
                    action.color === "white" || action.color === "default"
                      ? "contained"
                      : "gradient"
                  }
                  color={action.color || "info"}
                  size="small"
                >
                  {action.label}
                </MKButton>
              ))}
          </MKBox>
          <MKBox
            display={{ xs: "inline-block", lg: "none" }}
            lineHeight={0}
            py={1.5}
            pl={1.5}
            color={transparent ? "white" : "inherit"}
            sx={{ cursor: "pointer" }}
            onClick={openMobileNavbar}
          >
            <Icon fontSize="default">{mobileNavbar ? "close" : "menu"}</Icon>
          </MKBox>
        </MKBox>
        <MKBox
          bgColor={transparent ? "white" : "transparent"}
          shadow={transparent ? "lg" : "none"}
          borderRadius="xl"
          px={transparent ? 2 : 0}
        >
          {mobileView && <DefaultNavbarMobile routes={routes} open={mobileNavbar} />}
        </MKBox>
      </MKBox>
      {dropdownMenu}
    </Container>
  );
}

// Default props
DefaultNavbar.defaultProps = {
  brand: "",
  transparent: false,
  light: false,
  action: false,
  sticky: false,
  relative: false,
  center: false,
};

// Prop types
DefaultNavbar.propTypes = {
  brand: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.shape).isRequired,
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(["external", "internal"]).isRequired,
      route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "light",
        "default",
        "white",
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
  sticky: PropTypes.bool,
  relative: PropTypes.bool,
  center: PropTypes.bool,
};

export default DefaultNavbar;
