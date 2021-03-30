import React from 'react';

import JsonBlock from '../../../UI/JsonBlock/JsonBlock';

import './RawData.css';

const RawData = (props) => {
    return (
        <div className="RawData">
            <div className="RawTitle">
                <span>{props.title}</span>
                <button className="mockLink CloseRaw" onClick={props.closed}>(close)</button>
            </div>
            <div className="RawBody">
                <JsonBlock data={props.data} color={props.color} />
            </div>
        </div>
    );
};

export default RawData;
