import React from "react";

import { Icon, Line } from "UIKit";

import './Checkbox.css';

export const Checkbox = (props) => {

    return (
        <div className="Checkbox" onClick={() => props.onChange(!props.checked)}>
            <Line>
                <Icon i={props.checked ? 'check-square' : 'square'} />
                {props.children}
            </Line>
        </div>
    )
}