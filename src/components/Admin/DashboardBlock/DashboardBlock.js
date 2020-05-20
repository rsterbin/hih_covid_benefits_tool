import React from 'react';

import Spinner from '../../UI/Spinner/Spinner';
import Table from '../../UI/Table/Table';

import './DashboardBlock.css';

const dashboardBlock = (props) => {
    let body = null;
    if (props.loaded) {
        body = (
            <div className="DashboardBlockBody Loaded">
                <Table rows={props.rows} cols={props.cols} />
            </div>
        );
    } else {
        body = (
            <div className="DashboardBlockBody Waiting">
                <Spinner />
            </div>
        );
    }
    return (
        <div className="DashboardBlock">
            <h4>{props.title}</h4>
            {body}
        </div>
    );
};

export default dashboardBlock;
