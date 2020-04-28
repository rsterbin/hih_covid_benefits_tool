import React from 'react';

import './Layout.css';

const layout = (props) => {
    return (
        <div className="BenefitsTool">
            <div className="Logo">
                <a href="https://domesticemployers.org/"><img src="/images/logo.png" alt="Hand-In-Hand: The Domestic Employers Network" /></a>
            </div>
            <div className="Header">
                <h1><a href="/">COVID-19 Benefits Tool</a></h1>
            </div>
            <div className="MainContent">
                {props.children}
            </div>
        </div>
    );
};

export default layout;
