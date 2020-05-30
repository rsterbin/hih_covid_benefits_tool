import React from 'react';

import './SelectFilters.css';

const selectFilters = (props) => {
    let empty = null;
    if (props.empty) {
        empty = <option value="">-- {props.empty} --</option>;
    }
    const selects = props.selects.map(select => {
        const options = select.options.map(option => {
            return (
                <option key={option.value} value={option.value}>
                    {option.text}
                </option>
            );
        });
        return (
            <div className="Filter" key={select.label}>
                <label>{select.label}</label>
                <select name={select.name} onChange={props.changed}>
                    {empty}
                    {options}
                </select>
            </div>
        );
    });
    return (
        <div className="SelectFilters">
            {selects}
        </div>
    );
};

export default selectFilters;
