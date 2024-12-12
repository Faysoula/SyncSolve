

/**
 * A card component that displays a feature with an icon, title, and description.
 *
 * @component
 * @param {Object} props - The component props
 * @param {React.ReactElement} props.icon - The icon element to be displayed
 * @param {string} props.title - The title of the feature
 * @param {string} props.description - The description of the feature
 * @returns {React.ReactElement} A Material-UI Card component containing the feature information
 *
 * @example
 * <FeatureCard
 *   icon={<SomeIcon />}
 *   title="Feature Title"
 *   description="Feature description goes here"
 * />
 */
import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

// FeatureCard component
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
