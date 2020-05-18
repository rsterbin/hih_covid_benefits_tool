import React from 'react';

import './Notice.css';

const notice = (props) => {
    if (!props.show) {
        return null;
    }
    return (
        <div className="Notice">
            <button className="CloseNotice" onClick={props.closed}><i className="fas fa-times" aria-hidden="true"></i><span>{props.lang.close_alt}</span></button>
            <div className="NoticeContent">
                <div className="NoticeMessage">
                    <h6>{props.lang.title}</h6>
                    <div dangerouslySetInnerHTML={{__html: props.lang.message}}></div>
                </div>
                <button className="AcceptButton" onClick={props.accepted}>{props.lang.accept_button_text}</button>
            </div>
        </div>
    );
};

export default notice;