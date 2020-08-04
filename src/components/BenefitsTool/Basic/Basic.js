import React from 'react';
import { Link } from 'react-router-dom';

import './Basic.css';

const basic = (props) => {

    return (
        <div>
            <h2>{props.lang.header}</h2>

            <div className="BasicBody" dangerouslySetInnerHTML={{__html: props.lang.body}}></div>

            {props.back ? (
            <div className="BackLink" title={props.lang.back_title}>
                <Link to={props.back}>{props.lang.back_link}</Link>
            </div>
            ) : null }
        </div>
    );
};

export default basic;
