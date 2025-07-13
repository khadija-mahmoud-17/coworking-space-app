import React from "react";
import { Box, Grid, Typography, Link, IconButton, Button } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <Box component="footer" sx={{ backgroundColor: "#f2f2f2", color: "#000", mt: 8, pt: 4, pb: 4 }}>
      <Grid container spacing={4} justifyContent="space-around" px={4}>
        {/* Logo + Label */}
        <Grid item xs={12} md={4}>
          <img
            src={`${process.env.PUBLIC_URL}/images/Logo.png`}
            alt="Logo"
            style={{ width: "220px", marginBottom: "12px" }}
          />
          <Typography variant="h6" gutterBottom>
            The Innovation Hub
          </Typography>
          <Typography variant="body2">ROTTAL-INN</Typography>
        </Grid>

        {/* Info Links */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom>
            Important Links
          </Typography>
          <Link href="https://www.rottal-inn.de/" underline="hover" color="inherit" target="_blank">
            Rottal-Inn District
          </Link>
          <br />
          <Link
            href="https://www.th-deg.de/en/ecri-campus"
            underline="hover"
            color="inherit"
            target="_blank"
          >
            THD European Campus
          </Link>
          <br />
          <Link href="/terms" underline="hover" color="inherit">
            Data Protection
          </Link>
        </Grid>

        {/* Social and Branding */}
        <Grid item xs={12} md={3} textAlign="center">
          <Typography variant="subtitle1" gutterBottom>
            Follow Us
          </Typography>
          <Box>
            <IconButton
              href="https://www.facebook.com/profile.php?id=100086602886919"
              color="inherit"
              target="_blank"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/feed/?trk=onboarding-landing"
              color="inherit"
              target="_blank"
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
          <Box mt={2}>
            <Button
              variant="outlined"
              color="inherit"
              href="/terms"
              sx={{ borderColor: "#000", color: "#000", "&:hover": { borderColor: "#555" } }}
            >
              Data Protection
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Back to Top */}
      <Box mt={4} textAlign="center">
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ cursor: "pointer" }}
          onClick={scrollToTop}
        >
          BACK TO TOP <KeyboardArrowUpIcon fontSize="small" />
        </Typography>
      </Box>
    </Box>
  );
}
