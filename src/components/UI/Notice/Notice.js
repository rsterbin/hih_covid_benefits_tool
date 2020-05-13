import React from 'react';

import './Notice.css';

const notice = (props) => {
    if (!props.show) {
        return null;
    }
    return (
        <div className="Notice">
            <button className="CloseNotice" onClick={props.closed}><i className="fas fa-times" aria-hidden="true"></i><span>close</span></button>
            <div className="NoticeContent">
                <div className="NoticeMessage">
                    <h6>{props.title}</h6>
                    {props.message}
                </div>
                <button className="AcceptButton" onClick={props.accepted}>Accept and Close</button>
            </div>
        </div>
    );
};

export default notice;
