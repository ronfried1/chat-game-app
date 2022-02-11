import React from "react";

import { Between } from '../../Layouts/Line/Line';
import Icon from '../Icon/Icon';
import './Btn.css';

export const Btn = (props) => {
    return (
        <button className="Btn" onClick={props.onClick}>
            <Between>
                {props.children}
                {props.i && <Icon i={props.i} />}
            </Between>
        </button>
    )
}

export default Btn;