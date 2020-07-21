import React from 'react';

import Table from '../../UI/Table/Table';
import IconButton from '../../UI/IconButton/IconButton';

import './CompareTable.css';

const LIST_LAYOUT = 'list';
const COMPARE_LAYOUT = 'compare';

const CompareTable = (props) => {

    let classes = [ 'CompareTable' ];
    if (props.current === COMPARE_LAYOUT) {
        classes.push('CompareLayout');
    } else {
        classes.push('ListLayout');
    }

    const doChange = (e, choice) => {
        e.preventDefault();
        props.changed(choice);
    };
    const layout_selector = (
        <div className="LayoutToggle">
            <IconButton icon="fas fa-table"
                title="List View"
                clicked={(e) => doChange(e, LIST_LAYOUT)}
                append_text="List"
                add_class={props.current === LIST_LAYOUT ? 'Active' : null} />
            <IconButton icon="fas fa-columns"
                title="Compare View"
                clicked={(e) => doChange(e, COMPARE_LAYOUT)}
                append_text="Compare"
                add_class={props.current === COMPARE_LAYOUT ? 'Active' : null} />
        </div>
    );

    const rows = props.rows || [];
    const cols = props.cols || [];
    const other = props.other || {};

    return (
        <div className={classes.join(' ')}>
            {layout_selector}
            <Table {...other}
                rows={rows}
                cols={cols} />
        </div>
    );
};

export { LIST_LAYOUT, COMPARE_LAYOUT };
export default CompareTable;
