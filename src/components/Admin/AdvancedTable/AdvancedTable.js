import React from 'react';

import Table from '../../UI/Table/Table';

import './AdvancedTable.css';

const advancedTable = (props) => {
    return (
        <div className="AdvancedTable">
            <h3>{props.title}</h3>
            <Table {...props} />
        </div>
    );
};

export default advancedTable;
