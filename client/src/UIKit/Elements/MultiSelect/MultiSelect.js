import React from "react";
import { Checkbox } from "../Checkbox/Checkbox";

export const MultiSelect = (props) => {
  const handleChange = (id) => {
    const newList = props.list.map((i) => {
      if (i.id === id) {
        i.selected = !i.selected;
      }
      return i;
    });
    props.onChange(newList);
  };

  return (
    <div className="MultiSelect">
      {props.list.map((i) => (
        <Checkbox
          key={i.id}
          checked={i.selected}
          onChange={() => handleChange(i.id)}
        >
          {i.value}
        </Checkbox>
      ))}
    </div>
  );
};
