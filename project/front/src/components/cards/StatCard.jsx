/**
 * A Material-UI Card component for displaying statistical information.
 *
 * @component
 * @param {Object} props - The component props
 * @param {(number|string)} props.number - The numerical value or statistic to display
 * @param {string} props.label - The label describing the statistic
 * @returns {JSX.Element} A card displaying a statistic and its label
 *
 * @example
 * <StatCard number={42} label="Total Users" />
 */
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
