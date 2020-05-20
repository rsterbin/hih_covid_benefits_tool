import React from 'react';

import './AdminPage.css';

const adminPage = (props) => {
    return (
        <div className="AdminSection">
            {props.advanced ?
                <p className="Warning"><i>Should you be here?</i></p>
            : null}
            <h2>{props.title}</h2>
            <p className="AdminBreadcrumbs">{props.breadcrumbs.join(' > ')}</p>
            <div className="AdminBody">
                {props.children}
            </div>
        </div>
    );
};

export default adminPage;
