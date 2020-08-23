import React, { useState } from 'react';

import IconButton from '../IconButton/IconButton';

import './Table.css';

const Table = (props) => {

    const [ hiddenCols, hideCols ] = useState(true);

    const col_class = (key) => {
        return key.replace(/[^a-z\-0-9]+/g, '-').replace(/-+/, '-');
    };

    let header_cells = props.cols.map((h) => {
        let classes = [ col_class(h.key) ];
        if (props.toggle_cols && props.toggle_cols[h.key]) {
            classes.push('ToggleTarget');
            if (hiddenCols) {
                classes.push('ToggleHidden');
            } else {
                classes.push('ToggleShown');
            }
        }
        return <th key={h.key} className={classes.join(' ')}>{h.title}</th>
    });

    let i = 0;
    let body_rows = props.rows.map((r) => {
        ++i;
        let cells = [];
        let clickable = props.clickable || {};
        let snip = props.snip || {};
        for (const h of props.cols) {
            let classes = [ col_class(h.key) ];
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
            if (props.toggle_cols && props.toggle_cols[h.key]) {
                classes.push('ToggleTarget');
                if (hiddenCols) {
                    classes.push('ToggleHidden');
                } else {
                    classes.push('ToggleShown');
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
    if (props.toggle_cols) {
        classes.push('ToggleCols');
    }

    let toggler = null;
    if (props.toggle_cols) {
        let icon = 'far fa-eye-slash';
        let text = 'collapse columns';
        if (props.toggle_collapse_title) {
            text = props.toggle_collapse_title;
        }
        if (hiddenCols) {
            icon = 'far fa-eye';
            text = 'expand columns';
            if (props.toggle_expand_title) {
                text = props.toggle_expand_title;
            }
        }
        toggler = (
            <div className="ViewToggle">
                <IconButton icon={icon}
                    clicked={() => hideCols(!hiddenCols)}
                    append_text={text} />
            </div>
        );
    }

    return (
        <div className={classes.join(' ')}>
            {toggler}
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

export default Table;
