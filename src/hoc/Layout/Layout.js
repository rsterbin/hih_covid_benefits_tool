import React from 'react';

import './Layout.css';

const layout = (props) => {
    return (
        <div className="BenefitsTool">
            <div className="Header">
                <div className="Logo">Hand-In-Hand</div>
                <h1>COVID-19 Benefits Tool</h1>
            </div>
            <div className="MainContent">
                {props.children}
            </div>
        </div>
    );
};

export default layout;
