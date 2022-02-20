import { Paper } from "@material-ui/core";
import { Grid } from "@mui/material";
import React from "react";

export default function HowToPlay() {
  const paperStyle = {
    padding: 20,
    paddinTop: 0,
    height: "70vh",
    width: 280,
    margin: "20px auto",
  };
  return (
    <Grid container className="Login" style={{ marginTop: "80px" }}>
      <Paper style={paperStyle} elevation={10}>
        <Grid>Just try it on and learn from mistake god damnit</Grid>
      </Paper>
    </Grid>
  );
}
