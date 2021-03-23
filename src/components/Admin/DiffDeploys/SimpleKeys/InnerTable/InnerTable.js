import React from 'react';

import { getMatchType } from '../../../../../utils/comparisons';

import './InnerTable.css';

const innerTable = (props) => {
    if (!Array.isArray(props.columns)) {
        return null;
    }

    let tdata = [];
    if (props.data !== null && props.keyname in props.data) {
        tdata = props.data[props.keyname];
    }

    let hl = {};
    if (props.highlight !== null && props.keyname in props.highlight) {
        if (getMatchType(props.keyname, props.highlight) === 'complexDiff') {
            hl = props.highlight[props.keyname].diff;
        }
    }

    const rows = tdata.map(row => {
        let c = null;
        let cells = [];
        for (const col of props.columns) {
            if (col.hl) {
                if (row[col.key] in hl) {
                    c = getMatchType(row[col.key], hl);
                }
            }
            let display = row[col.key];
            if (typeof col.display === 'function') {
                display = col.display(row);
            }
            cells.push(<td className={col.class}>{display}</td>);
        }
        return (
            <tr key={row.letter} className={c}>
                {cells}
            </tr>
        );
    });

    return (
        <table className="InnerTable">
            <thead>
                <tr>
                    {props.columns.map(col => <th className={col.class}>{col.label}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
};

export default innerTable;
