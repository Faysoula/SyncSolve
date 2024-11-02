import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

const FeatureCard = ({ icon, title, description }) => (
  <Card sx={{ flex: 1 }}>
    <CardContent>
      <Box sx={{ color: "secondary.main", mb: 2 }}>
        {React.cloneElement(icon, { size: 32 })}
      </Box>
      <Typography variant="h6" color="secondary.light" gutterBottom>
        {title}
      </Typography>
      <Typography color="secondary.main">{description}</Typography>
    </CardContent>
  </Card>
);

export default FeatureCard;
