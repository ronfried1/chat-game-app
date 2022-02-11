import React from "react";
import { Line, Icon } from "UIKit"
export const RadioBtn = (props) => {
    const handleChange = (id) => {
        if (props.selectedId === id) {
            props.onChange(null);
        } else {
            props.onChange(id);
        }
    }

    return (
        <div className="RadioBtn">
            {props.list.map(i => (
                <div key={i.id} onClick={() => handleChange(i.id)}>
                    <Line>
                        <Icon i={`${i.id === props.selectedId ? 'dot-circle' : 'circle'}`} />
                        {i.value}
                    </Line>
                </div>
            ))}
        </div>
    )
}