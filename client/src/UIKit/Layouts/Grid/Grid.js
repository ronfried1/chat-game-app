import React from "react";
import "./Grid.css";

export const Grid = (props) => {
  return (
    <div className={`Grid ${props.className || ""}`}>{props.children}</div>
  );
};

export const GridRows = (props) => {
  return <Grid {...props} className="rows" />;
};

export const GridCols = (props) => {
  return <Grid {...props} className="columns" />;
};

export default Grid;
