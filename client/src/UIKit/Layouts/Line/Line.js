import React from "react";

import './Line.css';

export const Line = (props) => {
    return (
        <div className={`Line ${props.className || ''}`}>
            {props.children}
        </div>
    )
}

export const Between = (props) => {
    return <Line {...props} className="between" />
}

export const Rows = (props) => {
    return <Line {...props} className="rows" />
}

export default Line;