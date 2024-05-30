import { Alert } from "@mui/material";
import { useState, useEffect } from "react";

interface CustomAlertProps {
    severity: "error" | "warning" | "info" | "success";
    message: string;
  }

const CustomAlert = ({ severity, message }: CustomAlertProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9 }}>
      {open && (
        <Alert severity={severity} onClose={handleClose}>
          {message}
        </Alert>
      )}
    </div>
  );
};

export default CustomAlert;
