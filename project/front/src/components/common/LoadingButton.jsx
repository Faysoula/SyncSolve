import React from "react";
import { Button, CircularProgress } from "@mui/material";

const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <Button
      {...props}
      disabled={loading}
      sx={{
        mt: 2,
        backgroundColor: "#C77DFF",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#9D4EDD",
        },
        ...props.sx,
      }}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default LoadingButton;
