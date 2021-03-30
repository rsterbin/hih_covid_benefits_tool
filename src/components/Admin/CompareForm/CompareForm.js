import React from 'react';

import IconButton from '../../UI/IconButton/IconButton';

import './CompareForm.css';

const CompareForm = (props) => {
    const buttons = [];
    let selectA = null;
    let selectB = null;
    let statement = null;

    let titleA = null;
    let titleB = null;
    if (props.presets !== null) {
        for (const opt of props.options) {
            if (opt.value === props.presets.a) {
                titleA = opt.text;
            }
            if (opt.value === props.presets.b) {
                titleB = opt.text;
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
        buttons.push(
            <IconButton key="compare"
                icon="fas fa-balance-scale-right"
                title="Compare"
                append_text="Compare"
                clicked={props.submit} />
        );
        statement = <p>Select two versions to compare:</p>;
    } else {
        if (props.presets !== null) {
            selectA = <h5>{titleA}</h5>;
            selectB = <h5>{titleB}</h5>;
        }
    }

    if (props.presets !== null) {
        statement = <p>Currently comparing <strong>{titleA}</strong> to <strong>{titleB}</strong>...</p>;
        buttons.push(
            <IconButton key="reset"
                icon_type="refresh"
                title="Reset"
                append_text="Reset"
                clicked={props.reset} />
        );
    }

    return (
        <div className="CompareForm">
            <div className="Statement">
                {statement}
            </div>
            <div className="Side SideA">
                {selectA}
            </div>
            <div className="Side SideB">
                {selectB}
            </div>
            <div className="Controls">
                {buttons}
            </div>
        </div>
    );
};

export default CompareForm;
