import React from "react";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import { Container, Typography, Box } from "@mui/material";

export default function TermsPage() {
  return (
    <>
      <DefaultNavbar routes={routes} center />

      <Container maxWidth="md" sx={{ pt: 12, pb: 6 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Privacy Policy & Terms of Use
        </Typography>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            1. General Information
          </Typography>
          <Typography paragraph>
            Protecting your personal data is important to us. This privacy policy explains how we
            collect, process, and protect your data when you use our website and its services —
            especially booking features and user account functionalities.
          </Typography>
          <Typography paragraph>
            <strong>Responsible for Data Processing:</strong>
            <br />
            Innovation Hub
            <br />
            Dr-Bachl-Straße 3, 84347 Pfarrkichen, Germany
            <br />
            1he.1nnovation.hub@gmail.com
          </Typography>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            2. Data We Collect
          </Typography>
          <Typography paragraph>
            We only collect and process personal data that is necessary for providing our services,
            in accordance with the GDPR.
          </Typography>
          <ul>
            <li>First and last name</li>
            <li>Email address</li>
            <li>Hashed password (never stored in plain text)</li>
            <li>User role (e.g., Student, Professor, Guest)</li>
            <li>Optional student matriculation number</li>
            <li>Booking details (seat number, date, time)</li>
            <li>IP address</li>
            <li>Timestamps of actions (registration, login, booking)</li>
          </ul>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            3. Purpose of Processing
          </Typography>
          <ul>
            <li>Account registration and authentication</li>
            <li>Seat booking and user management</li>
            <li>Sending confirmation emails and 2FA codes</li>
            <li>Handling password reset requests</li>
            <li>Ensuring website security and fraud prevention</li>
            <li>Anonymous usage analytics and system optimization</li>
          </ul>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            4. Legal Basis
          </Typography>
          <ul>
            <li>Art. 6(1)(b) GDPR – performance of a contract (e.g., seat booking)</li>
            <li>Art. 6(1)(a) GDPR – your consent (e.g., contact form)</li>
            <li>
              Art. 6(1)(f) GDPR – legitimate interests (e.g., security, performance monitoring)
            </li>
          </ul>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            5. Security of Your Data
          </Typography>
          <Typography paragraph>
            We implement technical and organizational measures to ensure your data is secure and
            protected from unauthorized access or loss.
          </Typography>
          <ul>
            <li>SSL encryption of all connections</li>
            <li>Password hashing using secure algorithms (e.g., bcrypt)</li>
            <li>Two-factor authentication (2FA) during login</li>
            <li>Auto-logout after inactivity</li>
            <li>Role-based access control and database protection</li>
          </ul>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            6. Your Rights
          </Typography>
          <Typography paragraph>Under the GDPR, you have the following rights:</Typography>
          <ul>
            <li>Right of access to your stored data</li>
            <li>Right to rectify inaccurate data</li>
            <li>Right to request deletion (e.g., via your profile settings)</li>
            <li>Right to restrict or object to data processing</li>
            <li>Right to data portability</li>
            <li>Right to lodge a complaint with a data protection authority</li>
          </ul>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            7. Contact Form
          </Typography>
          <Typography paragraph>
            If you contact us via the contact form, your submitted data (name, email, message) will
            be used solely to respond to your request. This data will not be shared with third
            parties without your consent.
          </Typography>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            8. Cookies and Tracking
          </Typography>
          <Typography paragraph>
            We only use essential cookies required for the website to function. We do not use any
            tracking cookies or marketing analytics tools.
          </Typography>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            9. Data Sharing
          </Typography>
          <Typography paragraph>
            We do not share your personal data with third parties unless required by law or
            necessary for providing our service (e.g., email service provider for confirmation
            codes).
          </Typography>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            10. Data Retention and Deletion
          </Typography>
          <ul>
            <li>Booking data is retained for up to 12 months.</li>
            <li>
              User accounts can be deleted at any time by the user, which also deletes associated
              booking history.
            </li>
            <li>Backups are performed regularly and deleted after a retention period.</li>
          </ul>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            11. Updates to This Policy
          </Typography>
          <Typography paragraph>
            We may update this policy from time to time. Updates will be published on this page and
            take effect immediately upon posting.
          </Typography>
        </Box>

        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            12. Terms of Use
          </Typography>
          <ul>
            <li>You must have a valid account to book a seat.</li>
            <li>Seat bookings are limited to a maximum of 4 hours.</li>
            <li>Bookings are only valid for the selected time and expire automatically.</li>
            <li>
              Abusing the system (e.g., repeated no-shows or spamming bookings) may result in
              account suspension.
            </li>
            <li>Sharing login credentials with others is prohibited.</li>
            <li>Deleting your account will also permanently delete all your associated data.</li>
          </ul>
        </Box>

        <Typography variant="body2" fontWeight="medium">
          <strong>Last Updated:</strong> July 13, 2025
        </Typography>
      </Container>
    </>
  );
}
