import React, { useEffect, useState } from "react";
import MKBox from "components/MKBox";
import Icon from "@mui/material/Icon";

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MKBox
      onClick={scrollToTop}
      position="fixed"
      bottom="2rem"
      right="2rem"
      display={visible ? "flex" : "none"}
      alignItems="center"
      justifyContent="center"
      width="3rem"
      height="3rem"
      borderRadius="50%"
      color="white"
      sx={{ backgroundColor: "info.main", cursor: "pointer", zIndex: 1000 }}
    >
      <Icon>keyboard_arrow_up</Icon>
    </MKBox>
  );
}

export default ScrollTopButton;
