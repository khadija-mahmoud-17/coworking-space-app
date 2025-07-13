import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

export default function RoleDialog({ open, onSelect }) {
  const handleSelect = (role) => {
    if (onSelect) onSelect(role);
  };

  return (
    <Dialog open={open} onClose={() => handleSelect("")}>
      <DialogTitle>Select your role</DialogTitle>
      <DialogContent style={{ textAlign: "center" }}>
        <Button
          onClick={() => handleSelect("Student")}
          color="primary"
          variant="contained"
          style={{ margin: 4 }}
        >
          Student
        </Button>
        <Button
          onClick={() => handleSelect("Professor")}
          color="primary"
          variant="contained"
          style={{ margin: 4 }}
        >
          Prof
        </Button>
        <Button
          onClick={() => handleSelect("Guest")}
          color="primary"
          variant="contained"
          style={{ margin: 4 }}
        >
          Guest
        </Button>
      </DialogContent>
    </Dialog>
  );
}

RoleDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,
};
