// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Collapse from "@mui/material/Collapse";
import Icon from "@mui/material/Icon";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function DefaultNavbarDropdown({
  name,
  icon,
  children,
  collapseStatus,
  light,
  href,
  route,
  collapse,
  ...rest
}) {
  const user = JSON.parse(localStorage.getItem("user"));

  const linkComponent = {
    component: "a",
    href,
    target: "_blank",
    rel: "noreferrer",
  };

  const routeComponent = {
    component: Link,
    to: route,
  };

  return (
    <>
      <MKBox
        {...rest}
        mx={1}
        p={1}
        display="flex"
        alignItems="baseline"
        color={light ? "white" : "dark"}
        opacity={light ? 1 : 0.6}
        sx={{ cursor: "pointer", userSelect: "none" }}
        {...(route && routeComponent)}
        {...(href && linkComponent)}
      >
        <MKTypography
          variant="body2"
          lineHeight={1}
          color="inherit"
          sx={{ alignSelf: "center", "& *": { verticalAlign: "middle" } }}
        >
          {icon}
        </MKTypography>

        <MKTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ fontWeight: "100%", ml: 1, mr: 0.25 }}
        >
          {name}
        </MKTypography>

        {/* Arrow icon for collapsible dropdown */}
        {collapse && (
          <MKTypography variant="body2" color={light ? "white" : "dark"} ml="auto">
            <Icon sx={{ fontWeight: "normal", verticalAlign: "middle" }}>keyboard_arrow_down</Icon>
          </MKTypography>
        )}
      </MKBox>

      {/* Render dropdown children */}
      {children && (
        <Collapse in={Boolean(collapseStatus)} timeout={400} unmountOnExit>
          {children}
        </Collapse>
      )}

      {/* Conditionally show logout if user is logged in and under an "Account"-like dropdown */}
      {user && typeof name === "string" && name.toLowerCase().includes("account") && (
        <MKBox px={2} py={1}>
          <MKTypography
            component={Link}
            to="/logout"
            variant="button"
            fontWeight="medium"
            color={light ? "white" : "dark"}
            sx={{ display: "inline-block", cursor: "pointer" }}
          >
            Logout
          </MKTypography>
        </MKBox>
      )}
    </>
  );
}

// Default props
DefaultNavbarDropdown.defaultProps = {
  children: false,
  collapseStatus: false,
  light: false,
  href: "",
  route: "",
};

// Prop types
DefaultNavbarDropdown.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.node,
  collapseStatus: PropTypes.bool,
  light: PropTypes.bool,
  href: PropTypes.string,
  route: PropTypes.string,
  collapse: PropTypes.bool.isRequired,
};

export default DefaultNavbarDropdown;
