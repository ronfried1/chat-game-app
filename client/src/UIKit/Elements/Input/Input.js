import React from "react";
import { Between } from '../../Layouts/Line/Line';
import Icon from '../Icon/Icon';
import './Input.css';

export const Input = (props) => { //value, onChange
    return (
        <div className='Input'>
            <Between>
                <input {...props} />
                {props.i && <Icon i={props.i} />}
            </Between>
        </div>
    )
}

export default Input; 