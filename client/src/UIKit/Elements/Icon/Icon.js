import React from "react";

export const Icon = (props) => {
    return (
        <div className="Icon">
            <i className={`${props.type || 'fas'} fa-${props.i}`}></i>
        </div>
    )
}

export const IconR = (props) => {
    return (
        <Icon {...props} type='far' />
    )
}


export default Icon;