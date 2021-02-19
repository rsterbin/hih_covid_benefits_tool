import React from 'react';
import { Link } from 'react-router-dom';

import IconButton from '../../UI/IconButton/IconButton';

import './CompareForm.css';

const CompareForm = (props) => {
    let buttons = null;
    let labelA = null;
    let selectA = null;
    let labelB = null;
    let selectB = null;

    if (props.presets !== null) {
        for (const opt of props.options) {
            if (opt.value === props.presets.a) {
                labelA = <h5>{opt.text}</h5>;
            }
            if (opt.value === props.presets.b) {
                labelB = <h5>{opt.text}</h5>;
            }
        }
    }

    if (props.controls) {
        const options = props.options.map(option => {
            return (
                <option key={option.value} value={option.value}>
                    {option.text}
                </option>
            );
        });
        const empty = <option value="">- select -</option>;
        const valA = props.current && props.current.a ? props.current.a : '';
        const valB = props.current && props.current.b ? props.current.b : '';
        selectA = (
            <select name="sideA" onChange={props.changedA} value={valA}>
                {empty}
                {options}
            </select>
        );
        selectB = (
            <select name="sideB" onChange={props.changedB} value={valB}>
                {empty}
                {options}
            </select>
        );
        buttons = (
            <IconButton icon="fas fa-balance-scale-right"
                title="Compare"
                append_text="Compare"
                clicked={props.submit} />
        );
    } else {
        buttons = (
            <Link to="/admin/advanced/compare">reset</Link>
        );
    }

    return (
        <div className="CompareForm">
            <div className="Side SideA">
                {labelA}
                {selectA}
            </div>
            <div className="Side SideB">
                {labelB}
                {selectB}
            </div>
            <div className="Controls">
              {buttons}
            </div>
        </div>
    );
};

export default CompareForm;
