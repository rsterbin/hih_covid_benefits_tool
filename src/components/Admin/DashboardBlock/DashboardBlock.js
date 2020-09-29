import React from 'react';

import Spinner from '../../UI/Spinner/Spinner';
import IconButton from '../../UI/IconButton/IconButton';
import IconLink from '../../UI/IconLink/IconLink';
import Message from '../../UI/Message/Message';
import Table from '../../UI/Table/Table';

import './DashboardBlock.css';

const dashboardBlock = (props) => {
    let body = null;
    if (props.loaded) {
        let refresh = null;
        if (props.refresh) {
            refresh = (
                <div className="RefreshWrapper">
                    <IconButton icon_type="refresh"
                        clicked={props.refresh} />
                </div>
            );
        }
        let data = null;
        let more = null;
        if (props.rows.length > 0) {
            data = (
                <div className="YesData">
                    <Table size="tiny" rows={props.rows} cols={props.cols} />
                </div>
            );
            if (props.more) {
                more = (
                    <div className="MoreLink">
                        <IconLink icon="fas fa-arrow-alt-circle-right"
                            to={props.more}
                            title="See more"
                            append_text="More" />
                    </div>
                );
            }
        } else {
            data = <div className="NoData">There is nothing to show</div>
        }
        body = (
            <div className="DashboardBlockBody Loaded">
                {refresh}
                {data}
                {more}
            </div>
        );
    } else {
        let message = null;
        if (props.error) {
            message = (
                <Message type="error"
                    text={props.error}
                    tryagain={props.refresh} />
            );
        }
        body = (
            <div className="DashboardBlockBody Waiting">
                <Spinner />
                {message}
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
