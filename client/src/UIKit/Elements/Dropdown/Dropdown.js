import React from "react";

import { useState, useEffect, useRef } from "react";
import { Between, Icon } from "UIKit";

import './Dropdown.css';

export const Dropdown = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const wrapperRef = useRef();

    useEffect(() => {
        document.body.addEventListener('click', handleBodyClick);

        return () => {
            document.body.removeEventListener('click', handleBodyClick);
        }
    }, [])

    const handleBodyClick = (e) => {
        //wrapperRef.current is the <Dropdown /> wrap
        //e.target is the element we clicked on


        if (!wrapperRef.current) { return }

        if (!wrapperRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    }

    const handleToggle = () => {
        setIsOpen(!isOpen);
    }

    const handleSelect = (id) => {
        props.onChange(id);
        handleToggle();
    }

    const renderHead = () => {
        const selected = props.list.find(i => i.id === props.selectedId);
        if (selected) {
            return selected.value;
        }
        return 'Please Select';
    }

    return (
        <div ref={wrapperRef} className={`Dropdown ${isOpen ? 'open' : ''}`}>
            <div className="head" onClick={handleToggle}>
                <Between>
                    <h3>{renderHead()}</h3>
                    <div className="icon-wrap">
                        <Icon i={`chevron-down`} />
                    </div>
                </Between>
            </div>
            {isOpen &&
                <div className="list">
                    {props.list.map(i => (
                        <div
                            key={i.id}
                            className={`${props.selectedId === i.id ? 'selected' : ''}`}
                            onClick={() => handleSelect(i.id)}
                        >
                            {i.value}
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}