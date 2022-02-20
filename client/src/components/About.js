import { Paper } from "@material-ui/core";
import { Grid, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export default function About() {
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
        <Grid
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          It's all about love baby! You can chat! you can play! (Not Yet!, but
          you know...)
        </Grid>
      </Paper>
    </Grid>
  );
}
