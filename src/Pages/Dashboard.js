import React from "react";
import { Box, Typography } from "@mui/material";
import DadosWebHook from "../Components/DadosWebHook/DadosWebHook";
const DashBoard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">Dashboard</Typography>
      <Box sx={{ width: "100%" }}>
        <DadosWebHook />
      </Box>
    </Box>
  );
};

export default DashBoard;
