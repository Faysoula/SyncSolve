import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ number, label }) => (
  <Card sx={{ flex: 1 }}>
    <CardContent>
      <Typography variant="h3" color="secondary.light" gutterBottom>
        {number}
      </Typography>
      <Typography color="secondary.main">{label}</Typography>
    </CardContent>
  </Card>
);

export default StatCard;