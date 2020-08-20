import React from 'react';

import './Table.css';

const table = (props) => {
    let header_cells = props.cols.map((h) => {
        return <th key={h.key}>{h.title}</th>
    });
    let i = 0;
    let body_rows = props.rows.map((r) => {
        ++i;
        let cells = [];
        let clickable = props.clickable || {};
        let snip = props.snip || {};
        for (const h of props.cols) {
            let classes = [ 'col-' + h.key ];
            let clicked = null;
            let value = r[h.key];
            let title = null;
            if (h.key in clickable) {
                clicked = () => { clickable[h.key](r, h.key); };
                classes.push('Clickable');
            }
            if (h.key in snip) {
                let full = value;
                if (full && full.length > snip[h.key]) {
                    let short = value.substring(0, snip[h.key]) + '...';
                    value = short;
                    title = full;
                    classes.push('Snipped');
                }
            }
            cells.push(<td key={i}
                className={classes.join(' ')}
                onClick={clicked}
                title={title}>{value}</td>);
            ++i;
        }
        return <tr key={i}>{cells}</tr>;
    });
    let classes = [ 'AdminTable' ];
    if (props.size === 'tiny') {
        classes.push('TinyTable');
    }
    return (
        <div className={classes.join(' ')}>
            <table>
                <thead>
                    <tr>
                        {header_cells}
                    </tr>
                </thead>
                <tbody>
                    {body_rows}
                </tbody>
            </table>
        </div>
    );
};

export default table;
