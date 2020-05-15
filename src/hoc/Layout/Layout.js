import React from 'react';

import './Layout.css';

const layout = (props) => {
    return (
        <div className="BenefitsTool">
            <div className="Logo">
                <a href="https://domesticemployers.org/"><img src="/images/logo.png" alt={props.lang.logo_alt_text} /></a>
            </div>
            <div className="Header">
                <h1><a href="/">{props.lang.header_title}</a></h1>
            </div>
            <div className="MainContent">
                {props.children}
            </div>
        </div>
    );
};

export default layout;
